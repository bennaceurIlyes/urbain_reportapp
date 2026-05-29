import React, { useRef } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadows, toArabicNumeral } from '../theme';
import { StatusBadge } from './StatusBadge';
import { useLanguage } from '../hooks/useLanguage';
import { ReportWithAttachments } from '../services/api';

interface ReportCardProps {
  report: ReportWithAttachments;
  onPress: () => void;
  showAssignedTime?: boolean;
  isTeamLeader?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  onPress, 
  showAssignedTime = false,
  isTeamLeader = false 
}) => {
  const { t, lang, isRTL } = useLanguage();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const imageUrl = report.attachments?.length > 0 ? report.attachments[0].file_url : null;

  // Urgency Color Logic:
  // - Red (#DC2626) = Assigned/Active Work (Status 0, 1, 2)
  // - Amber (#D97706) = Awaiting Admin Approval (Status 3)
  // - Green (#16A34A) = Approved & Completed (Status 4)
  const getUrgencyColor = (status: number | string) => {
    if (status === 4 || status === 'approved') return '#16A34A'; // Green
    if (status === 3 || status === 'completed') return '#D97706'; // Amber
    return '#DC2626'; // Red
  };

  const urgencyColor = getUrgencyColor(report.status);

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (lang === 'ar') {
      if (diffMins < 60) return `منذ ${toArabicNumeral(diffMins, 'ar')} دقيقة`;
      if (diffHours < 24) return `منذ ${toArabicNumeral(diffHours, 'ar')} ساعة`;
      return `منذ ${toArabicNumeral(diffDays, 'ar')} يوم`;
    } else {
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      return `Il y a ${diffDays}j`;
    }
  };

  const timeStr = showAssignedTime
    ? formatTimeAgo(report.assigned_to_at || report.created_at)
    : formatTimeAgo(report.created_at);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  // Safe priority width (1-4 -> 25%-100%)
  const priorityNum = typeof report.priority === 'number' ? report.priority : 1;
  const progressWidth = Math.max(1, Math.min(4, priorityNum)) * 15; // 15px per level up to 60px

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        accessibilityLabel={report.title}
        accessibilityRole="button"
      >
        {/* Urgency accent strip on the left-hand side */}
        <View style={[styles.urgencyStrip, { backgroundColor: urgencyColor }]} />

        <View style={styles.cardBody}>
          <View style={[styles.mainRow, isRTL && styles.mainRowRTL]}>
            {/* Left/Right Text Column depending on RTL */}
            <View style={styles.textColumn}>
              {/* Title & Status Badge */}
              <View style={[styles.titleRow, isRTL && styles.titleRowRTL]}>
                <Text
                  style={[
                    styles.title,
                    isRTL && styles.titleRTL,
                    { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }
                  ]}
                  numberOfLines={1}
                >
                  {report.title && report.title.startsWith('cat_') ? t(report.title) : report.title}
                </Text>
                <StatusBadge 
                  status={report.status} 
                  lang={lang} 
                  is_resolved={report.is_resolved} 
                  work_in_progress_at={report.work_in_progress_at} 
                />
              </View>

              {/* Description */}
              <Text
                style={[
                  styles.description,
                  isRTL && styles.descriptionRTL,
                  { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }
                ]}
                numberOfLines={2}
              >
                {report.description}
              </Text>

              {/* Meta information row (Location + Time) */}
              <View style={[styles.metaRow, isRTL && styles.metaRowRTL]}>
                <View style={[styles.locationBadge, isRTL && styles.locationBadgeRTL]}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.metaText,
                      { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }
                    ]}
                  >
                    {lang === 'ar' ? 'الموقع محدد' : 'Localisé'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.timeText,
                    { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }
                  ]}
                >
                  {timeStr}
                </Text>
              </View>
            </View>

            {/* Thumbnail opposite the text block */}
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={[
                  styles.thumbnail,
                  isRTL ? { marginRight: spacing.md } : { marginLeft: spacing.md }
                ]}
                accessibilityLabel={lang === 'ar' ? 'صورة البلاغ' : 'Photo du signalement'}
              />
            )}
          </View>

          {/* Custom Team Leader Footer */}
          {isTeamLeader && (
            <View style={[styles.footer, isRTL && styles.footerRTL]}>
              <View style={[styles.prioritySection, isRTL && styles.prioritySectionRTL]}>
                <Text style={[
                  styles.priorityLabel,
                  { fontFamily: isRTL ? 'IBMPlexArabic-Medium' : 'IBMPlexSans-Medium' }
                ]}>
                  {lang === 'ar' ? 'الأولوية' : 'Priorité'}
                </Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: progressWidth, backgroundColor: urgencyColor }]} />
                </View>
              </View>

              <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.detailsButton}>
                <Text style={[
                  styles.detailsText,
                  { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }
                ]}>
                  {lang === 'ar' ? 'عرض التفاصيل ←' : 'Détails →'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight, // thin 1px `#C0EAF5` border
    marginBottom: spacing.md,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 0,
    shadowOpacity: 0,
  },
  urgencyStrip: {
    width: 4,
    height: '100%',
  },
  cardBody: {
    flex: 1,
    padding: spacing.md,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainRowRTL: {
    flexDirection: 'row-reverse',
  },
  textColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  titleRowRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
    textAlign: 'left',
  },
  titleRTL: {
    textAlign: 'right',
    marginRight: 0,
    marginLeft: spacing.sm,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
    textAlign: 'left',
  },
  descriptionRTL: {
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaRowRTL: {
    flexDirection: 'row-reverse',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationBadgeRTL: {
    flexDirection: 'row-reverse',
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  thumbnail: {
    width: 64,
    height: 54,
    borderRadius: radius.sm,
    backgroundColor: colors.pageBg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight, // thin `#C0EAF5` border
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  footerRTL: {
    flexDirection: 'row-reverse',
  },
  prioritySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prioritySectionRTL: {
    flexDirection: 'row-reverse',
  },
  priorityLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  progressBarBg: {
    width: 60,
    height: 4,
    backgroundColor: colors.surfaceGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  detailsButton: {
    paddingVertical: 2,
  },
  detailsText: {
    fontSize: 12,
    color: colors.textLink, // `#18A6C8` cyan
  },
});
