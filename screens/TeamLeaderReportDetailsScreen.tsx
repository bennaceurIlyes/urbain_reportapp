import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar, Alert, Linking, Animated } from 'react-native';
import { Text, Divider, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, shadows, toArabicNumeral } from '../theme';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { useLanguage } from '../hooks/useLanguage';
import { updateReportStatus, addImageToReport } from '../services/api';
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
            { opacity: completed || current ? 1 : 0.4, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' },
            isRTL && tlStyles.titleRTL,
          ]}>
            {title}
          </Text>
          {time && <Text style={[tlStyles.time, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{time}</Text>}
        </View>
        <Text style={[
          tlStyles.subtitle,
          { opacity: completed || current ? 0.7 : 0.3, fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' },
          isRTL && tlStyles.subtitleRTL,
        ]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

export const TeamLeaderReportDetailsScreen = ({ route, navigation }: any) => {
  const { report } = route.params;
  const { t, lang, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(report.status);
  const [isResolved, setIsResolved] = useState(
    report.is_resolved === true ||
    report.is_resolved === 'true' ||
    report.status === 3 ||
    report.status === 4 ||
    report.status === 'completed' ||
    report.status === 'approved'
  );
  const [workInProgressAt, setWorkInProgressAt] = useState<string | null>(report.work_in_progress_at);
  
  // Initialize with any existing additional attachments (index 1 and beyond)
  const initialAdditionalImages = report.attachments?.length > 1 
    ? report.attachments.slice(1).map((att: any) => att.file_url)
    : [];
  
  const [addedImages, setAddedImages] = useState<string[]>(initialAdditionalImages);
  
  const btnScale = useRef(new Animated.Value(1)).current;
 
  const location = typeof report.location === 'string'
    ? JSON.parse(report.location)
    : report.location;
 
  const imageUrl = report.attachments?.length > 0 ? report.attachments[0].file_url : null;
 
  const statusIndex = (() => {
    if (isResolved || currentStatus === 3 || currentStatus === 4 || currentStatus === 'completed' || currentStatus === 'approved') {
      return 4;
    }
    if (workInProgressAt) {
      return 3;
    }
    if (report.assigned_to_at) {
      return 2;
    }
    if (report.under_investigation_at) {
      return 1;
    }
    return 0;
  })();

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
    { title: t('workInProgressTimeline'), subtitle: t('maintenanceOnSite'), time: formatStepTime(workInProgressAt) },
    { title: t('resolvedTimeline'), subtitle: t('issueFixed'), time: formatStepTime(report.resolved_at || report.approved_at || (isResolved ? new Date().toISOString() : null)) },
  ];

  const openMaps = () => {
    if (!location?.latitude || !location?.longitude) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };
 
  const handleStartWork = async () => {
    setLoading(true);
    try {
      await updateReportStatus(report.id, 2);
      setCurrentStatus(2);
      setWorkInProgressAt(new Date().toISOString());
      setIsResolved(false);
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };
 
  const handleMarkCompleted = () => {
    navigation.navigate('TeamLeaderCompletionUpload', {
      report,
      onComplete: () => {
        setCurrentStatus(3);
        setIsResolved(true);
      },
    });
  };
 
  // ─── Direct mark as complete (without upload screen) ───
  const handleDirectComplete = async () => {
    Alert.alert(
      t('completeReport'),
      t('markAsComplete') + '?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('done'),
          style: 'default',
          onPress: async () => {
            setLoading(true);
            try {
              await updateReportStatus(report.id, 3);
              setCurrentStatus(3);
              setIsResolved(true);
            } catch (error: any) {
              Alert.alert(t('error'), error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // ─── Add Image (from gallery or camera) ───
  const handleAddImage = () => {
    Alert.alert(
      t('addImage'),
      '',
      [
        {
          text: t('camera'),
          onPress: async () => {
            try {
              const permission = await ImagePicker.requestCameraPermissionsAsync();
              if (permission.status !== 'granted') {
                Alert.alert(t('error'), lang === 'ar' ? 'يرجى تفعيل صلاحية الكاميرا في الإعدادات' : 'Veuillez activer la permission de caméra dans les paramètres');
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                quality: 0.5,
              });
              if (!result.canceled) {
                await uploadAddedImage(result.assets[0].uri);
              }
            } catch (error) {
              console.error('Camera launch error:', error);
            }
          },
        },
        {
          text: t('gallery'),
          onPress: async () => {
            try {
              const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (permission.status !== 'granted') {
                Alert.alert(t('error'), lang === 'ar' ? 'يرجى تفعيل صلاحية الوصول إلى الصور في الإعدادات' : 'Veuillez activer la permission de galerie dans les paramètres');
                return;
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.5,
              });
              if (!result.canceled) {
                await uploadAddedImage(result.assets[0].uri);
              }
            } catch (error) {
              console.error('Gallery launch error:', error);
            }
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ]
    );
  };

  const uploadAddedImage = async (uri: string) => {
    setImageLoading(true);
    try {
      const publicUrl = await addImageToReport(report.id, uri);
      setAddedImages(prev => [...prev, publicUrl]);
      Alert.alert(t('imageAdded'), t('imageAddedSuccess'));
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setImageLoading(false);
    }
  };

  const onBtnPressIn = () => {
    Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const onBtnPressOut = () => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const displayTitle = report.title && report.title.startsWith('cat_') ? t(report.title) : report.title;

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
              <MaterialCommunityIcons name="image-off-outline" size={54} color={colors.textSecondary} />
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.05)']}
            style={StyleSheet.absoluteFillObject}
          />
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
          {isResolved ? (
            <>
              {/* Status + Priority */}
              <View style={[styles.badgeRow, isRTL && styles.badgeRowRTL]}>
                <StatusBadge status={currentStatus} lang={lang} is_resolved={isResolved} work_in_progress_at={workInProgressAt} />
                <PriorityBadge priority={report.priority} lang={lang} />
              </View>

              <Text style={[styles.title, isRTL && styles.titleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{displayTitle}</Text>

              <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('description')}</Text>
              <Text style={[styles.description, isRTL && styles.descriptionRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{report.description}</Text>

              {/* Timeline Section */}
              <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { marginTop: spacing.md, marginBottom: spacing.xs, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                {lang === 'ar' ? 'الجدول الزمني للمتابعة' : 'Timeline de suivi'}
              </Text>
              <View style={tlStyles.timeline}>
                {timelineSteps.map((step, index) => {
                  const isStepCompleted = index < statusIndex;
                  const isStepCurrent = index === statusIndex;
                  return (
                    <TimelineStep
                      key={index}
                      title={step.title}
                      subtitle={step.subtitle}
                      time={step.time}
                      completed={isStepCompleted}
                      current={isStepCurrent}
                      isLast={index === timelineSteps.length - 1}
                      isRTL={isRTL}
                    />
                  );
                })}
              </View>

              {/* Location Card */}
              <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { marginTop: spacing.md, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                {t('locationLabel')}
              </Text>
              <TouchableOpacity
                style={[styles.infoCard, location?.latitude && styles.locationCardActive, { width: '100%', marginHorizontal: 0 }]}
                onPress={openMaps}
                disabled={!location?.latitude}
                activeOpacity={0.8}
                accessibilityLabel={t('openGoogleMaps')}
                accessibilityRole="button"
              >
                <View style={[styles.locationHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('locationLabel')}</Text>
                    <Text style={[styles.infoValue, location?.latitude && { color: colors.primary }, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                      {location?.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'N/A'}
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

              {/* Completion images */}
              {report.completion_images && report.completion_images.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { marginTop: spacing.md, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                    {t('completionImages')}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
                    {report.completion_images.map((uri: string, i: number) => (
                      <Image key={i} source={{ uri }} style={styles.completionImage} accessibilityLabel={`${t('completionImages')} ${i + 1}`} />
                    ))}
                  </ScrollView>
                </>
              )}
            </>
          ) : (
            <>
              {/* ─── Work Actions (Prominent, at top) ─── */}
              <View style={styles.actionsCard}>
                <Text style={[styles.actionsTitle, isRTL && styles.actionsTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('workActions')}</Text>

                {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} style={{ padding: spacing.md }} />
                ) : (
                  <View style={styles.actionsContainer}>
                    {!workInProgressAt ? (
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
                          <MaterialCommunityIcons name="play-circle-outline" size={20} color="#FFFFFF" />
                          <Text style={[styles.actionButtonText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('startWork')}</Text>
                        </TouchableOpacity>
                      </Animated.View>
                    ) : (
                      <>
                        {/* Under implementation flow: complete report (requires completion photo upload) */}
                        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                          <TouchableOpacity
                            style={styles.actionButtonGreen}
                            onPress={handleMarkCompleted}
                            onPressIn={onBtnPressIn}
                            onPressOut={onBtnPressOut}
                            activeOpacity={1}
                            accessibilityLabel={t('markAsComplete')}
                            accessibilityRole="button"
                          >
                            <MaterialCommunityIcons name="check-decagram" size={20} color="#FFFFFF" />
                            <Text style={[styles.actionButtonText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('completeReport')}</Text>
                          </TouchableOpacity>
                        </Animated.View>

                        {/* Upload supplementary work proof images */}
                        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                          <TouchableOpacity
                            style={styles.actionButtonOutline}
                            onPress={handleAddImage}
                            onPressIn={onBtnPressIn}
                            onPressOut={onBtnPressOut}
                            activeOpacity={1}
                            disabled={imageLoading}
                            accessibilityLabel={t('addImage')}
                            accessibilityRole="button"
                          >
                            {imageLoading ? (
                              <ActivityIndicator size="small" color={colors.primary} />
                            ) : (
                              <>
                                <MaterialCommunityIcons name="camera-plus-outline" size={20} color={colors.primary} />
                                <Text style={[styles.actionButtonTextGreen, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('uploadProof')}</Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </Animated.View>
                      </>
                    )}
                  </View>
                )}
              </View>

              {/* Added Images Preview */}
              {addedImages.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { marginTop: spacing.md, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                    {t('additionalPhotos')}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
                    {addedImages.map((uri, i) => (
                      <Image key={i} source={{ uri }} style={styles.addedImage} accessibilityLabel={`${t('addImage')} ${i + 1}`} />
                    ))}
                  </ScrollView>
                </>
              )}

              {/* Status + Priority */}
              <View style={[styles.badgeRow, isRTL && styles.badgeRowRTL]}>
                <StatusBadge status={currentStatus} lang={lang} is_resolved={isResolved} work_in_progress_at={workInProgressAt} />
                <PriorityBadge priority={report.priority} lang={lang} />
              </View>

              <Text style={[styles.title, isRTL && styles.titleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{displayTitle}</Text>

              {/* Meta */}
              <View style={[styles.metaRow, isRTL && styles.metaRowRTL]}>
                <View style={[styles.metaItem, isRTL && styles.metaItemRTL]}>
                  <MaterialCommunityIcons name="calendar-outline" size={15} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                    {t('assigned')}: {new Date(report.assigned_to_at || report.created_at).toLocaleDateString(
                      lang === 'ar' ? 'ar-DZ' : 'fr-DZ'
                    )}
                  </Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('description')}</Text>
              <Text style={[styles.description, isRTL && styles.descriptionRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{report.description}</Text>

              {/* Timeline Section */}
              <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { marginTop: spacing.md, marginBottom: spacing.xs, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                {lang === 'ar' ? 'الجدول الزمني للمتابعة' : 'Timeline de suivi'}
              </Text>
              <View style={tlStyles.timeline}>
                {timelineSteps.map((step, index) => {
                  const isStepCompleted = index < statusIndex;
                  const isStepCurrent = index === statusIndex;
                  return (
                    <TimelineStep
                      key={index}
                      title={step.title}
                      subtitle={step.subtitle}
                      time={step.time}
                      completed={isStepCompleted}
                      current={isStepCurrent}
                      isLast={index === timelineSteps.length - 1}
                      isRTL={isRTL}
                    />
                  );
                })}
              </View>

              {/* Info Cards */}
              <View style={[styles.infoGrid, isRTL && styles.infoGridRTL]}>
                <View style={styles.infoCard}>
                  <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('reportId')}</Text>
                  <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>#{report.id.substring(0, 8).toUpperCase()}</Text>
                </View>

                {/* Location Card */}
                <TouchableOpacity
                  style={[styles.infoCard, location?.latitude && styles.locationCardActive]}
                  onPress={openMaps}
                  disabled={!location?.latitude}
                  activeOpacity={0.8}
                  accessibilityLabel={t('openGoogleMaps')}
                  accessibilityRole="button"
                >
                  <View style={[styles.locationHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('locationLabel')}</Text>
                      <Text style={[styles.infoValue, location?.latitude && { color: colors.primary }, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                        {location?.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'N/A'}
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

              {/* Completion images */}
              {report.completion_images && report.completion_images.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { marginTop: spacing.md, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                    {t('completionImages')}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {report.completion_images.map((uri: string, i: number) => (
                      <Image key={i} source={{ uri }} style={styles.completionImage} accessibilityLabel={`${t('completionImages')} ${i + 1}`} />
                    ))}
                  </ScrollView>
                </>
              )}
            </>
          )}

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
  backButtonRTL: { alignSelf: 'flex-end' },
  contentCard: {
    flex: 1, marginTop: -24,
    borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md,
    borderWidth: 1, borderColor: colors.borderLight,
    backgroundColor: colors.white,
    padding: spacing.md,
    minHeight: height * 0.65,
  },

  // Work actions card
  actionsCard: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  actionsTitle: {
    fontSize: 13,
    color: colors.primary, marginBottom: spacing.xs,
    textAlign: 'left',
  },
  actionsTitleRTL: { textAlign: 'right' },
  actionsContainer: { gap: spacing.sm },
  actionButtonGreen: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm, // 6px rounded button
    paddingVertical: 12, gap: spacing.sm,
  },
  actionButtonOutline: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius.sm, // 6px rounded button
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 10, gap: spacing.sm,
  },
  actionButtonText: {
    color: '#FFFFFF', fontSize: 14,
  },
  actionButtonTextGreen: {
    color: colors.primary, fontSize: 14,
  },

  // Added images preview
  addedImage: {
    width: 70, height: 70,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: colors.borderLight,
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
  locationCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: 2, fontSize: 10, letterSpacing: 0.3,
    textTransform: 'uppercase', textAlign: 'left',
  },
  infoValue: {
    color: colors.textPrimary, fontSize: 12,
    textAlign: 'left',
  },

  // Google Maps location card
  locationHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
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

  completionImage: {
    width: 100, height: 100,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});

const tlStyles = StyleSheet.create({
  timeline: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.pageBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  itemRTL: {
    flexDirection: 'row-reverse',
  },
  lineColumn: {
    alignItems: 'center',
    width: 24,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dotCompleted: {
    backgroundColor: colors.primary,
  },
  dotCurrent: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.borderLight,
    marginVertical: -2,
    zIndex: 1,
    minHeight: 36,
  },
  lineCompleted: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.sm,
  },
  contentRTL: {
    paddingLeft: 0,
    paddingRight: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'left',
  },
  titleRTL: {
    textAlign: 'right',
  },
  time: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 14,
    textAlign: 'left',
  },
  subtitleRTL: {
    textAlign: 'right',
  },
});
