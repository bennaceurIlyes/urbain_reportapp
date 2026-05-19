import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadCompletionImages } from '../services/api';
import { GovHeader } from '../components/GovHeader';
import { colors, spacing, borderRadius, shadows } from '../theme';
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{t('proofOfCompletion')}</Text>
        <Text style={[styles.helperText, isRTL && styles.helperTextRTL]}>{t('proofHelper')}</Text>

        {/* Image grid */}
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.previewImage} accessibilityLabel={`${t('photos')} ${index + 1}`} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                accessibilityLabel={lang === 'ar' ? 'إزالة' : 'Supprimer'}
              >
                <MaterialCommunityIcons name="close" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 6 && (
            <View style={[styles.actionButtons, isRTL && styles.actionButtonsRTL]}>
              <TouchableOpacity style={styles.addBtn} onPress={takePhoto} accessibilityLabel={t('camera')} accessibilityRole="button">
                <MaterialCommunityIcons name="camera-outline" size={28} color={colors.republicGreen} />
                <Text style={styles.addBtnText}>{t('camera')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={pickImage} accessibilityLabel={t('gallery')} accessibilityRole="button">
                <MaterialCommunityIcons name="image-plus" size={28} color={colors.republicGreen} />
                <Text style={styles.addBtnText}>{t('gallery')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Notes */}
        <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>{t('completionNotes')}</Text>
        <TextInput
          mode="outlined"
          placeholder={t('notesPlaceholder')}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          outlineColor={colors.borderLight}
          activeOutlineColor={colors.republicGreen}
          style={[styles.input, isRTL && styles.inputRTL]}
          accessibilityLabel={t('completionNotes')}
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
            <Text style={styles.submitBtnText}>{t('confirmCompletion')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  content: { padding: spacing.lg },
  sectionTitle: {
    fontWeight: '700', color: colors.textPrimary,
    marginBottom: spacing.sm, fontSize: 15, textAlign: 'left',
  },
  sectionTitleRTL: { textAlign: 'right' },
  helperText: {
    color: colors.textSecondary, marginBottom: spacing.lg,
    fontSize: 14, lineHeight: 22, textAlign: 'left',
  },
  helperTextRTL: { textAlign: 'right' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: spacing.xl },
  imageWrapper: {
    width: 100, height: 100, borderRadius: borderRadius.badge, overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeButton: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12, padding: 4,
  },
  actionButtons: { flexDirection: 'row', gap: 12 },
  actionButtonsRTL: { flexDirection: 'row-reverse' },
  addBtn: {
    width: 100, height: 100,
    backgroundColor: colors.cardWhite,
    borderWidth: 1, borderColor: colors.borderLight, borderStyle: 'dashed',
    borderRadius: borderRadius.badge,
    justifyContent: 'center', alignItems: 'center',
    ...shadows.card,
  },
  addBtnText: { marginTop: 8, color: colors.republicGreen, fontSize: 12, fontWeight: '600' },
  input: {
    backgroundColor: colors.cardWhite, marginBottom: spacing.xl,
    textAlign: 'left',
  },
  inputRTL: { textAlign: 'right' },
  submitBtn: {
    borderRadius: borderRadius.button, backgroundColor: colors.republicGreen,
    height: 52, justifyContent: 'center', alignItems: 'center',
    ...shadows.fab,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
