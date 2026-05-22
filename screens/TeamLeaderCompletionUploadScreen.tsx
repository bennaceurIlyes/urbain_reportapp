import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadCompletionImages } from '../services/api';
import { GovHeader } from '../components/GovHeader';
import { colors, spacing, radius } from '../theme';
import { useLanguage } from '../hooks/useLanguage';

export const TeamLeaderCompletionUploadScreen = ({ route, navigation }: any) => {
  const { report, onComplete } = route.params;
  const { t, lang, isRTL } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(t('error'), lang === 'ar' ? 'يرجى تفعيل صلاحية الوصول إلى الصور في الإعدادات' : 'Veuillez activer la permission de galerie dans les paramètres');
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.5,
      });
      if (!result.canceled) {
        const selectedUris = result.assets.map(asset => asset.uri);
        setImages([...images, ...selectedUris].slice(0, 6));
      }
    } catch (error) {
      console.error('Gallery picker error:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(t('error'), lang === 'ar' ? 'يرجى تفعيل صلاحية الكاميرا في الإعدادات' : 'Veuillez activer la permission de caméra dans les paramètres');
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.5,
      });
      if (!result.canceled) {
        setImages([...images, result.assets[0].uri].slice(0, 6));
      }
    } catch (error) {
      console.error('Camera capture error:', error);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert(t('imagesRequired'), t('pleaseUploadImage'));
      return;
    }

    setUploading(true);
    try {
      await uploadCompletionImages(report.id, images);
      if (onComplete) onComplete();
      Alert.alert(t('success'), t('reportCompleted'));
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GovHeader
        title={t('uploadProof')}
        subtitle={t('proofOfCompletion')}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('proofOfCompletion')}</Text>
        <Text style={[styles.helperText, isRTL && styles.helperTextRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{t('proofHelper')}</Text>

        {/* Image grid */}
        <View style={[styles.imageGrid, isRTL && styles.imageGridRTL]}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.previewImage} accessibilityLabel={`${t('photos')} ${index + 1}`} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                accessibilityLabel={lang === 'ar' ? 'إزالة' : 'Supprimer'}
              >
                <MaterialCommunityIcons name="close" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 6 && (
            <View style={[styles.actionButtons, isRTL && styles.actionButtonsRTL]}>
              <TouchableOpacity style={styles.addBtn} onPress={takePhoto} accessibilityLabel={t('camera')} accessibilityRole="button" activeOpacity={0.8}>
                <MaterialCommunityIcons name="camera-outline" size={24} color={colors.primary} />
                <Text style={[styles.addBtnText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('camera')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={pickImage} accessibilityLabel={t('gallery')} accessibilityRole="button" activeOpacity={0.8}>
                <MaterialCommunityIcons name="image-plus" size={24} color={colors.primary} />
                <Text style={[styles.addBtnText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('gallery')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Notes */}
        <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('completionNotes')}</Text>
        <TextInput
          mode="outlined"
          placeholder={t('notesPlaceholder')}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          outlineColor={colors.borderLight}
          activeOutlineColor={colors.primary}
          style={[styles.input, isRTL && styles.inputRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}
          accessibilityLabel={t('completionNotes')}
          theme={{ roundness: radius.sm }} // 6px rounded shapes for form elements
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, (uploading || images.length === 0) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={uploading || images.length === 0}
          accessibilityLabel={t('confirmCompletion')}
          accessibilityRole="button"
          activeOpacity={0.85}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={[styles.submitBtnText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('confirmCompletion')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pageBg },
  content: { padding: spacing.md },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.xs, fontSize: 14, textAlign: 'left',
  },
  sectionTitleRTL: { textAlign: 'right' },
  helperText: {
    color: colors.textSecondary, marginBottom: spacing.md,
    fontSize: 13, lineHeight: 20, textAlign: 'left',
  },
  helperTextRTL: { textAlign: 'right' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing.md },
  imageGridRTL: { flexDirection: 'row-reverse' },
  imageWrapper: {
    width: 80, height: 80, borderRadius: radius.sm, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.borderLight,
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeButton: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10, padding: 3,
  },
  actionButtons: { flexDirection: 'row', gap: 10 },
  actionButtonsRTL: { flexDirection: 'row-reverse' },
  addBtn: {
    width: 80, height: 80,
    backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.borderLight, borderStyle: 'dashed',
    borderRadius: radius.sm, // 6px rounded form shapes
    justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { marginTop: 4, color: colors.primary, fontSize: 11 },
  input: {
    backgroundColor: colors.white, marginBottom: spacing.lg,
    fontSize: 13,
    textAlign: 'left',
  },
  inputRTL: { textAlign: 'right' },
  submitBtn: {
    borderRadius: radius.sm, // 6px rounded square button
    backgroundColor: colors.primary,
    height: 48, justifyContent: 'center', alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontSize: 15, color: colors.textOnBlue },
});
