import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, shadows, toArabicNumeral } from '../theme';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { useLanguage } from '../hooks/useLanguage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

/** Status timeline step component */
const TimelineStep: React.FC<{
  title: string;
  subtitle: string;
  time?: string;
  completed: boolean;
  current: boolean;
  isLast: boolean;
  isRTL: boolean;
}> = ({ title, subtitle, time, completed, current, isLast, isRTL }) => {
  return (
    <View style={[tlStyles.item, isRTL ? tlStyles.itemRTL : null]}>
      <View style={tlStyles.lineColumn}>
        {current ? (
          <View style={tlStyles.pulseOutline}>
            <View style={[tlStyles.dot, tlStyles.dotCurrent]}>
              <View style={tlStyles.pulseInner} />
            </View>
          </View>
        ) : (
          <View style={[
            tlStyles.dot,
            completed ? tlStyles.dotCompleted : null,
          ]}>
            {completed ? <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" /> : null}
          </View>
        )}
        {!isLast ? (
          <View style={[
            tlStyles.line,
            completed ? tlStyles.lineCompleted : null,
            current ? tlStyles.lineCompleted : null,
          ]} />
        ) : null}
      </View>
      <View style={[tlStyles.content, isRTL ? tlStyles.contentRTL : null]}>
        <View style={[tlStyles.header, isRTL ? tlStyles.headerRTL : null]}>
          <Text style={[
            tlStyles.title,
            { opacity: completed || current ? 1 : 0.4, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' },
            isRTL ? tlStyles.titleRTL : null,
          ]}>
            {title}
          </Text>
          {time ? <Text style={[tlStyles.time, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{time}</Text> : null}
        </View>
        <Text style={[
          tlStyles.subtitle,
          { opacity: completed || current ? 0.7 : 0.3, fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' },
          isRTL ? tlStyles.subtitleRTL : null,
        ]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

export const ReportDetailsScreen = ({ route, navigation }: any) => {
  const { report } = route.params;
  const { t, lang, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const location = typeof report.location === 'string'
    ? JSON.parse(report.location)
    : report.location;

  const imageUrl = report.attachments?.length > 0 ? report.attachments[0].file_url : null;

  // Determine which timeline steps are complete
  const statusIndex = (() => {
    switch (report.status) {
      case 0: case 'pending': return 0;
      case 'assigned': return 1;
      case 1: case 'in_progress': return 2;
      case 2: case 'completed': return 3;
      case 'approved': return 4;
      default: return 0;
    }
  })();

  const openMaps = () => {
    if (!location?.latitude || !location?.longitude) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const formatStepTime = (dateString?: string | null) => {
    if (!dateString) return undefined;
    return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const timelineSteps = [
    { title: t('submitted'), subtitle: t('receivedByServices'), time: formatStepTime(report.created_at) },
    { title: t('underInvestigationTimeline'), subtitle: t('underInvestigationTimeline'), time: formatStepTime(report.under_investigation_at) },
    { title: t('leaderAssignedTimeline'), subtitle: t('techTeamAssigned'), time: formatStepTime(report.assigned_to_at) },
    { title: t('workInProgressTimeline'), subtitle: t('maintenanceOnSite'), time: formatStepTime(report.work_in_progress_at) },
    { title: t('resolvedTimeline'), subtitle: t('issueFixed'), time: formatStepTime(report.resolved_at) },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.heroImage} accessibilityLabel={t('evidencePhoto')} />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialCommunityIcons name="image-off-outline" size={54} color={colors.textSecondary} />
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.05)']}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Back button */}
          <View style={[styles.headerOverlay, { paddingTop: insets.top + spacing.sm }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, isRTL && styles.backButtonRTL]}
              accessibilityLabel={t('back')}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name={isRTL ? 'chevron-right' : 'chevron-left'} size={26} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          {/* Status + Priority */}
          <View style={[styles.badgeRow, isRTL && styles.badgeRowRTL]}>
            <StatusBadge status={report.status} lang={lang} is_resolved={report.is_resolved} work_in_progress_at={report.work_in_progress_at} />
            <PriorityBadge priority={report.priority} lang={lang} />
          </View>

          {/* Title */}
          <Text style={[styles.title, isRTL && styles.titleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
            {report.title && report.title.startsWith('cat_') ? t(report.title) : report.title}
          </Text>

          {/* Meta */}
          <View style={[styles.metaRow, isRTL && styles.metaRowRTL]}>
            <View style={[styles.metaItem, isRTL && styles.metaItemRTL]}>
              <MaterialCommunityIcons name="calendar-outline" size={15} color={colors.textSecondary} />
              <Text style={[styles.metaText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                {new Date(report.created_at).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </Text>
            </View>
            <View style={[styles.metaItem, isRTL && styles.metaItemRTL]}>
              <MaterialCommunityIcons name="map-marker-outline" size={15} color={colors.textSecondary} />
              <Text style={[styles.metaText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{t('locationVerified')}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Description */}
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('description')}</Text>
          <Text style={[styles.description, isRTL && styles.descriptionRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{report.description}</Text>

          {/* Info Cards */}
          <View style={[styles.infoGrid, isRTL && styles.infoGridRTL]}>
            <View style={styles.infoCard}>
              <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('reportId')}</Text>
              <Text style={[styles.infoValue, isRTL && styles.infoValueRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                #{report.id.substring(0, 8).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.infoCard, location?.latitude && styles.locationCardActive]}
              onPress={openMaps}
              disabled={!location?.latitude}
              activeOpacity={0.8}
              accessibilityLabel={t('openGoogleMaps')}
              accessibilityRole="button"
            >
              <View style={[styles.locationCardInner, isRTL && styles.locationCardInnerRTL]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('locationLabel')}</Text>
                  <Text style={[
                    styles.infoValue, 
                    location?.latitude && { color: colors.primary }, 
                    isRTL && styles.infoValueRTL,
                    { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }
                  ]}>
                    {location?.latitude
                      ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                      : 'N/A'}
                  </Text>
                </View>
                {location?.latitude && (
                  <View style={styles.googleMapsButton}>
                    <MaterialCommunityIcons name="google-maps" size={24} color="#4285F4" />
                  </View>
                )}
              </View>
              {location?.latitude && (
                <View style={[styles.viewOnMapRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <MaterialCommunityIcons name="open-in-new" size={12} color={colors.primary} />
                  <Text style={[styles.viewOnMapText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('viewOnMap')}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Timeline */}
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('progressTimeline')}</Text>
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <TimelineStep
                key={index}
                title={step.title}
                subtitle={step.subtitle}
                time={step.time}
                completed={index < statusIndex}
                current={index === statusIndex}
                isLast={index === timelineSteps.length - 1}
                isRTL={isRTL}
              />
            ))}
          </View>

          {/* Additional images (added by team leader) */}
          {Array.isArray(report.attachments) && report.attachments.length > 1 ? (
            <>
              <Text style={[styles.sectionTitle, isRTL ? styles.sectionTitleRTL : null, { marginTop: spacing.md, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                {t('additionalPhotos')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.completionScroll}>
                {report.attachments.slice(1).map((att: any, i: number) => (
                  <Image
                    key={i}
                    source={{ uri: att.file_url }}
                    style={styles.completionImage}
                    accessibilityLabel={`${t('additionalPhotos')} ${i + 1}`}
                  />
                ))}
              </ScrollView>
            </>
          ) : null}

          {/* Completion images */}
          {Array.isArray(report.completion_images) && report.completion_images.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, isRTL ? styles.sectionTitleRTL : null, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('completionImages')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.completionScroll}>
                {report.completion_images.map((uri: string, i: number) => (
                  <Image
                    key={i}
                    source={{ uri }}
                    style={styles.completionImage}
                    accessibilityLabel={`${t('completionImages')} ${i + 1}`}
                  />
                ))}
              </ScrollView>
            </>
          ) : null}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pageBg },
  heroContainer: { height: height * 0.35, width: '100%' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImage: {
    width: '100%', height: '100%',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  headerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backButtonRTL: {
    alignSelf: 'flex-end',
  },
  contentCard: {
    flex: 1, marginTop: -24,
    borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md,
    borderWidth: 1, borderColor: colors.borderLight,
    backgroundColor: colors.white,
    padding: spacing.md,
    minHeight: height * 0.6,
  },
  badgeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  badgeRowRTL: { flexDirection: 'row-reverse' },
  title: {
    fontSize: 20,
    color: colors.textPrimary, marginBottom: spacing.sm,
    textAlign: 'left',
  },
  titleRTL: { textAlign: 'right' },
  metaRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  metaRowRTL: { flexDirection: 'row-reverse' },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaItemRTL: { flexDirection: 'row-reverse' },
  metaText: {
    color: colors.textSecondary, marginLeft: 4,
    fontSize: 12,
  },
  divider: { backgroundColor: colors.borderLight, marginBottom: spacing.md },
  sectionTitle: {
    fontSize: 14,
    color: colors.textPrimary, marginBottom: spacing.xs,
    textAlign: 'left',
  },
  sectionTitleRTL: { textAlign: 'right' },
  description: {
    color: colors.textSecondary, lineHeight: 22,
    marginBottom: spacing.lg, fontSize: 13, textAlign: 'left',
  },
  descriptionRTL: { textAlign: 'right' },
  infoGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  infoGridRTL: { flexDirection: 'row-reverse' },
  infoCard: {
    flex: 1, padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.pageBg,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: 2, fontSize: 10, letterSpacing: 0.3,
    textTransform: 'uppercase', textAlign: 'left',
  },
  infoLabelRTL: { textAlign: 'right' },
  infoValue: {
    color: colors.textPrimary, fontSize: 12,
    textAlign: 'left',
  },
  infoValueRTL: { textAlign: 'right' },
  locationCardInner: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationCardInnerRTL: { flexDirection: 'row-reverse' },
  locationCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  googleMapsButton: {
    width: 32, height: 32,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  viewOnMapRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 6, gap: 2,
  },
  viewOnMapText: {
    fontSize: 10, color: colors.primary,
  },
  timeline: { marginTop: spacing.xs, marginBottom: spacing.md },
  completionScroll: { marginBottom: spacing.md },
  completionImage: {
    width: 100, height: 100,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});

// ─── Timeline Styles ──────────────────────────────────────────────────────────
const tlStyles = StyleSheet.create({
  item: { flexDirection: 'row', minHeight: 60 },
  itemRTL: { flexDirection: 'row-reverse' },
  lineColumn: { alignItems: 'center', width: 24, justifyContent: 'flex-start', paddingTop: 2 },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.borderLight,
    justifyContent: 'center', alignItems: 'center', zIndex: 1,
  },
  dotCompleted: { backgroundColor: colors.primary },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseOutline: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(26, 111, 163, 0.15)', // Soft pulsing outer glow
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  pulseInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  line: {
    width: 2, flex: 1,
    backgroundColor: colors.borderLight, marginVertical: -2,
  },
  lineCompleted: { backgroundColor: colors.primary },
  content: { flex: 1, marginLeft: spacing.sm, paddingBottom: spacing.sm },
  contentRTL: { marginLeft: 0, marginRight: spacing.sm },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRTL: { flexDirection: 'row-reverse' },
  title: {
    color: colors.textPrimary, fontSize: 13,
    textAlign: 'left',
  },
  titleRTL: { textAlign: 'right' },
  time: { color: colors.textSecondary, fontSize: 10 },
  subtitle: {
    color: colors.textSecondary, marginTop: 2, fontSize: 11,
    textAlign: 'left',
  },
  subtitleRTL: { textAlign: 'right' },
});
