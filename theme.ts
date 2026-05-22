import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// ─────────────────────────────────────────────────────────
// theme.ts — ADE BÉCHAR OFFICIAL COLOR SYSTEM
// Direction: Pure White + Strong ADE Blue — Government Grade
// ─────────────────────────────────────────────────────────

export const colors = {

  // ── BRAND BLUES (the only colors used boldly) ────────────────────
  primary:          '#1A6FA3',   // ADE Official Light Blue — headers, primary buttons, nav bars
  primaryDark:      '#0E4B72',   // Pressed state, active selected items
  primaryLight:     '#3498DB',   // Secondary buttons, icons, links
  primaryBorder:    '#5DADE2',   // Input focus borders, tab indicators
  primaryTint:      '#EBF5FB',   // Blue-tinted white — stat card backgrounds, row highlights
  primaryUltraLight:'#F4F9FC',   // Near-white with a cold blue hint — page backgrounds

  // ── WHITES & GRAYS (the dominant surfaces) ────────────────────────
  white:            '#FFFFFF',   // Pure white — cards, modals, form backgrounds
  pageBg:           '#F7FAFD',   // Slightly cold off-white — screen backgrounds
  surfaceGray:      '#F0F4F8',   // Sections, divider areas, inactive tab backgrounds
  borderLight:      '#DDE8F0',   // Default card and input borders
  borderMedium:     '#B8CFDF',   // Emphasized dividers, section separators
  divider:          '#E4ECF3',   // Hairline dividers between list items

  // ── TEXT HIERARCHY ────────────────────────────────────────────────
  textPrimary:      '#0D1F2D',   // Near-black with a blue undertone — main headings, body
  textSecondary:    '#4A6070',   // Muted — labels, metadata, timestamps
  textDisabled:     '#8FA3B1',   // Placeholder text, disabled states
  textOnBlue:       '#FFFFFF',   // Any text on primary blue backgrounds
  textLink:         '#1A6FA3',   // Hyperlinks, tappable metadata

  // ── STATUS COLORS (opaque filled badges — no translucency) ────────
  // Each status has: background (light fill) + border + text
  statusPendingBg:       '#FEF3E2',
  statusPendingBorder:   '#E59C2A',
  statusPendingText:     '#7D5200',

  statusAssignedBg:      '#E8F4FB',
  statusAssignedBorder:  '#2980B9',
  statusAssignedText:    '#0A4C78',

  statusInProgressBg:    '#F0EAF9',
  statusInProgressBorder:'#7B4FBF',
  statusInProgressText:  '#4A2080',

  statusCompletedBg:     '#E6F6ED',
  statusCompletedBorder: '#28A760',
  statusCompletedText:   '#145C32',

  statusApprovedBg:      '#E8F4FB',
  statusApprovedBorder:  '#0A4C78',
  statusApprovedText:    '#073858',

  // ── PRIORITY COLORS ───────────────────────────────────────────────
  priorityLow:      '#28A760',   // Green
  priorityMedium:   '#E59C2A',   // Amber
  priorityHigh:     '#D63C3C',   // Red
  priorityCritical: '#7B4FBF',   // Purple

  // ── ALGERIAN FLAG (logo accents only — do not use elsewhere) ──────
  flagGreen:        '#006233',
  flagRed:          '#D21034',

  // ── LEGACY ALIASES — safe backward compatibility ──────────────────
  republicGreen:    '#1A6FA3',   // → primary
  activeGreen:      '#3498DB',   // → primaryLight
  pendingYellow:    '#E59C2A',   // → statusPendingBorder
  resolvedGreen:    '#28A760',   // → priorityLow
  adeDeepBlue:      '#1A6FA3',
  adeMediumBlue:    '#3498DB',
  adeSkyBlue:       '#5DADE2',
  adePaleBlue:      '#EBF5FB',
  adeIceBlue:       '#F4F9FC',
  screenBackground: '#F7FAFD',   // → pageBg
  dividerColor:      '#DDE8F0',   // → borderLight
  offWhite:          '#F7FAFD',   // → pageBg
  lightGray:         '#F0F4F8',   // → surfaceGray
  midGray:           '#4A6070',   // → textSecondary
  darkGray:          '#0D1F2D',   // → textPrimary
  charcoal:          '#0D1F2D',   // → textPrimary
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
// Use ONLY for cards and elevated components — no glow effects
export const shadow = {
  card: {
    shadowColor: '#0A4C78',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    shadowColor: '#0A4C78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
};

export const shadows = {
  card: shadow.card,
  elevated: shadow.button,
  fab: shadow.button,
};

// ── BORDER RADIUS ───────────────────────────────────────────────────
// Government apps use modest rounding — not pill shapes
export const radius = {
  xs:  4,   // Badges, chips, small tags
  sm:  6,   // Inputs, small buttons
  md:  8,   // Cards, modals, standard buttons
  lg:  12,  // Large cards, bottom sheets
  xl:  16,  // Splash, hero elements only
};

export const borderRadius = {
  card: 8,       // radius.md
  button: 6,     // radius.sm
  badge: 4,      // radius.xs
  input: 6,      // radius.sm
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
