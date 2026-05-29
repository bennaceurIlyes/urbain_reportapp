import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReportMap } from '../components/ReportMap';
import { useLanguage } from '../hooks/useLanguage';

const { height } = Dimensions.get('window');

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
  
  const [routeCoordinates, setRouteCoordinates] = React.useState<{ latitude: number; longitude: number }[]>([]);

  React.useEffect(() => {
    const fetchRoute = async () => {
      try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}?overview=full&geometries=geojson&steps=true`;

        const res = await fetch(osrmUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1 MahammiApp/1.0'
          }
        });
        
        if (res.status === 200) {
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c: number[]) => ({
              latitude: c[1],
              longitude: c[0]
            }));
            setRouteCoordinates(coords);
            return;
          }
        }
        
        // Fallback L-shaped route
        setRouteCoordinates([
          origin,
          { latitude: dest.latitude, longitude: origin.longitude },
          dest,
        ]);
      } catch (error) {
        console.error("Failed to fetch road-following route from OSRM:", error);
        setRouteCoordinates([
          origin,
          { latitude: dest.latitude, longitude: origin.longitude },
          dest,
        ]);
      }
    };

    fetchRoute();
  }, [origin.latitude, origin.longitude, dest.latitude, dest.longitude]);

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
