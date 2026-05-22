import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import {
  TextInput,
  Text,
  HelperText,
} from 'react-native-paper';
import { supabase } from '../services/supabaseConfig';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import { useAlert } from '../context/AlertContext';

const { height } = Dimensions.get('window');

export const RegisterScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { t, lang, isRTL } = useLanguage();
  const { showAlert } = useAlert();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email(t('invalidEmail')).required(t('titleRequired')),
    password: Yup.string().min(6, t('passwordMin')).required(t('titleRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], t('passwordMismatch'))
      .required(t('titleRequired')),
  });

  const handleRegister = async (values: any, { setSubmitting }: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      showAlert({ 
        title: t('success'), 
        message: t('accountCreated'),
        buttons: [{ text: t('done'), onPress: () => navigation.goBack() }]
      });
    } catch (error: any) {
      showAlert({ title: t('error'), message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ─── Blue Header Area (Top 35%) ─── */}
          <LinearGradient
            colors={[colors.primaryDark, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.headerArea, { paddingTop: insets.top + spacing.md }]}
          >
            {/* Thin accent line at the bottom of the header area */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: colors.primaryBorder,
              opacity: 0.6,
            }} />

            <View style={[styles.headerRow, isRTL && styles.headerRowRTL]}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                accessibilityLabel={t('back')}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name={isRTL ? 'chevron-right' : 'chevron-left'}
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerContent}>
              <Text style={[styles.headerTitle, isRTL && styles.textCenter, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                {t('registerWelcome')}
              </Text>
              <Text style={[styles.headerSubtitle, isRTL && styles.textCenter, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                {t('registerSubtitle')}
              </Text>
            </View>
          </LinearGradient>

          {/* ─── Form Card ─── */}
          <View style={styles.formCard}>
            <Formik
              initialValues={{ email: '', password: '', confirmPassword: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, isRTL && styles.labelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('email')}</Text>
                    <TextInput
                      mode="flat"
                      placeholder={t('emailPlaceholder')}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.input, isRTL && styles.inputRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}
                      activeUnderlineColor={colors.primary}
                      underlineColor="transparent"
                      error={!!(touched.email && errors.email)}
                      accessibilityLabel={t('email')}
                    />
                    <HelperText type="error" visible={!!(touched.email && errors.email)} style={{ fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular', fontSize: 11 }}>
                      {errors.email}
                    </HelperText>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, isRTL && styles.labelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('password')}</Text>
                    <TextInput
                      mode="flat"
                      placeholder={t('passwordMin')}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                      style={[styles.input, isRTL && styles.inputRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}
                      activeUnderlineColor={colors.primary}
                      underlineColor="transparent"
                      error={!!(touched.password && errors.password)}
                      accessibilityLabel={t('password')}
                    />
                    <HelperText type="error" visible={!!(touched.password && errors.password)} style={{ fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular', fontSize: 11 }}>
                      {errors.password}
                    </HelperText>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, isRTL && styles.labelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('confirmPassword')}</Text>
                    <TextInput
                      mode="flat"
                      placeholder={t('passwordPlaceholder')}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      value={values.confirmPassword}
                      secureTextEntry
                      style={[styles.input, isRTL && styles.inputRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}
                      activeUnderlineColor={colors.primary}
                      underlineColor="transparent"
                      error={!!(touched.confirmPassword && errors.confirmPassword)}
                      accessibilityLabel={t('confirmPassword')}
                    />
                    <HelperText type="error" visible={!!(touched.confirmPassword && errors.confirmPassword)} style={{ fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular', fontSize: 11 }}>
                      {errors.confirmPassword}
                    </HelperText>
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                    accessibilityLabel={t('register')}
                    accessibilityRole="button"
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.submitButtonText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('register')}</Text>
                  </TouchableOpacity>

                  <View style={[styles.footer, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Text style={[styles.footerText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{t('hasAccount')} </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text style={[styles.footerLink, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('login')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pageBg },
  headerArea: {
    minHeight: height * 0.28,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  headerRowRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },
  textCenter: {
    textAlign: 'right',
  },
  formCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: -8,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    flex: 1,
  },
  form: { width: '100%' },
  inputContainer: { marginBottom: spacing.xs },
  label: {
    marginBottom: spacing.xs,
    color: colors.textPrimary,
    fontSize: 13,
    textAlign: 'left',
  },
  labelRTL: {
    textAlign: 'right',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.sm, // square form fields (6px)
    height: 50,
    paddingHorizontal: 4,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputRTL: {
    textAlign: 'right',
  },
  submitButton: {
    marginTop: spacing.md,
    borderRadius: radius.sm, // square buttons (6px)
    backgroundColor: colors.primary,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.textOnBlue,
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 13,
  },
});
