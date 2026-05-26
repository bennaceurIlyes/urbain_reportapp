import React from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GovHeader } from '../components/GovHeader';
import { LanguageToggle } from '../components/LanguageToggle';
import { colors, spacing, radius } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ProfileScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t, lang, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const role = user?.user_metadata?.role === 'team_leader' ? t('teamLeader') : t('citizen');
  const initial = user?.email?.[0].toUpperCase() || 'U';
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) Alert.alert(t('error'), error.message);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <GovHeader title={t('profile')} subtitle={role} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarOuterRing}>
            <View style={styles.avatarCircle}>
              <Text style={[styles.avatarInitial, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{initial}</Text>
            </View>
          </View>
          {/* Role badge */}
          <View style={styles.roleBadge}>
            <Text style={[styles.roleBadgeText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{role}</Text>
          </View>
          <Text style={[styles.userName, isRTL && styles.userNameRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{displayName}</Text>
          <Text style={[styles.userEmail, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{user?.email}</Text>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, isRTL && styles.sectionLabelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('appLanguage')}</Text>
          <View style={styles.languageCard}>
            <View style={[styles.languageRow, isRTL && styles.languageRowRTL]}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryTint }]}>
                <MaterialCommunityIcons name="translate" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.languageLabel, isRTL && styles.languageLabelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('appLanguage')}</Text>
              <View style={styles.toggleWrapper}>
                <LanguageToggle />
              </View>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            accessibilityLabel={t('logout')}
            accessibilityRole="button"
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="logout" size={20} color={colors.error} />
            <Text style={[styles.logoutText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{t('logout')}</Text>
          </TouchableOpacity>
          <Text style={[styles.versionText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>{t('version')}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pageBg },
  scroll: { paddingBottom: 120 },

  // Profile Header
  profileHeader: { alignItems: 'center', padding: spacing.lg },
  avatarOuterRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: '#D4AF37', // Gold outer ring
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: 'transparent',
  },
  avatarCircle: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { fontSize: 30, color: '#FFFFFF' },
  roleBadge: {
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12, paddingVertical: 2.5,
    borderRadius: radius.xs, // 4px modest radius
    marginBottom: spacing.md,
  },
  roleBadgeText: {
    color: colors.primary, fontSize: 10,
  },
  userName: {
    fontSize: 18, color: colors.textPrimary,
    marginBottom: 2, textAlign: 'center',
  },
  userNameRTL: { textAlign: 'center' },
  userEmail: {
    color: colors.textSecondary, fontSize: 13,
  },

  // Language
  languageCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
  },
  languageRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  languageRowRTL: { flexDirection: 'row-reverse' },
  languageLabel: {
    flex: 1, color: colors.textPrimary,
    marginLeft: spacing.md, fontSize: 14,
  },
  languageLabelRTL: { marginLeft: 0, marginRight: spacing.md, textAlign: 'right' },
  toggleWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 2,
  },

  // Sections
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  sectionLabel: {
    color: colors.textSecondary, marginBottom: spacing.xs,
    letterSpacing: 0.3, fontSize: 11, textTransform: 'uppercase',
    textAlign: 'left',
  },
  sectionLabelRTL: { textAlign: 'right' },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  // Footer
  footer: { marginTop: spacing.xl * 1.5, paddingHorizontal: spacing.lg, alignItems: 'center' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.xl * 1.5,
    borderRadius: radius.md, // 8px rounded square button
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    gap: spacing.sm,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutText: { color: colors.error, fontSize: 14 },
  versionText: { marginTop: spacing.md, color: colors.textSecondary, fontSize: 11 },
});
