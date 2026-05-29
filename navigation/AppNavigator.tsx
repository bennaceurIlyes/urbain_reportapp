import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { ReportDetailsScreen } from '../screens/ReportDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TeamLeaderHomeScreen } from '../screens/TeamLeaderHomeScreen';
import { TeamLeaderReportDetailsScreen } from '../screens/TeamLeaderReportDetailsScreen';
import { TeamLeaderCompletionUploadScreen } from '../screens/TeamLeaderCompletionUploadScreen';
import { TeamLeaderMapScreen } from '../screens/TeamLeaderMapScreen';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useReportNotifications } from '../hooks/useReportNotifications';
import { View, Platform, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── CITIZEN TAB NAVIGATOR ───────────────────────────────────────────────────
const CitizenTabNavigator = () => {
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 66 + insets.bottom,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.92)' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          elevation: 0,
          paddingBottom: insets.bottom + 6,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ) : null,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
          fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="MainHome"
        component={HomeScreen}
        options={{
          tabBarLabel: t('myReports'),
          tabBarIcon: ({ focused }) => (
            <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={focused ? 20 : 22}
                color={focused ? '#FFFFFF' : '#7BA8BF'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({ focused }) => (
            <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
              <MaterialCommunityIcons
                name={focused ? 'account' : 'account-outline'}
                size={focused ? 20 : 22}
                color={focused ? '#FFFFFF' : '#7BA8BF'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ─── TEAM LEADER TAB NAVIGATOR ───────────────────────────────────────────────
const TeamLeaderTabNavigator = () => {
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 66 + insets.bottom,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.92)' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          elevation: 0,
          paddingBottom: insets.bottom + 6,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ) : null,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
          fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="TLHome"
        component={TeamLeaderHomeScreen}
        options={{
          tabBarLabel: t('myTasks'),
          tabBarIcon: ({ focused }) => (
            <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
              <MaterialCommunityIcons
                name={focused ? 'clipboard-list' : 'clipboard-list-outline'}
                size={focused ? 20 : 22}
                color={focused ? '#FFFFFF' : '#7BA8BF'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TLProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({ focused }) => (
            <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
              <MaterialCommunityIcons
                name={focused ? 'account' : 'account-outline'}
                size={focused ? 20 : 22}
                color={focused ? '#FFFFFF' : '#7BA8BF'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ─── ROOT NAVIGATOR ──────────────────────────────────────────────────────────
export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { isRTL } = useLanguage();
  useReportNotifications();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const slideAnimation = isRTL ? 'slide_from_left' as const : 'slide_from_right' as const;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.pageBg },
        animation: slideAnimation,
      }}
    >
      {user ? (
        user.user_metadata?.role === 'team_leader' ? (
          <>
            <Stack.Screen name="TeamLeaderTabs" component={TeamLeaderTabNavigator} />
            <Stack.Screen
              name="TeamLeaderReportDetails"
              component={TeamLeaderReportDetailsScreen}
              options={{ animation: slideAnimation }}
            />
            <Stack.Screen
              name="TeamLeaderCompletionUpload"
              component={TeamLeaderCompletionUploadScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="TeamLeaderMap"
              component={TeamLeaderMapScreen}
              options={{ animation: slideAnimation }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Tabs" component={CitizenTabNavigator} />
            <Stack.Screen
              name="Report"
              component={ReportScreen}
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="ReportDetails"
              component={ReportDetailsScreen}
              options={{ animation: slideAnimation }}
            />
          </>
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pageBg,
  },
});

const tabStyles = StyleSheet.create({
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapperActive: {
    backgroundColor: '#0A2E4A', // Deep water navy active square chip
  },
});
