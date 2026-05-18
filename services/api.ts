import { supabase } from './supabaseConfig';
import { Database } from '../types/database';
import { File } from 'expo-file-system';
import {
  sanitizeText,
  validateTitle,
  validateDescription,
  validatePriority,
  validateLocation,
  validateStatus,
  validateFileExtension,
  validateFileSize,
  sanitizeFileName,
  validateUUID,
  checkRateLimit,
  requireAuth,
} from './security';


export type Report = Database['public']['Tables']['reports']['Row'];
export type Attachment = Database['public']['Tables']['attachments']['Row'];

export interface ReportWithAttachments extends Report {
  attachments: Attachment[];
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface ReportData {
  title: string;
  description: string;
  priority?: number; // 1: Low, 2: Medium, 3: High
  location: LocationData;
  imageUri: string;
  userId: string;
}

// ─── SUBMIT REPORT (Citizen) ─────────────────────────────────────────────────

export const submitReport = async (data: ReportData) => {
  // ── Auth check ──
  const user = await requireAuth();

  // ── Rate limit (max 5 reports per minute) ──
  const rateCheck = checkRateLimit('submitReport', 5, 60000);
  if (!rateCheck.allowed) {
    const seconds = Math.ceil((rateCheck.retryAfterMs || 0) / 1000);
    throw new Error(`Too many submissions. Please wait ${seconds} seconds.`);
  }

  // ── Sanitize & validate inputs ──
  const sanitizedTitle = sanitizeText(data.title);
  const titleCheck = validateTitle(sanitizedTitle);
  if (!titleCheck.valid) throw new Error(titleCheck.error);

  const sanitizedDescription = sanitizeText(data.description);
  const descCheck = validateDescription(sanitizedDescription);
  if (!descCheck.valid) throw new Error(descCheck.error);

  const priority = data.priority || 2;
  if (!validatePriority(priority)) {
    throw new Error('Invalid priority value. Must be 1, 2, or 3.');
  }

  if (!validateLocation(data.location)) {
    throw new Error('Invalid location coordinates.');
  }

  // Ensure the userId matches the authenticated user (prevent impersonation)
  if (data.userId !== user.id) {
    throw new Error('Unauthorized: Cannot submit reports for other users.');
  }

  // ── Create Report ──
  const { data: reportData, error: reportError } = await supabase
    .from('reports')
    .insert({
      title: sanitizedTitle,
      description: sanitizedDescription,
      priority,
      status: 0, // Pending
      reporter_id: user.id, // Use authenticated user ID, not the passed userId
      location: JSON.stringify(data.location),
    })
    .select()
    .single();

  if (reportError) {
    throw new Error(`Failed to create report: ${reportError.message}`);
  }

  // ── Upload Image ──
  if (data.imageUri) {
    try {
      // Validate file extension
      const fileCheck = validateFileExtension(data.imageUri);
      if (!fileCheck.valid) throw new Error(fileCheck.error);

      const file = new File(data.imageUri);
      const arrayBuffer = await file.arrayBuffer();

      // Validate file size (10MB max)
      const sizeCheck = validateFileSize(arrayBuffer.byteLength);
      if (!sizeCheck.valid) throw new Error(sizeCheck.error);

      // Sanitize file name to prevent path traversal
      const cleanFileName = sanitizeFileName(`photo_${Date.now()}.${fileCheck.extension}`);
      const filePath = `report-${reportData.id}/${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Attachments')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileCheck.extension === 'jpg' || fileCheck.extension === 'jpeg' ? 'jpeg' : fileCheck.extension}`,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Save Attachment record
      const { error: attachError } = await supabase
        .from('attachments')
        .insert({
          issue_id: reportData.id,
          file_url: filePath,
          name: cleanFileName,
        });

      if (attachError) {
        throw attachError;
      }
    } catch (e: any) {
      throw new Error(`Report created but image upload failed: ${e.message || 'Unknown error'}`);
    }
  }

  return reportData.id;
};

// ─── GET USER REPORTS (Citizen) ──────────────────────────────────────────────

export const getUserReports = async (): Promise<ReportWithAttachments[]> => {
  const user = await requireAuth();

  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      attachments (*)
    `)
    .eq('reporter_id', user.id) // Always use authenticated user ID
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  const reportsWithUrls = data?.map((report: any) => {
    return {
      ...report,
      attachments: report.attachments ? report.attachments.map((att: any) => {
        const { data: { publicUrl } } = supabase.storage.from('Attachments').getPublicUrl(att.file_url);
        
        return {
          ...att,
          file_url: att.file_url.startsWith('http') ? att.file_url : publicUrl
        };
      }) : []
    };
  });

  return (reportsWithUrls || []) as ReportWithAttachments[];
};

// ─── GET TEAM LEADER REPORTS ─────────────────────────────────────────────────

export const getTeamLeaderReports = async (): Promise<ReportWithAttachments[]> => {
  const user = await requireAuth();

  // Verify role (only team leaders can access this)
  const userRole = user.user_metadata?.role;
  if (userRole !== 'team_leader') {
    throw new Error('Unauthorized: Team leader access required.');
  }

  const { data, error } = await supabase
    .from('reports')
    .select(`*, attachments (*)`)
    .eq('team_leader', user.id) // Always use authenticated user ID
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  const reportsWithUrls = data?.map((report: any) => {
    return {
      ...report,
      attachments: report.attachments ? report.attachments.map((att: any) => {
        const { data: { publicUrl } } = supabase.storage.from('Attachments').getPublicUrl(att.file_url);
        return {
          ...att,
          file_url: att.file_url.startsWith('http') ? att.file_url : publicUrl
        };
      }) : []
    };
  });
  
  return (reportsWithUrls || []) as ReportWithAttachments[];
};

// ─── UPDATE REPORT STATUS ────────────────────────────────────────────────────

export const updateReportStatus = async (reportId: string, status: string | number) => {
  // ── Auth check ──
  const user = await requireAuth();

  // ── Validate reportId is a valid UUID ──
  if (!validateUUID(reportId)) {
    throw new Error('Invalid report ID format.');
  }

  // ── Validate status value ──
  if (!validateStatus(status)) {
    throw new Error(`Invalid status value: "${status}"`);
  }

  // ── Verify the user is authorized to update this report ──
  const { data: report, error: fetchError } = await supabase
    .from('reports')
    .select('team_leader, reporter_id, status')
    .eq('id', reportId)
    .single();

  if (fetchError || !report) {
    throw new Error('Report not found.');
  }

  // Only the assigned team leader can update status
  if (report.team_leader !== user.id) {
    throw new Error('Unauthorized: You are not assigned to this report.');
  }

  // Build update payload
  const updates: any = { status };
  
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  } else if (status === 'approved') {
    updates.approved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', reportId);

  if (error) {
    throw new Error(`Failed to update status: ${error.message}`);
  }
};

// ─── UPLOAD COMPLETION IMAGES ────────────────────────────────────────────────

export const uploadCompletionImages = async (reportId: string, imageUris: string[]): Promise<string[]> => {
  // ── Auth check ──
  const user = await requireAuth();

  // ── Validate reportId ──
  if (!validateUUID(reportId)) {
    throw new Error('Invalid report ID format.');
  }

  // ── Rate limit (max 3 completion uploads per minute) ──
  const rateCheck = checkRateLimit('uploadCompletion', 3, 60000);
  if (!rateCheck.allowed) {
    const seconds = Math.ceil((rateCheck.retryAfterMs || 0) / 1000);
    throw new Error(`Too many uploads. Please wait ${seconds} seconds.`);
  }

  // ── Verify authorization ──
  const { data: report, error: fetchError } = await supabase
    .from('reports')
    .select('team_leader')
    .eq('id', reportId)
    .single();

  if (fetchError || !report) {
    throw new Error('Report not found.');
  }

  if (report.team_leader !== user.id) {
    throw new Error('Unauthorized: You are not assigned to this report.');
  }

  // ── Limit number of images ──
  if (imageUris.length > 6) {
    throw new Error('Maximum 6 completion images allowed.');
  }

  const uploadedPaths: string[] = [];

  for (let i = 0; i < imageUris.length; i++) {
    const uri = imageUris[i];

    // Validate file extension
    const fileCheck = validateFileExtension(uri);
    if (!fileCheck.valid) throw new Error(fileCheck.error);

    const file = new File(uri);
    const arrayBuffer = await file.arrayBuffer();

    // Validate file size
    const sizeCheck = validateFileSize(arrayBuffer.byteLength);
    if (!sizeCheck.valid) throw new Error(sizeCheck.error);

    // Sanitize filename
    const cleanFileName = sanitizeFileName(`completion_${Date.now()}_${i}.${fileCheck.extension}`);
    const filePath = `report-${reportId}/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('Attachments')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileCheck.extension === 'jpg' || fileCheck.extension === 'jpeg' ? 'jpeg' : fileCheck.extension}`,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage.from('Attachments').getPublicUrl(filePath);
    uploadedPaths.push(publicUrl);
  }

  const { error: updateError } = await supabase
    .from('reports')
    .update({ 
      completion_images: uploadedPaths,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', reportId);

  if (updateError) {
    throw new Error(`Failed to update report with completion images: ${updateError.message}`);
  }

  return uploadedPaths;
};
