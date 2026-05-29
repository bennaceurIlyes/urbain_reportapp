import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// ─────────────────────────────────────────────────────────
// theme.ts — ADE BÉCHAR OFFICIAL COLOR SYSTEM
// Direction: Deep Water — Industrial Clarity
// ─────────────────────────────────────────────────────────

export const colors = {

  // ── BRAND BLUES (Deep Water - Industrial Clarity) ────────────────────
  primary:          '#0A2E4A',   // Deep Water Navy — Top bar, headings, nav active
  primaryDark:      '#051B2C',   // Deeper Navy pressed states
  primaryLight:     '#0D6B9A',   // Electric Cyan gradient partner
  primaryBorder:    '#C0EAF5',   // Soft cyan outline borders
  primaryTint:      '#F0F9FF',   // Surface light tint
  primaryUltraLight:'#F8FAFD',   // Subtle slate page backgrounds

  // ── WHITES & GRAYS (the dominant surfaces) ────────────────────────
  white:            '#FFFFFF',   // Pure white — cards, modals, form backgrounds
  pageBg:           '#F0F9FF',   // Surface light page background
  surfaceGray:      '#E2F4F8',   // Divider sections, inactive tab backgrounds
  borderLight:      '#C0EAF5',   // Default card and input borders
  borderMedium:     '#9BCFE0',   // Emphasized dividers
  divider:          '#D4F0F6',   // Hairline dividers

  // ── TEXT HIERARCHY ────────────────────────────────────────────────
  textPrimary:      '#0A2E4A',   // Deep navy headings
  textSecondary:    '#3A6B85',   // Medium blue secondary text
  textDisabled:     '#7BA8BF',   // Muted gray-blue placeholders
  textOnBlue:       '#FFFFFF',   // Standard text on navy backgrounds
  textLink:         '#18A6C8',   // Highlight cyan links/icons

  // ── STATUS COLORS (Industrial urgencies - high contrast) ────────
  statusPendingBg:       '#FEF3E2',
  statusPendingBorder:   '#D97706',   // Warning Orange
  statusPendingText:     '#D97706',

  statusAssignedBg:      '#FDF2F2',
  statusAssignedBorder:  '#DC2626',   // Urgent Red
  statusAssignedText:    '#DC2626',

  statusInProgressBg:    '#EFF6FF',
  statusInProgressBorder:'#0D6B9A',   // Electric Cyan
  statusInProgressText:  '#0D6B9A',

  statusCompletedBg:     '#ECFDF5',
  statusCompletedBorder: '#16A34A',   // Success Green
  statusCompletedText:   '#16A34A',

  statusApprovedBg:      '#ECFDF5',
  statusApprovedBorder:  '#16A34A',
  statusApprovedText:    '#16A34A',

  // ── PRIORITY COLORS ───────────────────────────────────────────────
  priorityLow:      '#16A34A',   // Green
  priorityMedium:   '#D97706',   // Amber
  priorityHigh:     '#DC2626',   // Red
  priorityCritical: '#DC2626',   // Urgent Red

  // ── ALGERIAN FLAG (logo accents) ──────────────────────────────────
  flagGreen:        '#006233',
  flagRed:          '#D21034',

  // ── LEGACY ALIASES — safe backward compatibility ──────────────────
  republicGreen:    '#0A2E4A',
  activeGreen:      '#0D6B9A',
  pendingYellow:    '#D97706',
  resolvedGreen:    '#16A34A',
  adeDeepBlue:      '#0A2E4A',
  adeMediumBlue:    '#0D6B9A',
  adeSkyBlue:       '#18A6C8',
  adePaleBlue:      '#F0F9FF',
  adeIceBlue:       '#F8FAFD',
  screenBackground: '#F0F9FF',
  dividerColor:      '#C0EAF5',
  offWhite:          '#F0F9FF',
  lightGray:         '#E2F4F8',
  midGray:           '#3A6B85',
  darkGray:          '#0A2E4A',
  charcoal:          '#0A2E4A',
  cardBackground:    '#FFFFFF',
  inputBackground:   '#FFFFFF',

  status: {
    pending: '#E59C2A',
    assigned: '#5DADE2',
    inProgress: '#7B4FBF',
    completed: '#28A760',
    approved: '#1A6FA3',
  },

  priority: {
    low: '#28A760',
    medium: '#E59C2A',
    high: '#D63C3C',
    emergency: '#7B4FBF',
  },

  error: '#D63C3C',
  success: '#28A760',
  warning: '#E59C2A',
  info: '#1A6FA3',
};

