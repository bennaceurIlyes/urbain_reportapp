import { supabase } from './supabaseConfig';
import { Database } from '../types/database';
import { File } from 'expo-file-system';


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

export const submitReport = async (data: ReportData) => {
  console.log('Starting report submission...');
  
  // 1. Create Report first to get issue_id
  const { data: reportData, error: reportError } = await supabase
    .from('reports')
    .insert({
      title: data.title,
      description: data.description,
      priority: data.priority || 2,
      status: 0, // Pending
      reporter_id: data.userId,
      location: JSON.stringify(data.location),
    })
    .select()
    .single();

  if (reportError) {
    console.error('Error creating report:', reportError);
    throw new Error(`Failed to create report: ${reportError.message}`);
  }

  console.log('Report created with ID:', reportData.id);

  // 2. Upload Image
  if (data.imageUri) {
    try {
      console.log('Preparing image upload for:', data.imageUri);
      
      // Use the new Expo 54 FileSystem API to read image as ArrayBuffer
      const file = new File(data.imageUri);
      const arrayBuffer = await file.arrayBuffer();
      
      const fileExt = data.imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = `photo_${Date.now()}.${fileExt}`;
      const filePath = `report-${reportData.id}/${cleanFileName}`;

      console.log(`Uploading image to bucket "Attachments", path: ${filePath}`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('Attachments')


        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt === 'jpg' || fileExt === 'jpeg' ? 'jpeg' : fileExt}`,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase Storage Upload Error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      console.log('Image uploaded successfully');

      // 3. Save Attachment record in the database
      const { error: attachError } = await supabase
        .from('attachments')
        .insert({
          issue_id: reportData.id,
          file_url: filePath,
          name: cleanFileName,
        });

      if (attachError) {
        console.error('Attachment Link Error:', attachError);
        throw attachError;
      }
      
      console.log('Attachment record created in database');
    } catch (e: any) {
      console.error('Image upload phase failed:', e);
      if (e.stack) console.error(e.stack);
      throw new Error(`Report created but image upload failed: ${e.message || 'Unknown error'}`);
    }
  }

  return reportData.id;
};

export const getUserReports = async (): Promise<ReportWithAttachments[]> => {
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    throw new Error('User must be authenticated to fetch reports');
  }

  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      attachments (*)
    `)
    .eq('reporter_id', userData.user.id)
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
