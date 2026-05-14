import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1B4FD8',
    primaryContainer: '#E0E7FF',
    secondary: '#64748B',
    secondaryContainer: '#F1F5F9',
    tertiary: '#3B82F6',
    tertiaryContainer: '#DBEAFE',
    surface: '#FFFFFF',
    surfaceVariant: '#F8FAFC',
    background: '#F8FAFC',
    outline: '#E2E8F0',
    error: '#EF4444',
    onSurface: '#0F172A',
    onSurfaceVariant: '#64748B',
  },
  fonts: {
    ...DefaultTheme.fonts,
    displayLarge: { fontFamily: 'System', fontWeight: '700', fontSize: 34, lineHeight: 41 },
    displayMedium: { fontFamily: 'System', fontWeight: '700', fontSize: 28, lineHeight: 34 },
    displaySmall: { fontFamily: 'System', fontWeight: '700', fontSize: 22, lineHeight: 28 },
    headlineLarge: { fontFamily: 'System', fontWeight: '600', fontSize: 20, lineHeight: 26 },
    headlineMedium: { fontFamily: 'System', fontWeight: '600', fontSize: 18, lineHeight: 24 },
    headlineSmall: { fontFamily: 'System', fontWeight: '600', fontSize: 16, lineHeight: 22 },
    bodyLarge: { fontFamily: 'System', fontWeight: '400', fontSize: 16, lineHeight: 24 },
    bodyMedium: { fontFamily: 'System', fontWeight: '400', fontSize: 14, lineHeight: 20 },
    bodySmall: { fontFamily: 'System', fontWeight: '400', fontSize: 12, lineHeight: 16 },
    labelLarge: { fontFamily: 'System', fontWeight: '500', fontSize: 14, lineHeight: 20 },
    labelMedium: { fontFamily: 'System', fontWeight: '500', fontSize: 12, lineHeight: 16 },
    labelSmall: { fontFamily: 'System', fontWeight: '500', fontSize: 11, lineHeight: 14 },
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#3B82F6',
    surface: '#1E293B',
    background: '#0F172A',
    onSurface: '#F8FAFC',
    onSurfaceVariant: '#94A3B8',
    surfaceVariant: '#1E293B',
    outline: '#334155',
  }
};
