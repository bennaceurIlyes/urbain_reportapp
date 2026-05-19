import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// ─── ALGERIAN GOVERNMENT IDENTITY COLOR PALETTE ───────────────────────────────
export const colors = {
  // Primary Green (Flag)
  republicGreen: '#006233',
  activeGreen: '#00A651',
  surfaceGreen: '#E8F5E9',

  // Gold (Authority accent)
  governmentGold: '#D4AF37',
  goldLight: '#FFF8DC',

  // Neutral / Backgrounds
  offWhite: '#F5F5F0',
  cardWhite: '#FFFFFF',
  deepNavy: '#1A1A2E',
  textPrimary: '#1A1A2E',
  textSecondary: '#5A6072',
  textMuted: '#9BA3B8',
  borderLight: '#E2E8F0',

  // Status colors (Arabic-labeled in UI)
  status: {
    pending: '#F57F17',       // معلق — amber
    assigned: '#1565C0',      // مُسنَد — blue
    inProgress: '#6A1B9A',    // قيد التنفيذ — purple
    completed: '#2E7D32',     // مكتمل — green
    approved: '#006233',      // مُعتمَد — republic green
  },

  // Priority colors
  priority: {
    low: '#388E3C',           // منخفض
    medium: '#F57F17',        // متوسط
    high: '#C62828',          // عالي
    emergency: '#D32F2F',     // طوارئ
  },

  // Semantic
  error: '#C62828',
  success: '#2E7D32',
  warning: '#F57F17',
  info: '#1565C0',
};

// ─── TYPOGRAPHY SCALE ─────────────────────────────────────────────────────────
export const typography = {
  fontFamily: {
    arabic: 'NotoNaskhArabic',
    latin: 'Inter',
  },
  heading1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading2: { fontSize: 22, fontWeight: '600' as const },
  heading3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 26 },
  caption: { fontSize: 13, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.4 },
};

// ─── SPACING SCALE (8pt grid) ─────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── BORDER RADIUS ────────────────────────────────────────────────────────────
export const borderRadius = {
  card: 16,
  button: 12,
  badge: 8,
  input: 10,
};

// ─── SHADOWS ──────────────────────────────────────────────────────────────────
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  fab: {
    shadowColor: '#006233',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ─── REACT NATIVE PAPER THEME ─────────────────────────────────────────────────
export const theme = {
  ...DefaultTheme,
  roundness: borderRadius.button,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.republicGreen,
    primaryContainer: colors.surfaceGreen,
    secondary: colors.governmentGold,
    secondaryContainer: colors.goldLight,
    tertiary: colors.activeGreen,
    tertiaryContainer: colors.surfaceGreen,
    surface: colors.cardWhite,
    surfaceVariant: colors.offWhite,
    background: colors.offWhite,
    outline: colors.borderLight,
    error: colors.error,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
  },
  fonts: {
    ...DefaultTheme.fonts,
    displayLarge: { fontFamily: 'System', fontWeight: '700' as const, fontSize: 34, lineHeight: 41 },
    displayMedium: { fontFamily: 'System', fontWeight: '700' as const, fontSize: 28, lineHeight: 34 },
    displaySmall: { fontFamily: 'System', fontWeight: '700' as const, fontSize: 22, lineHeight: 28 },
    headlineLarge: { fontFamily: 'System', fontWeight: '600' as const, fontSize: 20, lineHeight: 26 },
    headlineMedium: { fontFamily: 'System', fontWeight: '600' as const, fontSize: 18, lineHeight: 24 },
    headlineSmall: { fontFamily: 'System', fontWeight: '600' as const, fontSize: 16, lineHeight: 22 },
    bodyLarge: { fontFamily: 'System', fontWeight: '400' as const, fontSize: 16, lineHeight: 24 },
    bodyMedium: { fontFamily: 'System', fontWeight: '400' as const, fontSize: 14, lineHeight: 20 },
    bodySmall: { fontFamily: 'System', fontWeight: '400' as const, fontSize: 12, lineHeight: 16 },
    labelLarge: { fontFamily: 'System', fontWeight: '500' as const, fontSize: 14, lineHeight: 20 },
    labelMedium: { fontFamily: 'System', fontWeight: '500' as const, fontSize: 12, lineHeight: 16 },
    labelSmall: { fontFamily: 'System', fontWeight: '500' as const, fontSize: 11, lineHeight: 14 },
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Convert Western digits (0-9) to Eastern Arabic numerals (٠-٩) when lang is 'ar' */
export const toArabicNumeral = (n: number | string, lang: string = 'ar'): string => {
  const str = String(n);
  if (lang !== 'ar') return str;
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (d) => arabicDigits[parseInt(d, 10)]);
};

export const getStatusColor = (status: string | number, is_resolved?: boolean): string => {
  if (is_resolved === false) {
    return colors.status.inProgress;
  }
  if (is_resolved === true) {
    if (status === 3 || status === 'completed' || status === 2) {
      return colors.status.completed;
    }
    if (status === 4 || status === 'approved') {
      return colors.status.approved;
    }
  }

  switch (status) {
    case 'pending': case 0: return colors.status.pending;
    case 'assigned': return colors.status.assigned;
    case 'in_progress': case 1: return colors.status.inProgress;
    case 'completed': case 2: case 3: return colors.status.completed;
    case 'approved': case 4: return colors.status.approved;
    default: return colors.textMuted;
  }
};

/** Get priority color from theme */
export const getPriorityColor = (priority: number): string => {
  switch (priority) {
    case 1: return colors.priority.low;
    case 2: return colors.priority.medium;
    case 3: return colors.priority.high;
    case 4: return colors.priority.emergency;
    default: return colors.textMuted;
  }
};
