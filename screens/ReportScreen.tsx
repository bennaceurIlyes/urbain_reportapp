import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Text, ActivityIndicator, Portal, Modal } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '../hooks/useAuth';
import { submitReport } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GovHeader } from '../components/GovHeader';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { useLanguage } from '../hooks/useLanguage';

export const ReportScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t, lang, isRTL } = useLanguage();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(2);

  const ReportSchema = Yup.object().shape({
    title: Yup.string().required(t('titleRequired')),
    description: Yup.string().required(t('descriptionRequired')).min(10, t('descriptionMin')),
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('error'), t('locationRequired'));
      }
    })();
  }, []);

  const pickImage = async (useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.status !== 'granted') return;
        result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') return;
        result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
      }
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      Alert.alert(t('error'), t('errorSubtext'));
    }
  };

  const getLocation = async () => {
    setLocating(true);
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (error) {
      Alert.alert(t('error'), t('locationRequired'));
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    if (!imageUri) return Alert.alert(t('photoRequired'), t('pleaseAttachPhoto'));
    if (!location) return Alert.alert(t('locationRequired'), t('pleaseTagLocation'));

    setSubmitting(true);
    try {
      await submitReport({ ...values, location, imageUri, userId: user!.id, priority: selectedPriority });
      Alert.alert(t('reportSubmitted'), t('thankYou'), [
        { text: t('done'), onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('errorSubtext'));
    } finally {
      setSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 1, label: t('priorityLow'), color: colors.priority.low },
    { value: 2, label: t('priorityMedium'), color: colors.priority.medium },
    { value: 3, label: t('priorityHigh'), color: colors.priority.high },
  ];

  return (
    <View style={styles.container}>
      <GovHeader
        title={t('newReport')}
        subtitle={t('submitReport')}
        showBack
        onBack={() => navigation.goBack()}
      />

      <Formik
        initialValues={{ title: '', description: '' }}
        validationSchema={ReportSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* ─── Section 1: Report Info ─── */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, isRTL && styles.sectionLabelRTL]}>{t('reportInfo')}</Text>
                  <View style={styles.inputCard}>
                    <TextInput
                      mode="flat"
                      placeholder={t('titlePlaceholder')}
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                      value={values.title}
                      style={[styles.input, isRTL && styles.inputRTL]}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      accessibilityLabel={t('title')}
                    />
                    <View style={styles.separator} />
                    <TextInput
                      mode="flat"
                      placeholder={t('descPlaceholder')}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values.description}
                      multiline
                      style={[styles.input, styles.textArea, isRTL && styles.inputRTL]}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      accessibilityLabel={t('description')}
                    />
                  </View>
                  {(touched.title && errors.title) || (touched.description && errors.description) ? (
                    <Text style={styles.errorText}>{t('completeFields')}</Text>
                  ) : null}

                  {/* Priority selector */}
                  <View style={[styles.priorityRow, isRTL && styles.priorityRowRTL]}>
                    {priorityOptions.map(opt => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.priorityPill,
                          selectedPriority === opt.value && { backgroundColor: opt.color + '18', borderColor: opt.color },
                        ]}
                        onPress={() => setSelectedPriority(opt.value)}
                        accessibilityLabel={opt.label}
                        accessibilityRole="button"
                      >
                        <View style={[styles.priorityDot, { backgroundColor: opt.color }]} />
                        <Text style={[styles.priorityLabel, selectedPriority === opt.value && { color: opt.color, fontWeight: '700' }]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* ─── Section 2: Photos ─── */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, isRTL && styles.sectionLabelRTL]}>{t('photos')}</Text>
                  {imageUri ? (
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: imageUri }} style={styles.imagePreview} accessibilityLabel={t('evidencePhoto')} />
                      <TouchableOpacity style={styles.removeBtn} onPress={() => setImageUri(null)} accessibilityLabel={lang === 'ar' ? 'إزالة الصورة' : 'Supprimer la photo'}>
                        <MaterialCommunityIcons name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={[styles.imageSelectorRow, isRTL && styles.imageSelectorRowRTL]}>
                      <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(true)} accessibilityLabel={t('camera')} accessibilityRole="button">
                        <MaterialCommunityIcons name="camera-outline" size={28} color={colors.republicGreen} />
                        <Text style={styles.imageBoxLabel}>{t('camera')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(false)} accessibilityLabel={t('gallery')} accessibilityRole="button">
                        <MaterialCommunityIcons name="image-outline" size={28} color={colors.republicGreen} />
                        <Text style={styles.imageBoxLabel}>{t('gallery')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* ─── Section 3: Location ─── */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, isRTL && styles.sectionLabelRTL]}>{t('location')}</Text>
                  <TouchableOpacity
                    style={[styles.locationCard, location && styles.locationCardActive]}
                    onPress={getLocation}
                    disabled={locating}
                    accessibilityLabel={t('useMyLocation')}
                    accessibilityRole="button"
                  >
                    <View style={[styles.locIconBg, { backgroundColor: location ? colors.republicGreen : colors.offWhite }]}>
                      <MaterialCommunityIcons
                        name={location ? 'check' : 'map-marker-outline'}
                        size={20}
                        color={location ? 'white' : colors.textMuted}
                      />
                    </View>
                    <View style={[{ flex: 1, marginLeft: 12 }, isRTL && { marginLeft: 0, marginRight: 12 }]}>
                      <Text style={[styles.locTitle, isRTL && styles.locTitleRTL]}>
                        {location ? t('locationTagged') : t('tagLocation')}
                      </Text>
                      <Text style={[styles.locSub, isRTL && styles.locSubRTL]}>
                        {location
                          ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                          : t('requiredField')}
                      </Text>
                    </View>
                    {locating && <ActivityIndicator size="small" color={colors.republicGreen} />}
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Submit Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                  accessibilityLabel={t('submitReport')}
                  accessibilityRole="button"
                  activeOpacity={0.85}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>{t('submitReport')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>

            {/* Submitting modal */}
            <Portal>
              <Modal visible={isSubmitting} dismissable={false} contentContainerStyle={styles.modal}>
                <ActivityIndicator size="large" color={colors.republicGreen} />
                <Text style={styles.modalTitle}>{t('sendingReport')}</Text>
                <Text style={styles.modalSubtext}>{t('optimizingMedia')}</Text>
              </Modal>
            </Portal>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  section: { marginBottom: spacing.xl },
  sectionLabel: {
    color: colors.textPrimary, fontWeight: '700', marginBottom: spacing.sm,
    fontSize: 15, letterSpacing: 0.2, textAlign: 'left',
  },
  sectionLabelRTL: { textAlign: 'right' },
  inputCard: {
    backgroundColor: colors.cardWhite, borderRadius: borderRadius.card,
    borderWidth: 1, borderColor: colors.borderLight, overflow: 'hidden',
    ...shadows.card,
  },
  input: {
    backgroundColor: 'transparent', height: 52, fontSize: 16,
    textAlign: 'left',
  },
  inputRTL: { textAlign: 'right' },
  textArea: { height: 120, paddingTop: 12 },
  separator: { height: 1, backgroundColor: colors.borderLight, marginHorizontal: spacing.md },
  errorText: { color: colors.error, fontSize: 12, marginTop: spacing.sm, fontWeight: '500' },

  // Priority
  priorityRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  priorityRowRTL: { flexDirection: 'row-reverse' },
  priorityPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: borderRadius.button,
    backgroundColor: colors.cardWhite, borderWidth: 1.5, borderColor: colors.borderLight,
    gap: 6,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityLabel: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },

  // Image
  imageWrapper: { borderRadius: borderRadius.card, overflow: 'hidden', height: 200, backgroundColor: colors.offWhite },
  imagePreview: { width: '100%', height: '100%' },
  removeBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  imageSelectorRow: { flexDirection: 'row', gap: spacing.md },
  imageSelectorRowRTL: { flexDirection: 'row-reverse' },
  imageBox: {
    flex: 1, height: 100, borderRadius: borderRadius.card,
    backgroundColor: colors.cardWhite, borderWidth: 1, borderColor: colors.borderLight,
    justifyContent: 'center', alignItems: 'center',
    ...shadows.card,
  },
  imageBoxLabel: { marginTop: 8, color: colors.republicGreen, fontWeight: '600', fontSize: 13 },

  // Location
  locationCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, borderRadius: borderRadius.card,
    backgroundColor: colors.cardWhite, borderWidth: 1, borderColor: colors.borderLight,
    ...shadows.card,
  },
  locationCardActive: { borderColor: colors.republicGreen, backgroundColor: colors.surfaceGreen },
  locIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  locTitle: { fontWeight: '700', color: colors.textPrimary, fontSize: 14, textAlign: 'left' },
  locTitleRTL: { textAlign: 'right' },
  locSub: { color: colors.textMuted, marginTop: 2, fontSize: 12, textAlign: 'left' },
  locSubRTL: { textAlign: 'right' },

  // Footer
  footer: { padding: spacing.lg, paddingBottom: Platform.OS === 'ios' ? spacing.sm : spacing.lg },
  submitBtn: {
    borderRadius: borderRadius.button, backgroundColor: colors.republicGreen,
    height: 52, justifyContent: 'center', alignItems: 'center',
    ...shadows.fab,
  },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  // Modal
  modal: {
    backgroundColor: 'white', padding: 40, margin: 40,
    borderRadius: 24, alignItems: 'center',
  },
  modalTitle: { marginTop: 20, fontWeight: '700', fontSize: 16, color: colors.textPrimary },
  modalSubtext: { color: colors.textMuted, marginTop: 4, fontSize: 14 },
});
