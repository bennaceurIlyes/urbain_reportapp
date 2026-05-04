import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Icon,
  ChevronLeftIcon,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input as GInput,
  InputField,
  Textarea,
  TextareaInput,
  Center
} from '@gluestack-ui/themed';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { submitReport } from '../services/api';
import { Camera, Image as ImageIcon, MapPin, Send, Trash2, X } from 'lucide-react-native';

const { height } = Dimensions.get('window');

const ReportSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required').min(10, 'Please provide more details'),
});

export const ReportScreen = ({ navigation }: any) => {
  const { user } = useAuth();
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
        if (permission.status !== 'granted') {
          Alert.alert('Permission denied', 'Camera permission is required.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.7,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
          Alert.alert('Permission denied', 'Gallery permission is required.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.7,
        });
      }

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const getLocation = async () => {
    setLocating(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not fetch location. Ensure GPS is enabled.');
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    if (!imageUri) {
      Alert.alert('Missing Image', 'Please attach a photo of the issue.');
      return;
    }
    if (!location) {
      Alert.alert('Missing Location', 'Please tag the location.');
      return;
    }

    setSubmitting(true);
    try {
      await submitReport({
        ...values,
        location,
        imageUri,
        userId: user!.id,
      });
      Alert.alert('Success', 'Report submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Box style={styles.headerWrapper}>
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <HStack alignItems="center" px="$4" pt={Platform.OS === 'ios' ? 70 : 40} pb="$3">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon as={ChevronLeftIcon} size="xl" color="#006233" />
            </TouchableOpacity>
            <Heading size="lg" ml="$2" color="#006233">New Urban Report</Heading>
          </HStack>
        </BlurView>
      </Box>

      <Formik
        initialValues={{ title: '', description: '' }}
        validationSchema={ReportSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <ScrollView 
                contentContainerStyle={styles.scroll} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <VStack space="lg" mt="$4">
                  {/* Image Section */}
                  <Box>
                    <Text style={styles.label}>Attachment</Text>
                    {imageUri ? (
                      <Box borderRadius="$2xl" overflow="hidden" bg="$backgroundLight100" style={styles.inputShadow}>
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        <TouchableOpacity style={styles.removeImage} onPress={() => setImageUri(null)}>
                          <BlurView intensity={60} style={styles.removeBlur}>
                            <X size={20} color="#FFF" />
                          </BlurView>
                        </TouchableOpacity>
                      </Box>
                    ) : (
                      <HStack space="md">
                        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(true)}>
                          <Camera size={24} color="#006233" />
                          <Text style={styles.uploadText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(false)}>
                          <ImageIcon size={24} color="#006233" />
                          <Text style={styles.uploadText}>Gallery</Text>
                        </TouchableOpacity>
                      </HStack>
                    )}
                  </Box>

                  {/* Form Fields */}
                  <VStack space="md">
                    <FormControl isInvalid={!!(touched.title && errors.title)}>
                      <FormControlLabel mb="$1">
                        <FormControlLabelText>Title</FormControlLabelText>
                      </FormControlLabel>
                      <GInput variant="rounded" size="lg" bg="$white" style={styles.inputShadow}>
                        <InputField 
                          placeholder="What's the issue?" 
                          onChangeText={handleChange('title')}
                          onBlur={handleBlur('title')}
                          value={values.title}
                        />
                      </GInput>
                    </FormControl>

                    <FormControl isInvalid={!!(touched.description && errors.description)}>
                      <FormControlLabel mb="$1">
                        <FormControlLabelText>Description</FormControlLabelText>
                      </FormControlLabel>
                      <Textarea size="lg" borderRadius="$xl" bg="$white" style={styles.inputShadow}>
                        <TextareaInput 
                          placeholder="Give us more details..." 
                          onChangeText={handleChange('description')}
                          onBlur={handleBlur('description')}
                          value={values.description}
                          multiline={true}
                        />
                      </Textarea>
                    </FormControl>
                  </VStack>


                  {/* Location */}
                  <Box bg="$white" p="$4" borderRadius="$2xl" borderWidth={1} borderColor="$borderLight100" style={styles.inputShadow}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <HStack space="sm" alignItems="center">
                        <MapPin size={20} color={location ? "#34C759" : "#8E8E93"} />
                        <VStack>
                          <Text style={styles.locationTitle}>Location Tag</Text>
                          <Text style={styles.locationSub}>
                            {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'No location tagged'}
                          </Text>
                        </VStack>
                      </HStack>
                      <Button 
                        title={locating ? "" : (location ? "Change" : "Tag")} 
                        variant={location ? "outline" : "secondary"}
                        onPress={getLocation} 
                        loading={locating}
                        style={[styles.locBtn, { backgroundColor: location ? 'transparent' : '#006233' }]}
                      />
                    </HStack>
                  </Box>
                  <Box h={40} />
                </VStack>
              </ScrollView>

              {/* Fixed Bottom Action */}
              <Box style={styles.bottomBar}>
                <Button 
                  title="Submit Report" 
                  onPress={() => handleSubmit()} 
                  loading={isSubmitting}
                  style={[styles.submitBtn, { backgroundColor: '#006233' }]}
                />
              </Box>
            </KeyboardAvoidingView>

            {/* Loading Overlay */}
            {isSubmitting && (
              <View style={styles.overlayContainer}>
                <BlurView intensity={80} tint="light" style={styles.overlayBlur}>
                  <VStack space="lg" alignItems="center" bg="$white" p="$10" borderRadius="$3xl" style={styles.overlayBox}>
                    <Box w={80} h={80} borderRadius="$full" bg="$success50" justifyContent="center" alignItems="center">
                      <Send size={40} color="#006233" />
                    </Box>
                    <Heading size="md" color="$primary600">Submitting...</Heading>
                    <Text style={styles.overlayText}>Uploading report and media. Please wait.</Text>
                  </VStack>
                </BlurView>
              </View>
            )}
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  headerWrapper: { zIndex: 10, backgroundColor: '#F8F9FB' },
  blurContainer: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  backBtn: { padding: 8 },
  scroll: { padding: 20, paddingTop: Platform.OS === 'ios' ? 120 : 100, paddingBottom: 100 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  imagePreview: { width: '100%', height: 220, resizeMode: 'cover' },
  removeImage: { position: 'absolute', top: 12, right: 12, borderRadius: 20, overflow: 'hidden' },
  removeBlur: { padding: 8, backgroundColor: 'rgba(0,0,0,0.5)' },
  uploadBtn: { 
    flex: 1, height: 120, backgroundColor: '#FFF', borderRadius: 24, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,98,51,0.2)', borderStyle: 'dashed'
  },
  uploadText: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#006233' },
  inputShadow: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  priorityCard: { 
    flex: 1, padding: 16, backgroundColor: '#FFF', borderRadius: 18, alignItems: 'center', borderWidth: 2, borderColor: 'transparent'
  },
  priorityLabel: { fontSize: 12, color: '#666' },
  locationTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  locationSub: { fontSize: 12, color: '#8E8E93' },
  locBtn: { minWidth: 90, paddingVertical: 8 },
  bottomBar: { 
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, 
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  submitBtn: { 
    height: 60, borderRadius: 30, shadowColor: '#006233', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5
  },
  overlayContainer: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  overlayBlur: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  overlayBox: {
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8
  },
  overlayText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 }
});
