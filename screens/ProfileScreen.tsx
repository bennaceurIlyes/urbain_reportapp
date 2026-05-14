import React from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { 
  Text, 
  useTheme, 
  Divider,
} from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const theme = useTheme();

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) Alert.alert("Error", error.message);
          }
        }
      ]
    );
  };

  const ProfileItem = ({ icon, label, color, onPress, value }: any) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      </View>
      <Text variant="bodyLarge" style={styles.itemLabel}>{label}</Text>
      <View style={styles.itemRight}>
        {value && <Text variant="bodyMedium" style={styles.itemValue}>{value}</Text>}
        <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topHeader}>
        <Text variant="displaySmall" style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user?.email?.[0].toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text variant="headlineSmall" style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
          <Text variant="bodyMedium" style={styles.userEmail}>{user?.email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text variant="titleLarge" style={styles.statNumber}>12</Text>
              <Text variant="labelSmall" style={styles.statLabel}>REPORTS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text variant="titleLarge" style={styles.statNumber}>8</Text>
              <Text variant="labelSmall" style={styles.statLabel}>RESOLVED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text variant="titleLarge" style={styles.statNumber}>4</Text>
              <Text variant="labelSmall" style={styles.statLabel}>PENDING</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.sectionLabel}>App Settings</Text>
          <View style={styles.menuGroup}>
            <ProfileItem 
              icon="bell-outline" 
              label="Notifications" 
              color="#F59E0B" 
              onPress={() => {}} 
              value="On"
            />
            <Divider style={styles.menuDivider} />
            <ProfileItem 
              icon="help-circle-outline" 
              label="Help Center" 
              color="#64748B" 
              onPress={() => {}} 
            />
            <Divider style={styles.menuDivider} />
            <ProfileItem 
              icon="file-document-outline" 
              label="Terms & Privacy" 
              color="#64748B" 
              onPress={() => {}} 
            />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
            <Text variant="titleMedium" style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
          <Text variant="labelSmall" style={styles.versionText}>Urban Report v1.2.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5, color: '#0F172A' },
  settingsBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 120 },
  profileHeader: { alignItems: 'center', padding: 24 },
  avatarWrapper: { marginBottom: 20 },
  avatarPlaceholder: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: '#1B4FD8', 
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#1B4FD8', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 15, elevation: 5
  },
  avatarInitial: { fontSize: 42, fontWeight: '800', color: '#FFFFFF' },
  userName: { fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  userEmail: { color: '#64748B', fontWeight: '500' },
  statsContainer: { 
    flexDirection: 'row', 
    marginTop: 32, 
    padding: 24, 
    borderRadius: 24, 
    backgroundColor: '#FFFFFF',
    width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontWeight: '800', color: '#1B4FD8' },
  statLabel: { color: '#94A3B8', fontWeight: '700', marginTop: 4, letterSpacing: 0.5 },
  statDivider: { width: 1, height: '60%', backgroundColor: '#F1F5F9', alignSelf: 'center' },
  section: { paddingHorizontal: 24, marginTop: 32 },
  sectionLabel: { color: '#94A3B8', fontWeight: '700', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 },
  menuGroup: { 
    backgroundColor: '#FFFFFF', borderRadius: 24, 
    borderWidth: 1, borderColor: '#F1F5F9',
    overflow: 'hidden'
  },
  profileItem: { 
    flexDirection: 'row', alignItems: 'center', 
    padding: 16, paddingRight: 20
  },
  iconContainer: { 
    width: 40, height: 40, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', marginRight: 16 
  },
  itemLabel: { flex: 1, fontWeight: '600', color: '#0F172A' },
  itemRight: { flexDirection: 'row', alignItems: 'center' },
  itemValue: { color: '#64748B', marginRight: 8, fontWeight: '500' },
  menuDivider: { backgroundColor: '#F8FAFC', marginHorizontal: 16 },
  footer: { marginTop: 40, paddingHorizontal: 24, alignItems: 'center' },
  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingVertical: 14, paddingHorizontal: 32, 
    borderRadius: 16, backgroundColor: '#FEF2F2',
    borderWidth: 1, borderColor: '#FEE2E2'
  },
  logoutText: { color: '#EF4444', fontWeight: '700', marginLeft: 10 },
  versionText: { marginTop: 24, color: '#CBD5E1', fontWeight: '500' },
});
