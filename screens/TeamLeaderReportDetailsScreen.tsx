import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar, Alert, Animated, Modal } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors, spacing, radius, toArabicNumeral } from '../theme';
import { StatusBadge } from '../components/StatusBadge';
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
  status: 'done' | 'active' | 'pending';
  isLast: boolean;
  isRTL: boolean;
}> = ({ title, subtitle, time, status, isLast, isRTL }) => {
  // Dot styling based on status:
  // - done: circle, #DCFCE7 bg, #16A34A checkmark
  // - active: circle, #E8F7FC bg, #0D6B9A icon, 2px cyan border #18A6C8
  // - pending: circle, #F1F5F9 bg, #7BA8BF border, 1.5px dashed border #C0EAF5
  const getDotStyle = () => {
    switch (status) {
      case 'done':
        return { backgroundColor: '#DCFCE7', borderColor: '#16A34A', borderWidth: 0 };
      case 'active':
        return { backgroundColor: '#E8F7FC', borderColor: '#18A6C8', borderWidth: 2 };
      case 'pending':
      default:
        return { backgroundColor: '#F1F5F9', borderColor: '#C0EAF5', borderWidth: 1.5, borderStyle: 'dashed' as const };
    }
  };

  const getLineStyle = () => {
    if (status === 'done') {
      return { backgroundColor: '#16A34A', opacity: 0.35 };
    }
    return { backgroundColor: '#C0EAF5', borderStyle: 'dashed' as const }; // pending or active line below is pending
  };

  return (
    <View style={[tlStyles.item, isRTL ? tlStyles.itemRTL : null]}>
      <View style={tlStyles.lineColumn}>
        <View style={[tlStyles.dot, getDotStyle()]}>
          {status === 'done' ? (
            <MaterialCommunityIcons name="check" size={12} color="#16A34A" />
          ) : status === 'active' ? (
            <MaterialCommunityIcons name={isRTL ? 'arrow-left' : 'arrow-right'} size={12} color="#0D6B9A" />
          ) : null}
        </View>
        {!isLast && (
          <View style={[tlStyles.line, getLineStyle()]} />
        )}
      </View>
      <View style={[tlStyles.content, isRTL ? tlStyles.contentRTL : null]}>
        <View style={[tlStyles.header, isRTL ? tlStyles.headerRTL : null]}>
          <Text style={[
            tlStyles.title,
            { 
              fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold',
              color: status === 'pending' ? colors.textDisabled : colors.textPrimary 
            },
            isRTL ? tlStyles.titleRTL : null,
          ]}>
            {title}
          </Text>
          {time && (
            <Text style={[tlStyles.time, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
              {time}
            </Text>
          )}
        </View>
        <Text style={[
          tlStyles.subtitle,
          { 
            fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular',
            color: status === 'pending' ? colors.textDisabled : colors.textSecondary 
          },
          isRTL ? tlStyles.subtitleRTL : null,
        ]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

// Priority helper functions for the top nav badge
const getPriorityBgColor = (priority: number) => {
  if (priority >= 3) return '#FEE2E2'; // High/Emergency (Red bg)
  if (priority === 2) return '#FEF3C7'; // Medium (Amber bg)
  return '#DCFCE7'; // Low (Green bg)
};

const getPriorityTextColor = (priority: number) => {
  if (priority >= 3) return '#DC2626'; // High/Emergency
  if (priority === 2) return '#D97706'; // Medium
  return '#16A34A'; // Low
};

const getPriorityText = (priority: number, lang: string) => {
  if (lang === 'ar') {
    if (priority >= 4) return 'عاجل جداً';
    if (priority === 3) return 'عالي';
    if (priority === 2) return 'متوسط';
    return 'منخفض';
  } else {
    if (priority >= 4) return 'Très Urgent';
    if (priority === 3) return 'Urgent';
    if (priority === 2) return 'Moyen';
    return 'Faible';
  }
};

const getElapsedTime = (createdStr: string, lang: string) => {
  const diff = new Date().getTime() - new Date(createdStr).getTime();
  const days = Math.floor(diff / 86400000);
  
  if (lang === 'ar') {
    if (days <= 0) return 'اليوم';
    if (days === 1) return 'يوم واحد';
    if (days === 2) return 'يومين';
    if (days <= 10) return `${toArabicNumeral(days, 'ar')} أيام`;
    return `${toArabicNumeral(days, 'ar')} يوم`;
  } else {
    if (days <= 0) return "Aujourd'hui";
    if (days === 1) return '1 jour';
    return `${days} jours`;
  }
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

  const navigateToFullMap = () => {
    if (!location?.latitude || !location?.longitude) return;
    navigation.navigate('TeamLeaderMap', {
      report,
      userLocation,
      location,
      navInstruction: navigationInstruction || (lang === 'ar' ? 'اتبع المسار المرسوم' : 'Suivre l\'itinéraire tracé'),
      distanceKm: routeDistance || '—',
      durationMin: routeDuration || '—',
    });
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
 
  // Add Supplementary Photo proof
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
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  };
  const onBtnPressOut = () => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const displayTitle = report.title && report.title.startsWith('cat_') ? t(report.title) : report.title;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2E4A" />

      {/* Section 1 — Sticky Navigation Bar */}
      <View style={[styles.navBar, isRTL && styles.navBarRTL, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel={t('back')}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={[styles.navTitle, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
          {lang === 'ar' ? 'تفاصيل البلاغ' : 'Détails du signalement'}
        </Text>

        <View style={[styles.urgencyBadge, { backgroundColor: getPriorityBgColor(report.priority) }]}>
          <Text style={[styles.urgencyBadgeText, { color: getPriorityTextColor(report.priority), fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
            {getPriorityText(report.priority, lang)}
          </Text>
        </View>
      </View>

      {/* Section 2 — Sticky Interactive Map Preview */}
      <TouchableOpacity 
        style={styles.mapContainer}
        onPress={navigateToFullMap}
        activeOpacity={0.95}
      >
        {location?.latitude ? (
          <MapRouteView 
            startCoords={userLocation} 
            endCoords={location} 
            height={180} 
            onRouteUpdate={handleRouteUpdate}
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        {/* Navigation instruction pill (floating, top-center of map) */}
        {!!routeDistance && !!navigationInstruction && (
          <View style={[styles.navPill, isRTL && styles.navPillRTL]}>
            <View style={styles.navDirectionIconBg}>
              <MaterialCommunityIcons name="navigation" size={16} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
            <View style={styles.navTextContainer}>
              <Text style={[styles.navInstructionText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]} numberOfLines={1}>
                {navigationInstruction}
              </Text>
              <Text style={[styles.navStatsText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                {routeDistance} · {routeDuration || '—'}
              </Text>
            </View>
            <TouchableOpacity onPress={navigateToFullMap} activeOpacity={0.8} style={styles.navCompassBtn}>
              <MaterialCommunityIcons name="compass-outline" size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        )}

        {/* Scale label in bottom-right corner */}
        <View style={styles.scaleLabel}>
          <Text style={styles.scaleLabelText}>Béchar · OSM</Text>
        </View>

        {/* Floating Pulse Evidence Image Bubble */}
        {imageUrl && (
          <TouchableOpacity
            onPress={() => setImageModalVisible(true)}
            style={[styles.floatingImageBubble, isRTL ? { left: spacing.md } : { right: spacing.md }]}
            activeOpacity={0.85}
          >
            <Image source={{ uri: imageUrl }} style={styles.floatingImageThumb} />
            <View style={styles.floatingImageBadge}>
              <MaterialCommunityIcons name="image" size={9} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Section 3 — Sliding Content Card */}
      <ScrollView 
        style={styles.detailsCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.detailsCardContent, { paddingBottom: 60 + insets.bottom }]}
      >
        {/* 3a. Report Header */}
        <View style={[styles.reportHeader, isRTL && styles.reportHeaderRTL]}>
          <View style={styles.titleAndPills}>
            <Text style={[styles.reportTitle, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
              {displayTitle}
            </Text>
            {/* Horizontal chip row below title */}
            <View style={[styles.badgeRow, isRTL && styles.badgeRowRTL]}>
              <StatusBadge status={currentStatus} lang={lang} is_resolved={isResolved} work_in_progress_at={workInProgressAt} />
            </View>
          </View>
          
          <View style={styles.referenceContainer}>
            <Text style={[styles.refIdText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
              #{report.id.substring(0, 8).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* 3b. Action Card (CTA) */}
        <View style={styles.actionCard}>
          <Text style={[styles.actionCardLabel, { fontFamily: isRTL ? 'IBMPlexArabic-Medium' : 'IBMPlexSans-Medium' }]}>
            {lang === 'ar' ? 'إجراءات العمل' : 'PROCÉDURES DE TRAVAIL'}
          </Text>

          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginVertical: 12 }} />
          ) : (
            <View style={styles.actionButtonsContainer}>
              {!workInProgressAt ? (
                <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={handleStartWork}
                    onPressIn={onBtnPressIn}
                    onPressOut={onBtnPressOut}
                    activeOpacity={1}
                    accessibilityLabel={t('startWork')}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.ctaButtonText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                      {lang === 'ar' ? 'بدء العمل الميداني ▶' : 'Débuter le travail terrain ▶'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <View style={{ gap: spacing.sm }}>
                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                      style={styles.ctaButton}
                      onPress={handleMarkCompleted}
                      onPressIn={onBtnPressIn}
                      onPressOut={onBtnPressOut}
                      activeOpacity={1}
                      accessibilityLabel={t('completeReport')}
                      accessibilityRole="button"
                    >
                      <Text style={[styles.ctaButtonText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                        {lang === 'ar' ? 'إتمـام العمل الميداني ✓' : 'Terminer le travail terrain ✓'}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Upload supplementary proof button inside the CTA area */}
                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                      style={styles.ctaUploadButton}
                      onPress={handleAddImage}
                      onPressIn={onBtnPressIn}
                      onPressOut={onBtnPressOut}
                      activeOpacity={1}
                      disabled={imageLoading}
                      accessibilityLabel={t('addImage')}
                      accessibilityRole="button"
                    >
                      {imageLoading ? (
                        <ActivityIndicator size="small" color="#18A6C8" />
                      ) : (
                        <>
                          <MaterialCommunityIcons name="camera-plus-outline" size={16} color="#18A6C8" />
                          <Text style={[styles.ctaUploadButtonText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                            {lang === 'ar' ? 'تحميل إثبات إضافي' : 'Téléverser une preuve'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Added supplementary proof photos row if any exist */}
        {addedImages.length > 0 && (
          <View style={styles.addedPhotosSection}>
            <Text style={[styles.addedPhotosLabel, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
              {lang === 'ar' ? 'الصور الإضافية المرفقة' : 'Photos de preuve additionnelles'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
              {addedImages.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.proofThumb} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 3c. Description Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
            {lang === 'ar' ? 'الوصف' : 'DESCRIPTION'}
          </Text>
          <View style={styles.descriptionBox}>
            <Text style={[styles.descriptionText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
              {report.description || (lang === 'ar' ? 'لا يوجد وصف متوفر.' : 'Aucune description fournie.')}
            </Text>
          </View>
        </View>

        {/* 3d. Follow-up Timeline */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
            {lang === 'ar' ? 'الجدول الزمني للمتابعة' : 'TIMELINE DE SUIVI'}
          </Text>
          
          <View style={tlStyles.timelineContainer}>
            {timelineSteps.map((step, index) => {
              let stepStatus: 'done' | 'active' | 'pending' = 'pending';
              if (index < statusIndex) {
                stepStatus = 'done';
              } else if (index === statusIndex) {
                stepStatus = 'active';
              }

              return (
                <TimelineStep
                  key={index}
                  title={step.title}
                  subtitle={step.subtitle}
                  time={step.time}
                  status={stepStatus}
                  isLast={index === timelineSteps.length - 1}
                  isRTL={isRTL}
                />
              );
            })}
          </View>
        </View>

        {/* 3e. Report Info Grid */}
        <View style={styles.gridDivider} />
        
        <View style={[styles.infoGrid, isRTL && styles.infoGridRTL]}>
          {/* Card 1: رقم البلاغ */}
          <View style={styles.gridCard}>
            <View style={[styles.gridIconChip, isRTL && styles.gridIconChipRTL]}>
              <View style={styles.iconChipInner}>
                <MaterialCommunityIcons name="identifier" size={12} color="#0D6B9A" />
              </View>
              <Text style={[styles.gridLabel, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                {lang === 'ar' ? 'رقم البلاغ' : 'ID SIGNALEMENT'}
              </Text>
            </View>
            <Text style={[styles.gridValue, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]} numberOfLines={1}>
              #{report.id.substring(0, 8).toUpperCase()}
            </Text>
          </View>

          {/* Card 2: الموقع */}
          <TouchableOpacity 
            style={styles.gridCard} 
            onPress={navigateToFullMap}
            activeOpacity={0.8}
          >
            <View style={[styles.gridIconChip, isRTL && styles.gridIconChipRTL]}>
              <View style={styles.iconChipInner}>
                <MaterialCommunityIcons name="map-marker-outline" size={12} color="#0D6B9A" />
              </View>
              <Text style={[styles.gridLabel, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                {lang === 'ar' ? 'الموقع' : 'COORDONNÉES'}
              </Text>
            </View>
            <Text style={[styles.gridValue, { color: '#0D6B9A', fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]} numberOfLines={1}>
              {location?.latitude ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : 'N/A'}
            </Text>
          </TouchableOpacity>

          {/* Card 3: تاريخ الإسناد */}
          <View style={styles.gridCard}>
            <View style={[styles.gridIconChip, isRTL && styles.gridIconChipRTL]}>
              <View style={styles.iconChipInner}>
                <MaterialCommunityIcons name="calendar-range" size={12} color="#0D6B9A" />
              </View>
              <Text style={[styles.gridLabel, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                {lang === 'ar' ? 'تاريخ الإسناد' : 'DATE ASSIGNÉE'}
              </Text>
            </View>
            <Text style={[styles.gridValue, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]} numberOfLines={1}>
              {report.assigned_to_at ? new Date(report.assigned_to_at).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ') : '—'}
            </Text>
          </View>

          {/* Card 4: المدة المنقضية */}
          <View style={styles.gridCard}>
            <View style={[styles.gridIconChip, isRTL && styles.gridIconChipRTL]}>
              <View style={styles.iconChipInner}>
                <MaterialCommunityIcons name="clock-outline" size={12} color="#0D6B9A" />
              </View>
              <Text style={[styles.gridLabel, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                {lang === 'ar' ? 'المدة المنقضية' : 'DURÉE ÉCOULÉE'}
              </Text>
            </View>
            <Text style={[styles.gridValue, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]} numberOfLines={1}>
              {getElapsedTime(report.created_at, lang)}
            </Text>
          </View>
        </View>

        {/* Completion photos if resolved */}
        {isResolved && Array.isArray(report.completion_images) && report.completion_images.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeading, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
              {lang === 'ar' ? 'صور إتمام العمل' : 'PHOTOS DE RÉSOLUTION'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
              {report.completion_images.map((uri: string, i: number) => (
                <Image key={i} source={{ uri }} style={styles.completionImageThumb} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

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

      {/* Interactive Full-Screen Map Zoom Modal removed, replaced with dedicated Stack Screen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0A2E4A' 
  },
  
  // Section 1 — Sticky Navigation Bar
  navBar: {
    height: 60,
    backgroundColor: '#0A2E4A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  navBarRTL: {
    flexDirection: 'row-reverse',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Section 2 — Interactive Map Container
  mapContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F0F9FF',
  },
  mapPlaceholder: {
    height: 180,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Navigation Pill Floating HUD
  navPill: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.md,
    right: spacing.md,
    height: 48,
    backgroundColor: 'rgba(10, 46, 74, 0.92)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 99,
  },
  navPillRTL: {
    flexDirection: 'row-reverse',
  },
  navDirectionIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#18A6C8', // Electric Cyan
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextContainer: {
    flex: 1,
    marginHorizontal: spacing.sm,
    alignItems: 'flex-start',
  },
  navInstructionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  navStatsText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    marginTop: 1,
  },
  navCompassBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleLabel: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 10,
  },
  scaleLabelText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#0A2E4A',
  },
  floatingImageBubble: {
    position: 'absolute',
    bottom: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#F0F9FF',
    zIndex: 99,
  },
  floatingImageThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  floatingImageBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0D6B9A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  // Section 3 — Sliding Card scrollable details
  detailsCard: {
    flex: 1,
    marginTop: -14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  detailsCardContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  
  // 3a. Report Header
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  reportHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  titleAndPills: {
    flex: 1,
    alignItems: 'flex-start',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A2E4A',
    marginBottom: 6,
    textAlign: 'left',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeRowRTL: {
    flexDirection: 'row-reverse',
  },
  referenceContainer: {
    paddingLeft: spacing.sm,
    alignItems: 'flex-end',
  },
  refIdText: {
    fontSize: 11,
    color: '#7BA8BF',
    letterSpacing: 0.5,
  },

  // 3b. Action Card CTA
  actionCard: {
    backgroundColor: '#0A2E4A',
    borderRadius: 16,
    padding: 16,
    marginBottom: spacing.md,
  },
  actionCardLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.55)',
    letterSpacing: 0.8,
    marginBottom: 10,
    textAlign: 'left',
  },
  actionButtonsContainer: {
    width: '100%',
  },
  ctaButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#18A6C8', // Electric Cyan bg
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  ctaUploadButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#18A6C8',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  ctaUploadButtonText: {
    color: '#18A6C8',
    fontSize: 13,
    fontWeight: '700',
  },
  
  // Supplementary photo grid
  addedPhotosSection: {
    marginBottom: spacing.md,
  },
  addedPhotosLabel: {
    fontSize: 11,
    color: '#3A6B85',
    fontWeight: '700',
    textAlign: 'left',
  },
  proofThumb: {
    width: 66,
    height: 66,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#C0EAF5',
    backgroundColor: '#F0F9FF',
  },

  // 3c. Description Box
  sectionContainer: {
    marginBottom: spacing.md,
  },
  sectionHeading: {
    fontSize: 11,
    color: '#7BA8BF',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    textAlign: 'left',
  },
  descriptionBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C0EAF5',
  },
  descriptionText: {
    fontSize: 13,
    color: '#3A6B85',
    lineHeight: 20,
    textAlign: 'left',
  },
  
  // 3e. Meta Grid
  gridDivider: {
    height: 1,
    backgroundColor: '#C0EAF5',
    marginVertical: spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoGridRTL: {
    flexDirection: 'row-reverse',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#C0EAF5',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  gridIconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gridIconChipRTL: {
    flexDirection: 'row-reverse',
  },
  iconChipInner: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#E8F7FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: {
    fontSize: 10,
    color: '#7BA8BF',
    fontWeight: '600',
  },
  gridValue: {
    fontSize: 12,
    color: '#0A2E4A',
    fontWeight: '700',
    textAlign: 'left',
  },
  completionImageThumb: {
    width: 90,
    height: 90,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#C0EAF5',
  },

  // Modals
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  highResImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
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
    borderBottomColor: '#C0EAF5',
    backgroundColor: '#FFFFFF',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  modalHeaderTitle: {
    fontSize: 15,
    color: '#0A2E4A',
    fontWeight: '700',
  },
});

const tlStyles = StyleSheet.create({
  timelineContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C0EAF5',
  },
  item: {
    flexDirection: 'row',
  },
  itemRTL: {
    flexDirection: 'row-reverse',
  },
  lineColumn: {
    alignItems: 'center',
    width: 24,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: -2,
    zIndex: 1,
    minHeight: 40,
  },
  content: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.md,
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
    textAlign: 'left',
  },
  titleRTL: {
    textAlign: 'right',
  },
  time: {
    fontSize: 10,
    color: '#7BA8BF',
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'left',
  },
  subtitleRTL: {
    textAlign: 'right',
  },
});
