import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReportMap } from '../components/ReportMap';
import { useLanguage } from '../hooks/useLanguage';

const { height } = Dimensions.get('window');

const getLShapedRoute = (origin: { latitude: number; longitude: number }, dest: { latitude: number; longitude: number }) => {
  return [
    origin,
    { latitude: dest.latitude, longitude: origin.longitude },
    dest,
  ];
};

export const TeamLeaderMapScreen = ({ route, navigation }: any) => {
  const { 
    report, 
    userLocation, 
    location, 
    navInstruction, 
    distanceKm, 
    durationMin 
  } = route.params;

  const { isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const origin = userLocation || location || { latitude: 31.62, longitude: -2.23 };
  const dest = location || { latitude: 31.621, longitude: -2.231 };
  
  // Calculate L-shaped route coordinates dynamically
  const routeCoordinates = getLShapedRoute(origin, dest);

  return (
    <View style={styles.container}>
      <ReportMap
        originCoordinate={origin}
        destinationCoordinate={dest}
        routeCoordinates={routeCoordinates}
        navInstruction={navInstruction || 'اتبع المسار المرسوم'}
        distanceKm={distanceKm || '—'}
        durationMin={durationMin || '—'}
        mapHeight={height}
      />

      {/* Floating Back Button Overlay */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[
          styles.backButton, 
          isRTL ? { right: 18 } : { left: 18 },
          { top: insets.top + 12 }
        ]}
        accessibilityLabel="رجوع"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons 
          name={isRTL ? 'chevron-right' : 'chevron-left'} 
          size={24} 
          color="#0A2E4A" 
        />
      </TouchableOpacity>
    </View>
  );
};

export default TeamLeaderMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderColor: '#C0EAF5', // Soft cyan border outline
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
});
