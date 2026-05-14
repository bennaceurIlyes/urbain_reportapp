import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme, 
  ActivityIndicator,
  Portal,
  Modal,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '../hooks/useAuth';
import { submitReport } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReportSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required').min(10, 'Please provide more details'),
});

export const ReportScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to tag the issue.');
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
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const getLocation = async () => {
    setLocating(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    } catch (error) {
      Alert.alert('Error', 'Could not fetch location.');
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    if (!imageUri) return Alert.alert('Photo Required', 'Please attach a photo of the issue.');
    if (!location) return Alert.alert('Location Required', 'Please tag the location.');

    setSubmitting(true);
    try {
      await submitReport({ ...values, location, imageUri, userId: user!.id, priority: 2 });
      Alert.alert('Report Submitted', 'Thank you for helping improve our city.', [
        { text: 'Done', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#0F172A" />
        </TouchableOpacity>
        <Text variant="titleLarge" style={styles.headerTitle}>New Report</Text>
        <View style={{ width: 44 }} />
      </View>

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
                {/* Media Section */}
                <View style={styles.section}>
                  <Text variant="labelLarge" style={styles.sectionLabel}>Evidence Photo</Text>
                  {imageUri ? (
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                      <TouchableOpacity style={styles.removeBtn} onPress={() => setImageUri(null)}>
                        <MaterialCommunityIcons name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.imageSelectorRow}>
                      <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(true)}>
                        <MaterialCommunityIcons name="camera-outline" size={28} color="#1B4FD8" />
                        <Text variant="labelMedium" style={styles.imageBoxLabel}>Camera</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(false)}>
                        <MaterialCommunityIcons name="image-outline" size={28} color="#1B4FD8" />
                        <Text variant="labelMedium" style={styles.imageBoxLabel}>Gallery</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Form Section */}
                <View style={styles.section}>
                  <Text variant="labelLarge" style={styles.sectionLabel}>Report Details</Text>
                  <View style={styles.inputCard}>
                    <TextInput
                      mode="flat"
                      placeholder="Title (e.g. Broken streetlight)"
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                      value={values.title}
                      style={styles.input}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                    />
                    <View style={styles.separator} />
                    <TextInput
                      mode="flat"
                      placeholder="Tell us what's happening..."
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values.description}
                      multiline
                      style={[styles.input, styles.textArea]}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                    />
                  </View>
                  {(touched.title && errors.title) || (touched.description && errors.description) ? (
                    <Text style={styles.errorText}>Please complete all required fields.</Text>
                  ) : null}
                </View>

                {/* Location Section */}
                <View style={styles.section}>
                  <Text variant="labelLarge" style={styles.sectionLabel}>Location</Text>
                  <TouchableOpacity 
                    style={[styles.locationCard, location && styles.locationCardActive]} 
                    onPress={getLocation}
                    disabled={locating}
                  >
                    <View style={[styles.locIconBg, { backgroundColor: location ? '#1B4FD8' : '#F1F5F9' }]}>
                      <MaterialCommunityIcons 
                        name={location ? "check" : "map-marker-outline"} 
                        size={20} 
                        color={location ? "white" : "#64748B"} 
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text variant="titleSmall" style={styles.locTitle}>
                        {location ? 'Location Tagged' : 'Tag current location'}
                      </Text>
                      <Text variant="bodySmall" style={styles.locSub}>
                        {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : 'Required for field verification'}
                      </Text>
                    </View>
                    {locating && <ActivityIndicator size="small" color="#1B4FD8" />}
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <Button 
                  mode="contained" 
                  onPress={() => handleSubmit()} 
                  loading={isSubmitting}
                  style={styles.submitBtn}
                  contentStyle={styles.submitBtnContent}
                  labelStyle={styles.submitBtnLabel}
                >
                  Submit Report
                </Button>
              </View>
            </KeyboardAvoidingView>

            <Portal>
              <Modal visible={isSubmitting} dismissable={false} contentContainerStyle={styles.modal}>
                <ActivityIndicator size="large" color="#1B4FD8" />
                <Text variant="titleMedium" style={{ marginTop: 20, fontWeight: '700' }}>Sending Report</Text>
                <Text variant="bodyMedium" style={{ color: '#64748B', marginTop: 4 }}>Optimizing and uploading media...</Text>
              </Modal>
            </Portal>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    height: 56,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5, color: '#0F172A' },
  scroll: { padding: 24, paddingBottom: 40 },
  section: { marginBottom: 32 },
  sectionLabel: { color: '#0F172A', fontWeight: '700', marginBottom: 12, letterSpacing: 0.2 },
  imageWrapper: { borderRadius: 20, overflow: 'hidden', height: 240, backgroundColor: '#F1F5F9' },
  imagePreview: { width: '100%', height: '100%' },
  removeBtn: { 
    position: 'absolute', top: 12, right: 12, 
    width: 32, height: 32, borderRadius: 16, 
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' 
  },
  imageSelectorRow: { flexDirection: 'row', gap: 16 },
  imageBox: { 
    flex: 1, height: 100, borderRadius: 20, 
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', 
    justifyContent: 'center', alignItems: 'center' 
  },
  imageBoxLabel: { marginTop: 8, color: '#1B4FD8', fontWeight: '600' },
  inputCard: { 
    backgroundColor: '#FFFFFF', borderRadius: 20, 
    borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' 
  },
  input: { backgroundColor: 'transparent', height: 56, fontSize: 16 },
  textArea: { height: 120, paddingTop: 12 },
  separator: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 8, fontWeight: '500' },
  locationCard: { 
    flexDirection: 'row', alignItems: 'center', 
    padding: 16, borderRadius: 20, 
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' 
  },
  locationCardActive: { borderColor: '#1B4FD8', backgroundColor: '#F8FAFC' },
  locIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  locTitle: { fontWeight: '700', color: '#0F172A' },
  locSub: { color: '#64748B', marginTop: 2 },
  footer: { padding: 24, paddingBottom: Platform.OS === 'ios' ? 8 : 24 },
  submitBtn: { borderRadius: 16, backgroundColor: '#1B4FD8', elevation: 0 },
  submitBtnContent: { height: 56 },
  submitBtnLabel: { fontSize: 16, fontWeight: '700' },
  modal: { 
    backgroundColor: 'white', padding: 40, margin: 40, 
    borderRadius: 32, alignItems: 'center' 
  }
});
