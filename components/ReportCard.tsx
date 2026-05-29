import React, { useRef } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadows, getPriorityColor, toArabicNumeral } from '../theme';
import { StatusBadge } from './StatusBadge';
import { useLanguage } from '../hooks/useLanguage';
import { ReportWithAttachments } from '../services/api';

interface ReportCardProps {
  report: ReportWithAttachments;
  onPress: () => void;
  showAssignedTime?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress, showAssignedTime = false }) => {
  const { t, lang, isRTL } = useLanguage();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const imageUrl = report.attachments?.length > 0 ? report.attachments[0].file_url : null;
  const priorityColor = getPriorityColor(report.priority);

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
        {/* Priority indicator bar */}
        <View
          style={[
            styles.priorityBar,
            { backgroundColor: priorityColor },
            isRTL 
              ? { right: 0, borderTopRightRadius: radius.md, borderBottomRightRadius: radius.md } 
              : { left: 0, borderTopLeftRadius: radius.md, borderBottomLeftRadius: radius.md },
          ]}
        />

        <View style={[styles.cardContent, isRTL ? { paddingRight: spacing.md + 4 } : { paddingLeft: spacing.md + 4 }]}>
          {/* Top row: Title + Status */}
          <View style={[styles.topRow, isRTL && styles.topRowRTL]}>
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
            <StatusBadge status={report.status} lang={lang} is_resolved={report.is_resolved} work_in_progress_at={report.work_in_progress_at} />
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

          {/* Bottom row: Location + Time + Thumbnail */}
          <View style={[styles.bottomRow, isRTL && styles.bottomRowRTL]}>
            <View style={[styles.metaSection, isRTL && styles.metaSectionRTL]}>
              <View style={[styles.locationRow, isRTL && styles.locationRowRTL]}>
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

            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={[styles.thumbnail, isRTL ? { marginRight: spacing.sm } : { marginLeft: spacing.sm }]}
                accessibilityLabel={lang === 'ar' ? 'صورة البلاغ' : 'Photo du signalement'}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md, // 8px Modest rounding
    borderWidth: 1,
    borderColor: colors.borderLight, // thin 1px border
    marginBottom: spacing.md,
    overflow: 'hidden',
    flexDirection: 'row',
    ...shadows.card,
  },
  priorityBar: {
    width: 4,
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  topRowRTL: {
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
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
    textAlign: 'left',
  },
  descriptionRTL: {
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider, // crisp hairline divider
  },
  bottomRowRTL: {
    flexDirection: 'row-reverse',
  },
  metaSection: {
    flex: 1,
  },
  metaSectionRTL: {
    alignItems: 'flex-end',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationRowRTL: {
    flexDirection: 'row-reverse',
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  thumbnail: {
    width: 66,
    height: 66,
    borderRadius: radius.sm, // Beautiful 12px rounded image
    backgroundColor: colors.pageBg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});
