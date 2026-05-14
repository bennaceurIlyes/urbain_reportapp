import React from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme, 
  HelperText,
} from 'react-native-paper';
import { supabase } from '../services/supabaseConfig';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password too short!').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

export const RegisterScreen = ({ navigation }: any) => {
  const theme = useTheme();

  const handleRegister = async (values: any, { setSubmitting }: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      Alert.alert('Success', 'Account created! You can now log in.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="displayMedium" style={styles.title}>
              Create account
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Join our community and help improve our city, one report at a time.
            </Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text variant="labelLarge" style={styles.label}>Email Address</Text>
                  <TextInput
                    mode="flat"
                    placeholder="name@example.com"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    activeUnderlineColor={theme.colors.primary}
                    underlineColor="transparent"
                    error={!!(touched.email && errors.email)}
                  />
                  <HelperText type="error" visible={!!(touched.email && errors.email)} style={styles.errorText}>
                    {errors.email}
                  </HelperText>
                </View>

                <View style={styles.inputContainer}>
                  <Text variant="labelLarge" style={styles.label}>Password</Text>
                  <TextInput
                    mode="flat"
                    placeholder="At least 6 characters"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                    style={styles.input}
                    activeUnderlineColor={theme.colors.primary}
                    underlineColor="transparent"
                    error={!!(touched.password && errors.password)}
                  />
                  <HelperText type="error" visible={!!(touched.password && errors.password)} style={styles.errorText}>
                    {errors.password}
                  </HelperText>
                </View>

                <View style={styles.inputContainer}>
                  <Text variant="labelLarge" style={styles.label}>Confirm Password</Text>
                  <TextInput
                    mode="flat"
                    placeholder="Repeat your password"
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    secureTextEntry
                    style={styles.input}
                    activeUnderlineColor={theme.colors.primary}
                    underlineColor="transparent"
                    error={!!(touched.confirmPassword && errors.confirmPassword)}
                  />
                  <HelperText type="error" visible={!!(touched.confirmPassword && errors.confirmPassword)} style={styles.errorText}>
                    {errors.confirmPassword}
                  </HelperText>
                </View>

                <Button 
                  mode="contained" 
                  onPress={() => handleSubmit()} 
                  loading={isSubmitting}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  Create account
                </Button>

                <View style={styles.footer}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                      Sign in
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: { paddingHorizontal: 20, paddingTop: 10 },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  scroll: { padding: 32, paddingBottom: 64 },
  header: { marginBottom: 40 },
  title: { fontWeight: '800', letterSpacing: -0.5, marginBottom: 12 },
  subtitle: { color: '#64748B', lineHeight: 24 },
  form: { width: '100%' },
  inputContainer: { marginBottom: 16 },
  label: { marginBottom: 8, color: '#0F172A', fontWeight: '600' },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  errorText: { paddingLeft: 0, marginTop: 4 },
  button: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: '#1B4FD8',
    elevation: 0,
    shadowColor: 'transparent',
  },
  buttonContent: { height: 56 },
  buttonLabel: { fontSize: 16, fontWeight: '700', letterSpacing: 0 },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 32 
  },
});
