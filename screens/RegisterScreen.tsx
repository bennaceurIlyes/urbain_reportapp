import React from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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
import { colors, spacing, borderRadius } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import Svg, { Path, Pattern, Rect, Defs } from 'react-native-svg';

const { height } = Dimensions.get('window');

export const RegisterScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { t, lang, isRTL } = useLanguage();

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
      Alert.alert(t('success'), t('accountCreated'));
      navigation.goBack();
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
          {/* ─── Green Header Area ─── */}
          <LinearGradient
            colors={[colors.republicGreen, colors.activeGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.headerArea, { paddingTop: insets.top + spacing.md }]}
          >
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              <Defs>
                <Pattern id="zellijReg" patternUnits="userSpaceOnUse" width="40" height="40">
                  <Path d="M0 20 L20 0 L40 20 L20 40 Z" stroke="white" strokeWidth="0.5" fill="none" opacity="0.07" />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#zellijReg)" />
            </Svg>

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
              <Text style={[styles.headerTitle, isRTL && styles.textCenter]}>
                {t('registerWelcome')}
              </Text>
              <Text style={[styles.headerSubtitle, isRTL && styles.textCenter]}>
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
                    <HelperText type="error" visible={!!(touched.email && errors.email)}>
                      {errors.email}
                    </HelperText>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, isRTL && styles.labelRTL]}>{t('password')}</Text>
                    <TextInput
                      mode="flat"
                      placeholder={t('passwordMin')}
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
                    <HelperText type="error" visible={!!(touched.password && errors.password)}>
                      {errors.password}
                    </HelperText>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, isRTL && styles.labelRTL]}>{t('confirmPassword')}</Text>
                    <TextInput
                      mode="flat"
                      placeholder={t('passwordPlaceholder')}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      value={values.confirmPassword}
                      secureTextEntry
                      style={[styles.input, isRTL && styles.inputRTL]}
                      activeUnderlineColor={colors.republicGreen}
                      underlineColor="transparent"
                      error={!!(touched.confirmPassword && errors.confirmPassword)}
                      accessibilityLabel={t('confirmPassword')}
                    />
                    <HelperText type="error" visible={!!(touched.confirmPassword && errors.confirmPassword)}>
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
                    <Text style={styles.submitButtonText}>{t('register')}</Text>
                  </TouchableOpacity>

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('hasAccount')} </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text style={styles.footerLink}>{t('login')}</Text>
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
  container: { flex: 1, backgroundColor: colors.offWhite },
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  textCenter: {
    textAlign: 'right',
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
  form: { width: '100%' },
  inputContainer: { marginBottom: spacing.xs },
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
  submitButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.republicGreen,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.republicGreen,
    fontWeight: '700',
    fontSize: 14,
  },
});
