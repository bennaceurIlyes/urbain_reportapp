import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
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
import { colors, spacing, radius, typography } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/LanguageToggle';
import { useAlert } from '../context/AlertContext';
import Svg, { Path, Defs, Pattern, Rect } from 'react-native-svg';

const { height } = Dimensions.get('window');

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { t, lang, isRTL } = useLanguage();
  const { showAlert } = useAlert();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email(t('invalidEmail')).required(t('titleRequired')),
    password: Yup.string().required(t('titleRequired')),
  });

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
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
            style={[styles.headerArea, { paddingTop: insets.top + spacing.lg + 10 }]}
          >
            {/* Zellij Vector SVG Overlay */}
            <Svg style={StyleSheet.absoluteFillObject}>
              <Defs>
                <Pattern id="zellij" width="30" height="30" patternUnits="userSpaceOnUse">
                  <Path d="M0 15 L15 0 L30 15 L15 30 Z" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.05" />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#zellij)" />
            </Svg>

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

            <View style={styles.headerContent}>
              <View style={styles.logoWrapper}>
                <Image 
                  source={require('../assets/logo.png')} 
                  style={styles.logo} 
                  resizeMode="contain" 
                />
              </View>
              
              <Text style={[styles.republicName, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                {lang === 'ar'
                  ? 'الجزائرية للمياه — وحدة بشار'
                  : 'Algérienne Des Eaux — Unité de Béchar'}
              </Text>
              
              <View style={styles.goldDivider} />
              
              <Text style={[styles.appName, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
                {t('appName')}
              </Text>
              
              <Text style={[styles.appSubtitle, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                {lang === 'ar'
                  ? 'بوابة المواطن الرقمية للتبليغ عن الأعطاب'
                  : 'Portail Citoyen de Signalement des Incidents'}
              </Text>
            </View>
          </LinearGradient>

          {/* ─── Form Card (65%) ─── */}
          <View style={styles.formCard}>
            <Text style={[styles.welcomeText, isRTL && styles.textRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
              {t('loginWelcome')}
            </Text>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, isRTL && styles.labelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('email')}</Text>
                    <TextInput
                      mode="outlined"
                      placeholder={t('emailPlaceholder')}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.input, isRTL && styles.inputRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}
                      activeOutlineColor={colors.primary}
                      outlineColor={colors.borderLight}
                      error={!!(touched.email && errors.email)}
                      accessibilityLabel={t('email')}
                    />
                    <HelperText type="error" visible={!!(touched.email && errors.email)} style={[styles.errorText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                      {errors.email}
                    </HelperText>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, isRTL && styles.labelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('password')}</Text>
                    <TextInput
                      mode="outlined"
                      placeholder={t('passwordPlaceholder')}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                      style={[styles.input, isRTL && styles.inputRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}
                      activeOutlineColor={colors.primary}
                      outlineColor={colors.borderLight}
                      error={!!(touched.password && errors.password)}
                      accessibilityLabel={t('password')}
                    />
                    <HelperText type="error" visible={!!(touched.password && errors.password)} style={[styles.errorText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
                      {errors.password}
                    </HelperText>
                  </View>

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                    accessibilityLabel={t('login')}
                    accessibilityRole="button"
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.loginButtonText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('login')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => navigation.navigate('Register')}
                    accessibilityLabel={t('register')}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.registerButtonText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('register')}</Text>
                  </TouchableOpacity>

                  {/* Language toggle */}
                  <View style={styles.langToggleContainer}>
                    <View style={styles.langToggleWrapper}>
                      <LanguageToggle />
                    </View>
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
    minHeight: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  logo: {
    width: 52,
    height: 52,
  },
  republicName: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  goldDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#D4AF37', // Official administrative Gold pop
    borderRadius: 1,
    marginVertical: 10,
  },
  appName: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  appSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  textRTL: {
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.md, // modest corner radius
    borderTopRightRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: -8,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'left',
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
    height: 50,
    fontSize: 14,
  },
  inputRTL: {
    textAlign: 'right',
  },
  errorText: { paddingLeft: 0, marginTop: 2, fontSize: 11 },
  loginButton: {
    marginTop: spacing.md,
    borderRadius: radius.sm, // square-ish buttons (6px)
    backgroundColor: colors.primary,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.textOnBlue,
    fontSize: 15,
  },
  registerButton: {
    marginTop: spacing.md,
    borderRadius: radius.sm, // square-ish buttons (6px)
    borderWidth: 1.5,
    borderColor: colors.primary,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: 15,
  },
  langToggleContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  langToggleWrapper: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    padding: 2,
  },
});