// ── SHADOWS ────────────────────────────────────────────────────────
// No shadows — rely on borders and background fills for depth (Industrial Clarity)
export const shadow = {
  card: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  button: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

export const shadows = {
  card: shadow.card,
  elevated: shadow.button,
  fab: shadow.button,
};

// ── BORDER RADIUS ───────────────────────────────────────────────────
// Premium municipal style uses modern rounded-2xl aesthetics
export const radius = {
  xs:  6,   // Badges, chips, small tags
  sm:  12,  // Inputs
  md:  16,  // Cards, modals, standard buttons (rounded-2xl)
  lg:  20,  // Large cards, bottom sheets
  xl:  24,  // Splash, hero elements only
};

export const borderRadius = {
  card: 16,       // rounded-2xl style cards
  button: 16,     // rounded-2xl style buttons
  badge: 6,       // rounded-md style badges
  input: 12,      // rounded-xl style inputs
};

// ── SPACING ─────────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────
export const typography = {
  // Arabic: IBM Plex Arabic — structured, technical, used in Arab gov portals
  // Fallback: Cairo
  fontAr:         'IBMPlexArabic-Regular',
  fontArMedium:   'IBMPlexArabic-Medium',
  fontArBold:     'IBMPlexArabic-Bold',

  // Latin/French: IBM Plex Sans — same family, paired perfectly
  // Fallback: Roboto
  fontLatin:      'IBMPlexSans-Regular',
  fontLatinMedium:'IBMPlexSans-Medium',
  fontLatinBold:  'IBMPlexSans-Bold',

  // Compatibility fields for the app components referencing them
  fontFamilyAr: 'IBMPlexArabic-Regular',
  fontFamilyArBold: 'IBMPlexArabic-Bold',
  fontFamilyLatin: 'IBMPlexSans-Regular',
  fontFamilyLatinBold: 'IBMPlexSans-SemiBold',

  fontFamily: {
    arabic: 'IBMPlexArabic-Regular',
    latin: 'IBMPlexSans-Regular',
  },

  // Scale
  h1:   28,  // Screen main titles
  h2:   22,  // Section headers
  h3:   18,  // Card titles
  h4:   15,  // Subsection labels
  body: 14,  // Body text
  sm:   13,  // Secondary / metadata
  xs:   11,  // Tiny labels, timestamps, footnotes

  // Sizing mapping
  xs_val: 11,
  sm_val: 13,
  md_val: 15,
  lg_val: 17,
  xl_val: 20,
  xxl_val: 24,
  xxxl_val: 30,

  // Compatibility sizes
  xs_sz: 11,
  sm_sz: 13,
  md_sz: 15,
  lg_sz: 17,
  xl_sz: 20,
  xxl_sz: 24,
  xxxl_sz: 30,

  // Keep legacy scale objects just in case
  heading1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading2: { fontSize: 22, fontWeight: '600' as const },
  heading3: { fontSize: 18, fontWeight: '600' as const },
  bodyScale: { fontSize: 16, lineHeight: 26 },
  caption: { fontSize: 13, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.4 },
};

// ─── REACT NATIVE PAPER THEME ─────────────────────────────────────────────────
export const theme = {
  ...DefaultTheme,
  roundness: borderRadius.button,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryTint,
    secondary: colors.primaryLight,
    secondaryContainer: colors.primaryUltraLight,
    tertiary: colors.primaryBorder,
    tertiaryContainer: colors.primaryTint,
    surface: colors.white,
    surfaceVariant: colors.pageBg,
    background: colors.pageBg,
    outline: colors.borderLight,
    error: colors.priorityHigh,
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
  return String(n);
};

export const getStatusColor = (status: string | number, is_resolved?: boolean, work_in_progress_at?: string | null): string => {
  if (status === 4 || status === 'approved') {
    return colors.status.approved;
  }
  if (status === 3 || status === 'completed') {
    return colors.status.completed;
  }
  if (is_resolved === true) {
    return colors.status.approved;
  }
  if (status === 2) {
    if (!work_in_progress_at) {
      return colors.status.assigned;
    }
    return colors.status.inProgress;
  }
  if (is_resolved === false) {
    if (status === 0 || status === 'pending') {
      return colors.status.pending;
    }
    if (status === 'assigned') {
      return colors.status.assigned;
    }
    return colors.status.inProgress;
  }

  switch (status) {
    case 'pending': case 0: return colors.status.pending;
    case 'assigned': return colors.status.assigned;
    case 'in_progress': case 1: case 2: return colors.status.inProgress;
    case 'completed': case 3: return colors.status.completed;
    case 'approved': case 4: return colors.status.approved;
    default: return colors.textSecondary;
  }
};

/** Get priority color from theme */
export const getPriorityColor = (priority: number): string => {
  switch (priority) {
    case 1: return colors.priority.low;
    case 2: return colors.priority.medium;
    case 3: return colors.priority.high;
    case 4: return colors.priority.emergency;
    default: return colors.textSecondary;
  }
};
