import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { ReportDetailsScreen } from '../screens/ReportDetailsScreen';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View, Platform } from 'react-native';
import { Home, PlusSquare } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <BlurView intensity={80} tint="light" style={{ flex: 1 }} />
        ),
        tabBarActiveTintColor: '#006233',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="MainHome" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' }}>
        <ActivityIndicator size="large" color="#006233" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen 
            name="Report" 
            component={ReportScreen} 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen 
            name="ReportDetails" 
            component={ReportDetailsScreen} 
            options={{ 
              animation: 'slide_from_right'
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
