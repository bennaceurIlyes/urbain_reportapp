import React from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GovHeader } from '../components/GovHeader';
import { LanguageToggle } from '../components/LanguageToggle';
import { colors, spacing, borderRadius, shadows } from '../theme';
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

  const ProfileItem = ({ icon, label, color, onPress, value }: any) => (
    <TouchableOpacity
      style={[styles.profileItem, isRTL && styles.profileItemRTL]}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[styles.itemLabel, isRTL && styles.itemLabelRTL]}>{label}</Text>
      <View style={[styles.itemRight, isRTL && styles.itemRightRTL]}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        <MaterialCommunityIcons
          name={isRTL ? 'chevron-left' : 'chevron-right'}
          size={20}
          color={colors.borderLight}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <GovHeader title={t('profile')} subtitle={role} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
            {/* Role badge */}
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{role}</Text>
            </View>
          </View>
          <Text style={[styles.userName, isRTL && styles.userNameRTL]}>{displayName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, isRTL && styles.statsContainerRTL]}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>١٢</Text>
            <Text style={styles.statLabel}>{t('totalReports')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.status.completed }]}>٨</Text>
            <Text style={styles.statLabel}>{t('resolvedCount')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.status.pending }]}>٤</Text>
            <Text style={styles.statLabel}>{t('pendingCount')}</Text>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, isRTL && styles.sectionLabelRTL]}>{t('appLanguage')}</Text>
          <View style={styles.languageCard}>
            <View style={[styles.languageRow, isRTL && styles.languageRowRTL]}>
              <View style={[styles.iconContainer, { backgroundColor: colors.republicGreen + '15' }]}>
                <MaterialCommunityIcons name="translate" size={22} color={colors.republicGreen} />
              </View>
              <Text style={[styles.languageLabel, isRTL && styles.languageLabelRTL]}>{t('appLanguage')}</Text>
              <View style={styles.toggleWrapper}>
                <LanguageToggle />
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, isRTL && styles.sectionLabelRTL]}>{t('appSettings')}</Text>
          <View style={styles.menuGroup}>
            <ProfileItem
              icon="help-circle-outline"
              label={t('helpCenter')}
              color={colors.textSecondary}
              onPress={() => {}}
            />
            <Divider style={styles.menuDivider} />
            <ProfileItem
              icon="file-document-outline"
              label={t('termsPrivacy')}
              color={colors.textSecondary}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            accessibilityLabel={t('logout')}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="logout" size={20} color={colors.error} />
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>{t('version')}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  scroll: { paddingBottom: 120 },

  // Profile Header
  profileHeader: { alignItems: 'center', padding: spacing.lg },
  avatarWrapper: { marginBottom: spacing.md, alignItems: 'center' },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.republicGreen,
    justifyContent: 'center', alignItems: 'center',
    ...shadows.elevated,
  },
  avatarInitial: { fontSize: 38, fontWeight: '800', color: '#FFFFFF' },
  roleBadge: {
    marginTop: -12,
    backgroundColor: colors.governmentGold,
    paddingHorizontal: 14, paddingVertical: 3,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#FFFFFF', fontSize: 11, fontWeight: '700',
  },
  userName: {
    fontSize: 20, fontWeight: '700', color: colors.textPrimary,
    marginBottom: 2, textAlign: 'center',
  },
  userNameRTL: { textAlign: 'center' },
  userEmail: {
    color: colors.textMuted, fontWeight: '500', fontSize: 14,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.card,
    backgroundColor: colors.cardWhite,
    borderWidth: 1, borderColor: colors.borderLight,
    ...shadows.card,
  },
  statsContainerRTL: { flexDirection: 'row-reverse' },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: {
    fontSize: 22, fontWeight: '800', color: colors.republicGreen,
  },
  statLabel: {
    color: colors.textMuted, fontWeight: '600', marginTop: 4,
    fontSize: 11,
  },
  statDivider: {
    width: 1, height: '60%',
    backgroundColor: colors.borderLight, alignSelf: 'center',
  },

  // Language
  languageCard: {
    backgroundColor: colors.cardWhite, borderRadius: borderRadius.card,
    borderWidth: 1, borderColor: colors.borderLight,
    padding: spacing.md,
    ...shadows.card,
  },
  languageRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  languageRowRTL: { flexDirection: 'row-reverse' },
  languageLabel: {
    flex: 1, fontWeight: '600', color: colors.textPrimary,
    marginLeft: spacing.md, fontSize: 15,
  },
  languageLabelRTL: { marginLeft: 0, marginRight: spacing.md, textAlign: 'right' },
  toggleWrapper: {
    backgroundColor: colors.republicGreen,
    borderRadius: 20,
    padding: 2,
  },

  // Sections
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionLabel: {
    color: colors.textMuted, fontWeight: '700', marginBottom: spacing.sm,
    letterSpacing: 0.5, fontSize: 12, textTransform: 'uppercase',
    textAlign: 'left',
  },
  sectionLabelRTL: { textAlign: 'right' },
  menuGroup: {
    backgroundColor: colors.cardWhite, borderRadius: borderRadius.card,
    borderWidth: 1, borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.card,
  },
  profileItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, paddingRight: spacing.lg,
  },
  profileItemRTL: {
    flexDirection: 'row-reverse',
    paddingRight: spacing.md, paddingLeft: spacing.lg,
  },
  iconContainer: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginRight: spacing.md,
  },
  itemLabel: {
    flex: 1, fontWeight: '600', color: colors.textPrimary,
    fontSize: 15, textAlign: 'left',
  },
  itemLabelRTL: { textAlign: 'right', marginLeft: spacing.md, marginRight: 0 },
  itemRight: { flexDirection: 'row', alignItems: 'center' },
  itemRightRTL: { flexDirection: 'row-reverse' },
  itemValue: { color: colors.textMuted, marginRight: spacing.sm, fontWeight: '500', fontSize: 14 },
  menuDivider: { backgroundColor: colors.offWhite, marginHorizontal: spacing.md },

  // Footer
  footer: { marginTop: spacing.xl * 1.5, paddingHorizontal: spacing.lg, alignItems: 'center' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.button,
    backgroundColor: '#FEF2F2',
    borderWidth: 1, borderColor: '#FEE2E2',
  },
  logoutText: { color: colors.error, fontWeight: '700', marginLeft: 10, fontSize: 15 },
  versionText: { marginTop: spacing.lg, color: colors.textMuted, fontWeight: '500', fontSize: 12 },
});
