import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

interface EmptyStateProps {
  type: 'no-reports' | 'no-tasks' | 'offline' | 'error';
  onAction?: () => void;
}

/** Custom SVG illustrations for each empty state */
const EmptyIllustration: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'no-reports':
      return (
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Rect x="30" y="15" width="60" height="80" rx="8" fill={colors.primaryUltraLight} stroke={colors.primary} strokeWidth="2" />
          <Rect x="40" y="30" width="40" height="4" rx="2" fill={colors.primary} opacity="0.3" />
          <Rect x="40" y="40" width="30" height="4" rx="2" fill={colors.primary} opacity="0.2" />
          <Rect x="40" y="50" width="35" height="4" rx="2" fill={colors.primary} opacity="0.2" />
          <Circle cx="60" cy="72" r="12" fill={colors.primary} opacity="0.15" />
          <Path d="M55 72 L58 75 L66 67" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Rect x="45" y="90" width="30" height="6" rx="3" fill={colors.primaryLight} opacity="0.4" />
        </Svg>
      );
    case 'no-tasks':
      return (
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Rect x="25" y="20" width="70" height="75" rx="8" fill={colors.primaryUltraLight} stroke={colors.primary} strokeWidth="2" />
          <G opacity="0.3">
            <Rect x="35" y="35" width="10" height="10" rx="2" stroke={colors.primary} strokeWidth="1.5" fill="none" />
            <Path d="M37 40 L39 42 L43 37" stroke={colors.primary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <Rect x="50" y="37" width="30" height="4" rx="2" fill={colors.primary} />
          </G>
          <G opacity="0.3">
            <Rect x="35" y="52" width="10" height="10" rx="2" stroke={colors.primary} strokeWidth="1.5" fill="none" />
            <Path d="M37 57 L39 59 L43 54" stroke={colors.primary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <Rect x="50" y="54" width="25" height="4" rx="2" fill={colors.primary} />
          </G>
          <G opacity="0.3">
            <Rect x="35" y="69" width="10" height="10" rx="2" stroke={colors.primary} strokeWidth="1.5" fill="none" />
            <Path d="M37 74 L39 76 L43 71" stroke={colors.primary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <Rect x="50" y="71" width="28" height="4" rx="2" fill={colors.primary} />
          </G>
          <Circle cx="85" cy="30" r="15" fill={colors.primaryLight} opacity="0.25" />
          <Path d="M80 30 L83 33 L90 26" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'offline':
      return (
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Circle cx="60" cy="55" r="35" fill={colors.primaryUltraLight} stroke={colors.primary} strokeWidth="2" opacity="0.5" />
          <Path d="M40 50 Q50 35 60 40 Q70 35 80 50" stroke={colors.primary} strokeWidth="2" fill="none" opacity="0.4" />
          <Path d="M45 58 Q52 48 60 52 Q68 48 75 58" stroke={colors.primary} strokeWidth="2" fill="none" opacity="0.6" />
          <Circle cx="60" cy="65" r="4" fill={colors.primary} />
          <Path d="M30 85 L90 25" stroke={colors.priorityHigh} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </Svg>
      );
    default: // error
      return (
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Circle cx="60" cy="55" r="35" fill="#FEF2F2" stroke={colors.priorityHigh} strokeWidth="2" opacity="0.5" />
          <Path d="M60 40 L60 60" stroke={colors.priorityHigh} strokeWidth="3" strokeLinecap="round" />
          <Circle cx="60" cy="70" r="2.5" fill={colors.priorityHigh} />
        </Svg>
      );
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  const { t, isRTL } = useLanguage();

  const content = {
    'no-reports': { heading: t('noReports'), subtext: t('noReportsSubtext') },
    'no-tasks': { heading: t('noTasks'), subtext: t('noTasksSubtext') },
    'offline': { heading: t('offline'), subtext: t('offlineSubtext') },
    'error': { heading: t('errorTitle'), subtext: t('errorSubtext') },
  };

  const { heading, subtext } = content[type];

  return (
    <View style={styles.container}>
      <EmptyIllustration type={type} />
      <Text 
        style={[
          styles.heading, 
          isRTL && styles.textRTL,
          { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }
        ]}
      >
        {heading}
      </Text>
      <Text 
        style={[
          styles.subtext, 
          isRTL && styles.textRTL,
          { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }
        ]}
      >
        {subtext}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  heading: {
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  textRTL: {
    textAlign: 'center',
  },
});
