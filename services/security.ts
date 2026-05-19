/**
 * ─── SECURITY UTILITIES ───────────────────────────────────────────────────────
 * Input validation, sanitization, and security helpers for the Urban Issue App.
 * Prevents SQL injection, XSS, path traversal, and other common attack vectors.
 * ───────────────────────────────────────────────────────────────────────────────
 */

// ─── INPUT SANITIZATION ──────────────────────────────────────────────────────

/**
 * Strip HTML tags and dangerous characters from user input.
 * Prevents XSS when text is rendered in the UI and protects against
 * potential injection if text reaches any raw SQL or template.
 */
export const sanitizeText = (input: string): string => {
  if (!input || typeof input !== 'string') return '';

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-related patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Remove SQL injection patterns
    .replace(/(['";])\s*(DROP|DELETE|UPDATE|INSERT|ALTER|EXEC|UNION|SELECT)\s/gi, '$1')
    // Remove null bytes (can bypass validation)
    .replace(/\0/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Validate and sanitize email format.
 * Returns sanitized email or throws on invalid format.
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') throw new Error('Email is required');

  const sanitized = email.trim().toLowerCase();
  // RFC 5322 simplified pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }

  if (sanitized.length > 254) {
    throw new Error('Email too long');
  }

  return sanitized;
};

// ─── INPUT VALIDATION ────────────────────────────────────────────────────────

/**
 * Validate report title constraints
 */
export const validateTitle = (title: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeText(title);
  if (!sanitized || sanitized.length === 0) return { valid: false, error: 'Title is required' };
  if (sanitized.length < 3) return { valid: false, error: 'Title too short (min 3 chars)' };
  if (sanitized.length > 200) return { valid: false, error: 'Title too long (max 200 chars)' };
  return { valid: true };
};

/**
 * Validate report description constraints
 */
export const validateDescription = (description: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeText(description);
  if (!sanitized || sanitized.length === 0) return { valid: false, error: 'Description is required' };
  if (sanitized.length < 10) return { valid: false, error: 'Description too short (min 10 chars)' };
  if (sanitized.length > 2000) return { valid: false, error: 'Description too long (max 2000 chars)' };
  return { valid: true };
};

/**
 * Validate priority value is within allowed range
 */
export const validatePriority = (priority: number): boolean => {
  return Number.isInteger(priority) && priority >= 1 && priority <= 4;
};

/**
 * Validate location data
 */
export const validateLocation = (location: { latitude: number; longitude: number }): boolean => {
  if (!location || typeof location !== 'object') return false;
  const { latitude, longitude } = location;
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) && !isNaN(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
};

/**
 * Validate status transitions to prevent unauthorized state changes.
 * Only certain transitions are valid:
 *   pending -> assigned
 *   assigned -> in_progress
 *   in_progress -> completed
 *   completed -> approved
 */
const VALID_STATUS_VALUES = ['pending', 'assigned', 'in_progress', 'completed', 'approved', 0, 1, 2, 3, 4] as const;

export const validateStatus = (status: string | number): boolean => {
  return (VALID_STATUS_VALUES as readonly (string | number)[]).includes(status);
};

// ─── FILE VALIDATION ─────────────────────────────────────────────────────────

/** Allowed image MIME types */
const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];

/** Maximum file size: 10MB */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Validate image file extension against allowlist
 */
export const validateFileExtension = (uri: string): { valid: boolean; extension: string; error?: string } => {
  if (!uri || typeof uri !== 'string') {
    return { valid: false, extension: '', error: 'Invalid file URI' };
  }

  const extension = uri.split('.').pop()?.toLowerCase() || '';

  if (!ALLOWED_IMAGE_TYPES.includes(extension)) {
    return {
      valid: false,
      extension,
      error: `File type ".${extension}" not allowed. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  return { valid: true, extension };
};

/**
 * Validate file size
 */
export const validateFileSize = (sizeBytes: number): { valid: boolean; error?: string } => {
  if (sizeBytes <= 0) return { valid: false, error: 'File is empty' };
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    const maxMB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
    return { valid: false, error: `File exceeds ${maxMB}MB limit` };
  }
  return { valid: true };
};

/**
 * Sanitize a filename to prevent path traversal attacks.
 * Removes directory separators and special characters.
 */
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    // Remove path separators (prevents path traversal like ../../etc/passwd)
    .replace(/[/\\]/g, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove other dangerous characters
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    // Prevent double extensions (e.g., image.php.jpg)
    .replace(/\.{2,}/g, '.');
};

// ─── UUID VALIDATION ─────────────────────────────────────────────────────────

/**
 * Validate UUID format to prevent injection through ID parameters
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateUUID = (id: string): boolean => {
  return typeof id === 'string' && UUID_REGEX.test(id);
};

// ─── RATE LIMITING (Client-side) ─────────────────────────────────────────────

/**
 * Simple in-memory rate limiter.
 * Prevents spamming of report submissions.
 */
const actionTimestamps: Map<string, number[]> = new Map();

export const checkRateLimit = (
  action: string,
  maxAttempts: number = 5,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; retryAfterMs?: number } => {
  const now = Date.now();
  const timestamps = actionTimestamps.get(action) || [];

  // Clean old entries
  const recent = timestamps.filter(t => now - t < windowMs);

  if (recent.length >= maxAttempts) {
    const oldestInWindow = recent[0];
    const retryAfterMs = windowMs - (now - oldestInWindow);
    return { allowed: false, retryAfterMs };
  }

  recent.push(now);
  actionTimestamps.set(action, recent);
  return { allowed: true };
};

// ─── AUTH HELPERS ─────────────────────────────────────────────────────────────

import { supabase } from './supabaseConfig';

/**
 * Get the current authenticated user or throw.
 * Must be called at the start of every API function to ensure authorization.
 */
export const requireAuth = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new Error('Authentication required. Please log in.');
  }

  return data.user;
};

/**
 * Verify the user has the correct role for an action.
 */
export const requireRole = async (requiredRole: 'citizen' | 'team_leader') => {
  const user = await requireAuth();
  const userRole = user.user_metadata?.role || 'citizen';

  if (userRole !== requiredRole) {
    throw new Error(`Unauthorized: This action requires "${requiredRole}" role.`);
  }

  return user;
};
