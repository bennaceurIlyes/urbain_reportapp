import React from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
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

const { width } = Dimensions.get('window');

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
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
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="displayMedium" style={styles.title}>
              Welcome back
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to continue reporting urban issues in your neighborhood.
            </Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
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
                  <View style={styles.labelRow}>
                    <Text variant="labelLarge" style={styles.label}>Password</Text>
                    <TouchableOpacity onPress={() => {}}>
                      <Text variant="labelMedium" style={{ color: theme.colors.primary }}>Forgot?</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    mode="flat"
                    placeholder="••••••••"
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

                <Button 
                  mode="contained" 
                  onPress={() => handleSubmit()} 
                  loading={isSubmitting}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  Sign in
                </Button>

                <View style={styles.footer}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                      Sign up
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
  scroll: { padding: 32, flexGrow: 1, justifyContent: 'center' },
  header: { marginBottom: 48 },
  title: { fontWeight: '800', letterSpacing: -0.5, marginBottom: 12 },
  subtitle: { color: '#64748B', lineHeight: 24 },
  form: { width: '100%' },
  inputContainer: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
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
