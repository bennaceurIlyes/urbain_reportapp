import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows, getStatusColor, toArabicNumeral } from '../theme';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { GovHeader } from '../components/GovHeader';
import { useLanguage } from '../hooks/useLanguage';
import { getStatusLabel } from '../i18n/strings';
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
    <View style={[tlStyles.item, isRTL && tlStyles.itemRTL]}>
      <View style={tlStyles.lineColumn}>
        <View style={[
          tlStyles.dot,
          completed && tlStyles.dotCompleted,
          current && tlStyles.dotCurrent,
        ]}>
          {completed && <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />}
        </View>
        {!isLast && (
          <View style={[
            tlStyles.line,
            completed && tlStyles.lineCompleted,
          ]} />
        )}
      </View>
      <View style={[tlStyles.content, isRTL && tlStyles.contentRTL]}>
        <View style={[tlStyles.header, isRTL && tlStyles.headerRTL]}>
          <Text style={[
            tlStyles.title,
            { opacity: completed || current ? 1 : 0.4 },
            isRTL && tlStyles.titleRTL,
          ]}>
            {title}
          </Text>
          {time && <Text style={tlStyles.time}>{time}</Text>}
        </View>
        <Text style={[
          tlStyles.subtitle,
          { opacity: completed || current ? 0.7 : 0.3 },
          isRTL && tlStyles.subtitleRTL,
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

  const statusColor = getStatusColor(report.status);

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

  const timelineSteps = [
    { title: t('reportCreated'), subtitle: t('receivedByServices') },
    { title: t('underInvestigation'), subtitle: t('techTeamAssigned') },
    { title: t('workInProgress'), subtitle: t('maintenanceOnSite') },
    { title: t('resolved'), subtitle: t('issueFixed') },
    { title: t('approved'), subtitle: t('approvedByAdmin') },
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
              <MaterialCommunityIcons name="image-off-outline" size={64} color={colors.borderLight} />
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.08)']}
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
              <MaterialCommunityIcons name={isRTL ? 'chevron-right' : 'chevron-left'} size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          {/* Status + Priority */}
          <View style={[styles.badgeRow, isRTL && styles.badgeRowRTL]}>
            <StatusBadge status={report.status} lang={lang} />
            <PriorityBadge priority={report.priority} lang={lang} />
          </View>

          {/* Title */}
          <Text style={[styles.title, isRTL && styles.titleRTL]}>{report.title}</Text>

          {/* Meta */}
          <View style={[styles.metaRow, isRTL && styles.metaRowRTL]}>
            <View style={[styles.metaItem, isRTL && styles.metaItemRTL]}>
              <MaterialCommunityIcons name="calendar-outline" size={16} color={colors.textMuted} />
              <Text style={styles.metaText}>
                {new Date(report.created_at).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </Text>
            </View>
            <View style={[styles.metaItem, isRTL && styles.metaItemRTL]}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.textMuted} />
              <Text style={styles.metaText}>{t('locationVerified')}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Description */}
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{t('description')}</Text>
          <Text style={[styles.description, isRTL && styles.descriptionRTL]}>{report.description}</Text>

          {/* Info Cards */}
          <View style={[styles.infoGrid, isRTL && styles.infoGridRTL]}>
            <View style={styles.infoCard}>
              <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>{t('reportId')}</Text>
              <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>
                #{report.id.substring(0, 8).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.infoCard}
              onPress={openMaps}
              disabled={!location?.latitude}
              activeOpacity={0.7}
              accessibilityLabel={t('locationLabel')}
              accessibilityRole="button"
            >
              <View style={[styles.locationCardInner, isRTL && styles.locationCardInnerRTL]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>{t('locationLabel')}</Text>
                  <Text style={[styles.infoValue, location?.latitude && { color: colors.republicGreen }, isRTL && styles.infoValueRTL]}>
                    {location?.latitude
                      ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                      : 'N/A'}
                  </Text>
                </View>
                {location?.latitude && (
                  <MaterialCommunityIcons name="map-marker-radius" size={24} color={colors.republicGreen} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Timeline */}
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{t('progressTimeline')}</Text>
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <TimelineStep
                key={index}
                title={step.title}
                subtitle={step.subtitle}
                time={index === 0
                  ? new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : undefined}
                completed={index < statusIndex}
                current={index === statusIndex}
                isLast={index === timelineSteps.length - 1}
                isRTL={isRTL}
              />
            ))}
          </View>

          {/* Completion images */}
          {report.completion_images && report.completion_images.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{t('completionImages')}</Text>
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
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  heroContainer: { height: height * 0.4, width: '100%' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImage: {
    width: '100%', height: '100%',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.surfaceGreen,
  },
  headerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    ...shadows.card,
  },
  backButtonRTL: {
    alignSelf: 'flex-end',
  },
  contentCard: {
    flex: 1, marginTop: -32,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    backgroundColor: colors.cardWhite,
    padding: spacing.lg,
    minHeight: height * 0.6,
  },
  badgeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.lg,
  },
  badgeRowRTL: { flexDirection: 'row-reverse' },
  title: {
    fontSize: 24, fontWeight: '700',
    color: colors.textPrimary, marginBottom: spacing.md,
    letterSpacing: -0.5, textAlign: 'left',
  },
  titleRTL: { textAlign: 'right' },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.lg },
  metaRowRTL: { flexDirection: 'row-reverse' },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaItemRTL: { flexDirection: 'row-reverse' },
  metaText: {
    color: colors.textMuted, marginLeft: 6,
    fontWeight: '500', fontSize: 13,
  },
  divider: { backgroundColor: colors.borderLight, marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: 16, fontWeight: '700',
    color: colors.textPrimary, marginBottom: spacing.sm,
    textAlign: 'left',
  },
  sectionTitleRTL: { textAlign: 'right' },
  description: {
    color: colors.textSecondary, lineHeight: 26,
    marginBottom: spacing.xl, fontSize: 15, textAlign: 'left',
  },
  descriptionRTL: { textAlign: 'right' },
  infoGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  infoGridRTL: { flexDirection: 'row-reverse' },
  infoCard: {
    flex: 1, padding: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.offWhite,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  infoLabel: {
    color: colors.textMuted, fontWeight: '700',
    marginBottom: 4, fontSize: 11, letterSpacing: 0.5,
    textTransform: 'uppercase', textAlign: 'left',
  },
  infoLabelRTL: { textAlign: 'right' },
  infoValue: {
    color: colors.textPrimary, fontWeight: '600', fontSize: 13,
    textAlign: 'left',
  },
  infoValueRTL: { textAlign: 'right' },
  locationCardInner: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationCardInnerRTL: { flexDirection: 'row-reverse' },
  timeline: { marginTop: spacing.sm, marginBottom: spacing.lg },
  completionScroll: { marginBottom: spacing.lg },
  completionImage: {
    width: 120, height: 120,
    borderRadius: borderRadius.badge,
    marginRight: spacing.sm,
    backgroundColor: colors.offWhite,
  },
});

