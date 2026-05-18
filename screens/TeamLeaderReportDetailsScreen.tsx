import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar, Alert, Linking, Animated } from 'react-native';
import { Text, Divider, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows, getStatusColor, toArabicNumeral } from '../theme';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { useLanguage } from '../hooks/useLanguage';
import { getStatusLabel } from '../i18n/strings';
import { updateReportStatus } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export const TeamLeaderReportDetailsScreen = ({ route, navigation }: any) => {
  const { report } = route.params;
  const { t, lang, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(report.status);
  const btnScale = useRef(new Animated.Value(1)).current;

  const location = typeof report.location === 'string'
    ? JSON.parse(report.location)
    : report.location;

  const imageUrl = report.attachments?.length > 0 ? report.attachments[0].file_url : null;

  const openMaps = () => {
    if (!location?.latitude || !location?.longitude) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handleStartWork = async () => {
    setLoading(true);
    try {
      await updateReportStatus(report.id, 'in_progress');
      setCurrentStatus('in_progress');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await updateReportStatus(report.id, 'approved');
      setCurrentStatus('approved');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = () => {
    navigation.navigate('TeamLeaderCompletionUpload', {
      report,
      onComplete: () => setCurrentStatus('completed'),
    });
  };

  const onBtnPressIn = () => {
    Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const onBtnPressOut = () => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero */}
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
          {/* ─── Work Actions (Prominent, at top) ─── */}
          <View style={styles.actionsCard}>
            <Text style={[styles.actionsTitle, isRTL && styles.actionsTitleRTL]}>{t('workActions')}</Text>

            {loading ? (
              <ActivityIndicator size="large" color={colors.republicGreen} style={{ padding: spacing.md }} />
            ) : (
              <View style={styles.actionsContainer}>
                {(currentStatus === 'assigned' || currentStatus === 0) && (
                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                      style={styles.actionButtonGreen}
                      onPress={handleStartWork}
                      onPressIn={onBtnPressIn}
                      onPressOut={onBtnPressOut}
                      activeOpacity={1}
                      accessibilityLabel={t('startWork')}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons name="play-circle-outline" size={22} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>{t('startWork')}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                {(currentStatus === 'in_progress' || currentStatus === 1) && (
                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                      style={styles.actionButtonGreen}
                      onPress={handleMarkCompleted}
                      onPressIn={onBtnPressIn}
                      onPressOut={onBtnPressOut}
                      activeOpacity={1}
                      accessibilityLabel={t('uploadProof')}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons name="camera-outline" size={22} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>{t('uploadProof')}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                {(currentStatus === 'completed' || currentStatus === 2) && (
                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                      style={styles.actionButtonGold}
                      onPress={handleApprove}
                      onPressIn={onBtnPressIn}
                      onPressOut={onBtnPressOut}
                      activeOpacity={1}
                      accessibilityLabel={t('approveWork')}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons name="shield-check" size={22} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>{t('approveWork')}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                {currentStatus === 'approved' && (
                  <View style={styles.approvedBanner}>
                    <MaterialCommunityIcons name="check-decagram" size={24} color={colors.status.approved} />
                    <Text style={[styles.approvedText, isRTL && { textAlign: 'right' }]}>
                      {t('statusApproved')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Status + Priority */}
          <View style={[styles.badgeRow, isRTL && styles.badgeRowRTL]}>
            <StatusBadge status={currentStatus} lang={lang} />
            <PriorityBadge priority={report.priority} lang={lang} />
          </View>

          <Text style={[styles.title, isRTL && styles.titleRTL]}>{report.title}</Text>

          {/* Meta */}
          <View style={[styles.metaRow, isRTL && styles.metaRowRTL]}>
            <View style={[styles.metaItem, isRTL && styles.metaItemRTL]}>
              <MaterialCommunityIcons name="calendar-outline" size={16} color={colors.textMuted} />
              <Text style={styles.metaText}>
                {t('assigned')}: {new Date(report.assigned_to_at || report.created_at).toLocaleDateString(
                  lang === 'ar' ? 'ar-DZ' : 'fr-DZ'
                )}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{t('description')}</Text>
          <Text style={[styles.description, isRTL && styles.descriptionRTL]}>{report.description}</Text>

          {/* Info Cards */}
          <View style={[styles.infoGrid, isRTL && styles.infoGridRTL]}>
            <View style={styles.infoCard}>
              <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('reportId')}</Text>
              <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>#{report.id.substring(0, 8).toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={styles.infoCard} onPress={openMaps} disabled={!location?.latitude} activeOpacity={0.7}>
              <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('locationLabel')}</Text>
                  <Text style={[styles.infoValue, location?.latitude && { color: colors.republicGreen }, isRTL && { textAlign: 'right' }]}>
                    {location?.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'N/A'}
                  </Text>
                </View>
                {location?.latitude && (
                  <MaterialCommunityIcons name="map-marker-radius" size={24} color={colors.republicGreen} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Completion images */}
          {report.completion_images && report.completion_images.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{t('completionImages')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {report.completion_images.map((uri: string, i: number) => (
                  <Image key={i} source={{ uri }} style={styles.completionImage} accessibilityLabel={`${t('completionImages')} ${i + 1}`} />
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
  heroContainer: { height: height * 0.35, width: '100%' },
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
  backButtonRTL: { alignSelf: 'flex-end' },
  contentCard: {
    flex: 1, marginTop: -32,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    backgroundColor: colors.cardWhite,
    padding: spacing.lg,
    minHeight: height * 0.65,
  },

  // Work actions card
  actionsCard: {
    backgroundColor: colors.surfaceGreen,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.republicGreen + '20',
  },
  actionsTitle: {
    fontSize: 14, fontWeight: '700',
    color: colors.republicGreen, marginBottom: spacing.sm,
    textAlign: 'left',
  },
  actionsTitleRTL: { textAlign: 'right' },
  actionsContainer: { gap: spacing.sm },
  actionButtonGreen: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.republicGreen,
    borderRadius: borderRadius.button,
    paddingVertical: 14, gap: spacing.sm,
  },
  actionButtonGold: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.governmentGold,
    borderRadius: borderRadius.button,
    paddingVertical: 14, gap: spacing.sm,
  },
  actionButtonText: {
    color: '#FFFFFF', fontSize: 16, fontWeight: '700',
  },
  approvedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: spacing.md, gap: spacing.sm,
  },
  approvedText: {
    color: colors.status.approved, fontSize: 16, fontWeight: '700',
  },

  badgeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  badgeRowRTL: { flexDirection: 'row-reverse' },
  title: {
    fontSize: 22, fontWeight: '700',
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
  infoValue: {
    color: colors.textPrimary, fontWeight: '600', fontSize: 13,
    textAlign: 'left',
  },
  completionImage: {
    width: 120, height: 120,
    borderRadius: borderRadius.badge,
    marginRight: spacing.sm,
    backgroundColor: colors.offWhite,
  },
});
