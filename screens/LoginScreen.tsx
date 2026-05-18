import React from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
} from 'react-native-paper';
import { supabase } from '../services/supabaseConfig';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/LanguageToggle';
import Svg, { Path, Pattern, Rect, Defs, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

/** Algerian National Flag SVG */
const AlgerianFlag = () => (
  <View style={flagStyles.container}>
    <View style={flagStyles.shadowWrapper}>
      <Svg width="90" height="60" viewBox="0 0 900 600">
        {/* Green half */}
        <Rect x="0" y="0" width="450" height="600" fill="#006233" />
        {/* White half */}
        <Rect x="450" y="0" width="450" height="600" fill="#FFFFFF" />
        {/* Red crescent */}
        <Circle cx="450" cy="300" r="150" fill="#D21034" />
        <Circle cx="475" cy="300" r="120" fill="#FFFFFF" />
        {/* Restore green over the white circle on the left side */}
        <Circle cx="475" cy="300" r="120" fill="#006233" clipPath="url(#leftClip)" />
        {/* Red star */}
        <Path
          d="M490 230 L504 272 L548 272 L512 298 L524 340 L490 314 L456 340 L468 298 L432 272 L476 272 Z"
          fill="#D21034"
        />
      </Svg>
    </View>
  </View>
);

const flagStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
  },
  shadowWrapper: {
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});

/** Zellij divider line */
const ZellijDivider = () => (
  <Svg width={width} height="20" viewBox={`0 0 ${width} 20`}>
    <Defs>
      <Pattern id="zellijLine" patternUnits="userSpaceOnUse" width="20" height="20">
        <Path d="M0 10 L10 0 L20 10 L10 20 Z" stroke={colors.republicGreen} strokeWidth="0.5" fill="none" opacity="0.15" />
      </Pattern>
    </Defs>
    <Rect width={width} height="20" fill="url(#zellijLine)" />
  </Svg>
);

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { t, lang, isRTL } = useLanguage();

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
      Alert.alert(t('error'), error.message);
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
          {/* ─── Green Header Area (Top 40%) ─── */}
          <LinearGradient
            colors={[colors.republicGreen, colors.activeGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.headerArea, { paddingTop: insets.top + spacing.xl }]}
          >
            {/* Geometric overlay */}
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              <Defs>
                <Pattern id="zellijLogin" patternUnits="userSpaceOnUse" width="40" height="40">
                  <Path d="M0 20 L20 0 L40 20 L20 40 Z" stroke="white" strokeWidth="0.5" fill="none" opacity="0.07" />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#zellijLogin)" />
            </Svg>

            <View style={styles.headerContent}>
              <AlgerianFlag />
              <Text style={styles.republicName}>
                {lang === 'ar'
                  ? 'الجمهورية الجزائرية الديمقراطية الشعبية'
                  : 'République Algérienne\nDémocratique et Populaire'}
              </Text>
              <View style={styles.goldDivider} />
              <Text style={[styles.appName, isRTL && styles.textRTL]}>
                {t('appName')}
              </Text>
              <Text style={[styles.appSubtitle, isRTL && styles.textRTL]}>
                {t('appSubtitle')}
              </Text>
              <Text style={[styles.ministryText, isRTL && styles.textRTL]}>
                {t('ministry')}
              </Text>
            </View>
          </LinearGradient>

          {/* ─── Zellij Divider ─── */}
          <View style={styles.dividerContainer}>
            <ZellijDivider />
          </View>

          {/* ─── Form Card (Bottom 60%) ─── */}
          <View style={styles.formCard}>
            <Text style={[styles.welcomeText, isRTL && styles.textRTL]}>
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
                    <Text style={[styles.label, isRTL && styles.labelRTL]}>{t('email')}</Text>
                    <TextInput
                      mode="flat"
                      placeholder={t('emailPlaceholder')}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.input, isRTL && styles.inputRTL]}
                      activeUnderlineColor={colors.republicGreen}
                      underlineColor="transparent"
                      error={!!(touched.email && errors.email)}
                      accessibilityLabel={t('email')}
                    />
                    <HelperText type="error" visible={!!(touched.email && errors.email)} style={styles.errorText}>
                      {errors.email}
                    </HelperText>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, isRTL && styles.labelRTL]}>{t('password')}</Text>
                    <TextInput
                      mode="flat"
                      placeholder={t('passwordPlaceholder')}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                      style={[styles.input, isRTL && styles.inputRTL]}
                      activeUnderlineColor={colors.republicGreen}
                      underlineColor="transparent"
                      error={!!(touched.password && errors.password)}
                      accessibilityLabel={t('password')}
                    />
                    <HelperText type="error" visible={!!(touched.password && errors.password)} style={styles.errorText}>
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
                    <Text style={styles.loginButtonText}>{t('login')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => navigation.navigate('Register')}
                    accessibilityLabel={t('register')}
                    accessibilityRole="button"
                  >
                    <Text style={styles.registerButtonText}>{t('register')}</Text>
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
  container: { flex: 1, backgroundColor: colors.offWhite },
  headerArea: {
    minHeight: height * 0.38,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  republicName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  goldDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#D4AF37',
    borderRadius: 1,
    marginVertical: 10,
    opacity: 0.7,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  ministryText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: spacing.xs,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  textRTL: {
    textAlign: 'center',
  },
  dividerContainer: {
    marginTop: -10,
    overflow: 'hidden',
  },
  formCard: {
    backgroundColor: colors.cardWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    flex: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'left',
  },
  form: { width: '100%' },
  inputContainer: { marginBottom: spacing.sm },
  label: {
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'left',
  },
  labelRTL: {
    textAlign: 'right',
  },
  input: {
    backgroundColor: colors.cardWhite,
    borderRadius: borderRadius.input,
    height: 52,
    paddingHorizontal: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputRTL: {
    textAlign: 'right',
  },
  errorText: { paddingLeft: 0, marginTop: 2 },
  loginButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.republicGreen,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.button,
    borderWidth: 1.5,
    borderColor: colors.republicGreen,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.republicGreen,
    fontSize: 16,
    fontWeight: '700',
  },
  langToggleContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  langToggleWrapper: {
    backgroundColor: colors.republicGreen,
    borderRadius: 20,
    padding: 2,
  },
});