// ─── Timeline Styles ──────────────────────────────────────────────────────────
const tlStyles = StyleSheet.create({
  item: { flexDirection: 'row', minHeight: 65 },
  itemRTL: { flexDirection: 'row-reverse' },
  lineColumn: { alignItems: 'center', width: 24 },
  dot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.borderLight,
    justifyContent: 'center', alignItems: 'center', zIndex: 1,
  },
  dotCompleted: { backgroundColor: colors.republicGreen },
  dotCurrent: {
    backgroundColor: colors.surfaceGreen,
    borderWidth: 3, borderColor: colors.republicGreen,
  },
  line: {
    width: 2, flex: 1,
    backgroundColor: colors.borderLight, marginVertical: -2,
  },
  lineCompleted: { backgroundColor: colors.republicGreen },
  content: { flex: 1, marginLeft: spacing.md, paddingBottom: spacing.md },
  contentRTL: { marginLeft: 0, marginRight: spacing.md },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRTL: { flexDirection: 'row-reverse' },
  title: {
    fontWeight: '700', color: colors.textPrimary, fontSize: 14,
    textAlign: 'left',
  },
  titleRTL: { textAlign: 'right' },
  time: { color: colors.textMuted, fontWeight: '500', fontSize: 11 },
  subtitle: {
    color: colors.textSecondary, marginTop: 2, fontSize: 12,
    textAlign: 'left',
  },
  subtitleRTL: { textAlign: 'right' },
});
