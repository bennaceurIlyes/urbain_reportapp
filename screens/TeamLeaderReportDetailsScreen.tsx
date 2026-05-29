import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar, Alert, Linking, Animated, Modal } from 'react-native';
import { Text, Divider, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors, spacing, radius, shadows, toArabicNumeral, borderRadius } from '../theme';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { useLanguage } from '../hooks/useLanguage';
import { updateReportStatus, addImageToReport } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapRouteView } from '../components/MapRouteView';

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
        <View style={[
          tlStyles.dot,
          completed ? tlStyles.dotCompleted : null,
          current ? tlStyles.dotCurrent : null,
        ]}>
          {completed ? <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" /> : null}
        </View>
        {!isLast ? (
          <View style={[
            tlStyles.line,
            completed ? tlStyles.lineCompleted : null,
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
          {time ? (
            <Text style={[tlStyles.time, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
              {time}
            </Text>
          ) : null}
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

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // Active navigation HUD states
  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [routeDuration, setRouteDuration] = useState<string | null>(null);
  const [navigationInstruction, setNavigationInstruction] = useState<string | null>(null);

  const handleRouteUpdate = (distance: number, duration: number, instructions: any[]) => {
    const distStr = distance >= 1000 
      ? `${(distance / 1000).toFixed(1)} km` 
      : `${Math.round(distance)} m`;
    
    const durStr = duration >= 3600
      ? `${Math.floor(duration / 3600)} h ${Math.round((duration % 3600) / 60)} min`
      : `${Math.round(duration / 60)} min`;

    setRouteDistance(distStr);
    setRouteDuration(durStr);

    if (instructions && instructions.length > 0) {
      const firstStep = instructions[0];
      const stepDist = firstStep.distance;
      const stepDistStr = stepDist >= 1000
        ? `${(stepDist / 1000).toFixed(1)} km`
        : `${Math.round(stepDist)} m`;
      
      const getManeuverText = (type?: string, modifier?: string) => {
        if (lang === 'ar') {
          if (type === 'depart') return 'ابدأ السير';
          if (type === 'arrive') return 'الوصول إلى الوجهة';
          
          if (type === 'turn') {
            if (modifier === 'left') return 'انعطف يسارًا';
            if (modifier === 'right') return 'انعطف يمينًا';
            if (modifier === 'sharp left') return 'انعطف يسارًا حادًا';
            if (modifier === 'sharp right') return 'انعطف يمينًا حادًا';
            if (modifier === 'slight left') return 'انحرف قليلاً نحو اليسار';
            if (modifier === 'slight right') return 'انحرف قليلاً نحو اليمين';
            if (modifier === 'straight') return 'تابع مباشرة';
            if (modifier === 'uturn') return 'دور وانعطف للخلف';
          }
          if (type === 'roundabout') return 'ادخل الدوار';
          if (type === 'exit roundabout') return 'اخرج من الدوار';
          
          if (modifier === 'left') return 'اتجه يسارًا';
          if (modifier === 'right') return 'اتجه يمينًا';
          return 'اتبع المسار المرسوم';
        } else {
          if (type === 'depart') return 'Commencer le trajet';
          if (type === 'arrive') return 'Arrivée à destination';
          
          if (type === 'turn') {
            if (modifier === 'left') return 'Tourner à gauche';
            if (modifier === 'right') return 'Tourner à droite';
            if (modifier === 'sharp left') return 'Tourner franchement à gauche';
            if (modifier === 'sharp right') return 'Tourner franchement à droite';
            if (modifier === 'slight left') return 'Bifurquer légèrement à gauche';
            if (modifier === 'slight right') return 'Bifurquer légèrement à droite';
            if (modifier === 'straight') return 'Continuer tout droit';
            if (modifier === 'uturn') return 'Faire demi-tour';
          }
          if (type === 'roundabout') return 'Entrer dans le rond-point';
          if (type === 'exit roundabout') return 'Sortir du rond-point';
          
          if (modifier === 'left') return 'Aller à gauche';
          if (modifier === 'right') return 'Aller à droite';
          return 'Suivre l\'itinéraire tracé';
        }
      };

      const rawInstruction = firstStep.instruction;
      const baseInstruction = (rawInstruction && !rawInstruction.startsWith('undefined'))
        ? rawInstruction
        : getManeuverText(firstStep.type, firstStep.modifier);
      
      let instructionText = baseInstruction;
      if (stepDist > 0) {
        if (lang === 'ar') {
          instructionText = `${baseInstruction} بعد ${stepDistStr}`;
        } else {
          instructionText = `${baseInstruction} dans ${stepDistStr}`;
        }
      }
      setNavigationInstruction(instructionText);
    } else {
      setNavigationInstruction(lang === 'ar' ? 'اتبع المسار المرسوم' : 'Suivre l\'itinéraire tracé');
    }
  };

  React.useEffect(() => {
    (async () => {
      setLocatingUser(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      } catch (error) {
        console.warn("Could not get location on load:", error);
      } finally {
        setLocatingUser(false);
      }
    })();
  }, []);
 
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
    setModalVisible(true);
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
      <StatusBar barStyle="dark-content" />

      {/* Full-Screen Interactive Background Map */}
      <View style={StyleSheet.absoluteFillObject}>
        {location?.latitude ? (
          <MapRouteView 
            startCoords={userLocation} 
            endCoords={location} 
            height={Dimensions.get('window').height} 
            onRouteUpdate={handleRouteUpdate}
          />
        ) : null}
      </View>

      {/* Floating Glassmorphic Header Controls */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top + spacing.xs, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.floatingBackButton}
          accessibilityLabel={t('back')}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name={isRTL ? 'chevron-right' : 'chevron-left'} size={26} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Floating Pulse Evidence Image Bubble */}
        {imageUrl ? (
          <TouchableOpacity
            onPress={() => setImageModalVisible(true)}
            style={styles.floatingImageBubble}
            activeOpacity={0.85}
          >
            <Image source={{ uri: imageUrl }} style={styles.floatingImageThumb} />
            <View style={styles.floatingImageBadge}>
              <MaterialCommunityIcons name="image" size={10} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Floating Active Navigation HUD */}
      {!!routeDistance && !!navigationInstruction ? (
        <View style={[styles.navHudContainer, { top: insets.top + spacing.xl + 12, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.navHudIconBg}>
            <MaterialCommunityIcons name="navigation" size={20} color="#FFFFFF" />
          </View>
          <View style={[{ flex: 1, marginHorizontal: spacing.sm }, isRTL ? { alignItems: 'flex-end' } : null]}>
            <Text style={[styles.navHudInstruction, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]} numberOfLines={2}>
              {navigationInstruction}
            </Text>
            <Text style={[styles.navHudStats, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
              {routeDistance} • {routeDuration || '—'}
            </Text>
          </View>
          <View style={styles.navHudRadarBg}>
            <View style={styles.navHudRadarPulse} />
            <MaterialCommunityIcons name="compass-outline" size={16} color="rgba(255,255,255,0.7)" />
          </View>
        </View>
      ) : null}

      {/* Sliding Glassmorphic Details Sheet */}
      <View 
        style={[
          styles.sheetContainer, 
          { height: sheetExpanded ? height * 0.58 : height * 0.18 }
        ]}
      >
        {/* Toggle / Drag Handle */}
        <TouchableOpacity
          style={styles.sheetHandleContainer}
          onPress={() => setSheetExpanded(!sheetExpanded)}
          activeOpacity={0.8}
        >
          <View style={styles.sheetHandle} />
        </TouchableOpacity>

        {/* Status + Title Header Bar (Always visible) */}
        <View style={{ marginBottom: spacing.xs }}>
          <View style={[styles.badgeRow, isRTL && styles.badgeRowRTL, { marginBottom: spacing.xs }]}>
            <StatusBadge status={currentStatus} lang={lang} is_resolved={isResolved} work_in_progress_at={workInProgressAt} />
            <PriorityBadge priority={report.priority} lang={lang} />
          </View>
          
          <TouchableOpacity 
            onPress={() => setSheetExpanded(!sheetExpanded)}
            activeOpacity={0.9}
          >
            <Text 
              style={[
                styles.title, 
                isRTL && styles.titleRTL, 
                { fontSize: 18, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold', marginBottom: 2 }
              ]} 
              numberOfLines={1}
            >
              {displayTitle}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expanded Content ScrollView */}
        {sheetExpanded ? (
          <ScrollView 
            style={styles.sheetScroll} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {isResolved ? (
              <>
                <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold', marginTop: spacing.xs }]}>{t('description')}</Text>
                <Text style={[styles.description, isRTL && styles.descriptionRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{report.description}</Text>

                {/* Timeline Section */}
                <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { marginTop: spacing.xs, marginBottom: spacing.xs, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
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

                {/* Location Card Info (Route is already in background) */}
                <View style={[styles.infoCard, { width: '100%', marginHorizontal: 0, marginTop: spacing.xs, backgroundColor: colors.pageBg }]}>
                  <View style={[styles.locationHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('locationLabel')}</Text>
                      <Text style={[styles.infoValue, { color: colors.primary }, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                        {location?.latitude ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.googleMapsButton}>
                      <MaterialCommunityIcons name="map-marker-distance" size={20} color={colors.primary} />
                    </View>
                  </View>
                </View>

                {/* Completion images */}
                {Array.isArray(report.completion_images) && report.completion_images.length > 0 ? (
                  <>
                    <Text style={[styles.sectionTitle, isRTL ? styles.sectionTitleRTL : null, { marginTop: spacing.md, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('completionImages')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
                      {report.completion_images.map((uri: string, i: number) => (
                        <Image key={i} source={{ uri }} style={styles.completionImage} accessibilityLabel={`${t('completionImages')} ${i + 1}`} />
                      ))}
                    </ScrollView>
                  </>
                ) : null}
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
                {addedImages.length > 0 ? (
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
                ) : null}

                {/* Details */}
                <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold', marginTop: spacing.sm }]}>{t('description')}</Text>
                <Text style={[styles.description, isRTL && styles.descriptionRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{report.description}</Text>

                {/* Timeline Section */}
                <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { marginTop: spacing.xs, marginBottom: spacing.xs, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
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

                {/* Meta */}
                <View style={[styles.metaRow, isRTL && styles.metaRowRTL, { marginBottom: spacing.sm }]}>
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

                {/* Info Card Grid */}
                <View style={[styles.infoGrid, isRTL && styles.infoGridRTL, { marginBottom: spacing.sm }]}>
                  <View style={styles.infoCard}>
                    <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('reportId')}</Text>
                    <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>#{report.id.substring(0, 8).toUpperCase()}</Text>
                  </View>

                  <View style={[styles.infoCard, { backgroundColor: colors.pageBg }]}>
                    <View style={[styles.locationHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('locationLabel')}</Text>
                        <Text style={[styles.infoValue, { color: colors.primary }, isRTL && { textAlign: 'right' }, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                          {location?.latitude ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.googleMapsButton}>
                        <MaterialCommunityIcons name="map-marker-distance" size={20} color={colors.primary} />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Completion images */}
                {Array.isArray(report.completion_images) && report.completion_images.length > 0 ? (
                  <>
                    <Text style={[styles.sectionTitle, isRTL ? styles.sectionTitleRTL : null, { marginTop: spacing.md, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                      {t('completionImages')}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {report.completion_images.map((uri: string, i: number) => (
                        <Image key={i} source={{ uri }} style={styles.completionImage} accessibilityLabel={`${t('completionImages')} ${i + 1}`} />
                      ))}
                    </ScrollView>
                  </>
                ) : null}
              </>
            )}
          </ScrollView>
        ) : null}
      </View>

      {/* High-res Evidence Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.imageModalOverlay}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}
        >
          <TouchableOpacity
            onPress={() => setImageModalVisible(false)}
            style={styles.imageModalClose}
            accessibilityLabel={t('closeMap')}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.highResImage} />
          ) : null}
        </TouchableOpacity>
      </Modal>

      {/* Interactive Full-Screen Map Zoom Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + spacing.sm, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
              accessibilityLabel={t('closeMap')}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.modalHeaderTitle, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
              {t('viewRoute')}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          <View style={{ flex: 1 }}>
            {location?.latitude ? (
              <MapRouteView startCoords={userLocation} endCoords={location} height={Dimensions.get('window').height - (insets.top + 70)} />
            ) : null}
          </View>
        </View>
      </Modal>
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
    borderRadius: borderRadius.button, // 16px fully rounded-2xl style
    height: 52, // Large touch-friendly height
    gap: spacing.sm,
    ...shadows.elevated,
  },
  actionButtonOutline: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: borderRadius.button, // 16px fully rounded-2xl style
    borderWidth: 1.5,
    borderColor: colors.primary,
    height: 52, // Large touch-friendly height
    gap: spacing.sm,
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
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md, // 16px fully rounded-2xl style
    backgroundColor: colors.white, // clean white background
    borderWidth: 1,
    borderColor: '#E2E8F0', // clean minimalist border
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  locationCardActive: {
    borderColor: '#BFDBFE',
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
    width: 36, height: 36,
    borderRadius: 18, // circular background
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1.5,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: '#FFFFFF',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pageBg,
  },
  modalHeaderTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingImageBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#F0F4F8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  floatingImageThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
  },
  floatingImageBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 24,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  sheetHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#cbd5e1',
  },
  sheetScroll: {
    flex: 1,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  highResImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  navHudContainer: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 90,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  navHudIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHudInstruction: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'left',
  },
  navHudStats: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'left',
  },
  navHudRadarBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  navHudRadarPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.5)',
    transform: [{ scale: 1.2 }],
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
