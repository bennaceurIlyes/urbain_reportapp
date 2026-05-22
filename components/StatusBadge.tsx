import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, typography } from '../theme';
import { getStatusLabel, Language } from '../i18n/strings';

interface StatusBadgeProps {
  status: string | number;
  lang: Language;
  is_resolved?: boolean;
  work_in_progress_at?: string | null;
}

const STATUS_CONFIG = {
  pending: {
    backgroundColor: colors.statusPendingBg,       // #FEF3E2
    borderColor:     colors.statusPendingBorder,    // #E59C2A
    textColor:       colors.statusPendingText,      // #7D5200
  },
  assigned: {
    backgroundColor: colors.statusAssignedBg,       // #E8F4FB
    borderColor:     colors.statusAssignedBorder,   // #2980B9
    textColor:       colors.statusAssignedText,     // #0A4C78
  },
  in_progress: {
    backgroundColor: colors.statusInProgressBg,     // #F0EAF9
    borderColor:     colors.statusInProgressBorder, // #7B4FBF
    textColor:       colors.statusInProgressText,   // #4A2080
  },
  completed: {
    backgroundColor: colors.statusCompletedBg,      // #E6F6ED
    borderColor:     colors.statusCompletedBorder,  // #28A760
    textColor:       colors.statusCompletedText,    // #145C32
  },
  approved: {
    backgroundColor: colors.statusApprovedBg,       // #E8F4FB
    borderColor:     colors.statusApprovedBorder,   // #0A4C78
    textColor:       colors.statusApprovedText,     // #073858
  },
};

const getStatusConfig = (status: string | number, is_resolved?: boolean, work_in_progress_at?: string | null) => {
  if (status === 4 || status === 'approved' || is_resolved === true) {
    return STATUS_CONFIG.approved;
  }
  if (status === 3 || status === 'completed') {
    return STATUS_CONFIG.completed;
  }
  if (status === 2) {
    return work_in_progress_at ? STATUS_CONFIG.in_progress : STATUS_CONFIG.assigned;
  }
  if (status === 1 || status === 'in_progress') {
    return STATUS_CONFIG.in_progress;
  }
  if (status === 'assigned') {
    return STATUS_CONFIG.assigned;
  }
  return STATUS_CONFIG.pending;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, lang, is_resolved, work_in_progress_at }) => {
  const config = getStatusConfig(status, is_resolved, work_in_progress_at);
  const label = getStatusLabel(status, lang, is_resolved, work_in_progress_at);
  const isAr = lang === 'ar';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
      accessibilityLabel={label}
      accessibilityRole="text"
    >
      <Text 
        style={[
          styles.label, 
          {
            color: config.textColor,
            fontFamily: isAr ? 'IBMPlexArabic-Medium' : 'IBMPlexSans-Medium',
          }
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs, // 4px — square-ish, formal
    borderWidth: 1,
  },
  label: {
    fontSize: typography.xs, // 11px
    letterSpacing: 0.3,
  },
});
