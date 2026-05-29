import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import MapView, { UrlTile, Polyline, Marker } from 'react-native-maps';

interface Coords {
  latitude: number;
  longitude: number;
}

export interface ReportMapProps {
  originCoordinate: Coords;
  destinationCoordinate: Coords;
  routeCoordinates: Coords[];
  navInstruction: string;
  distanceKm: string;
  durationMin: string;
  mapHeight: number;
}

const OSM_TILE_SERVERS = [
  'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
  'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
];

const getInitialRegion = (origin: Coords, destination: Coords) => {
  const centerLat = (origin.latitude + destination.latitude) / 2;
  const centerLng = (origin.longitude + destination.longitude) / 2;

  let latDelta = Math.abs(destination.latitude - origin.latitude) * 2.2;
  let lngDelta = Math.abs(destination.longitude - origin.longitude) * 2.2;

  latDelta = Math.max(latDelta, 0.01);
  lngDelta = Math.max(lngDelta, 0.01);

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

export const ReportMap: React.FC<ReportMapProps> = ({
  originCoordinate,
  destinationCoordinate,
  routeCoordinates,
  navInstruction,
  distanceKm,
  durationMin,
  mapHeight,
}) => {
  const tileUrlRef = useRef(OSM_TILE_SERVERS[Math.floor(Math.random() * 3)]);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  // Region calculation
  const initialRegion = getInitialRegion(originCoordinate, destinationCoordinate);

  // Performance timer for tracksViewChanges to avoid rendering every frame on Android
  useEffect(() => {
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Native-driver driven destination pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.8,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [pulseAnim, pulseOpacity]);

  return (
    <View style={[styles.wrapper, { height: mapHeight }]}>
      <MapView
        provider={undefined}
        mapType="none"
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
        showsBuildings={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
        rotateEnabled={false}
        pitchEnabled={false}
        moveOnMarkerPress={false}
        minZoomLevel={12}
        maxZoomLevel={19}
        loadingEnabled={true}
        loadingIndicatorColor="#18A6C8"
        loadingBackgroundColor="#F0F9FF"
      >
        <UrlTile
          urlTemplate={tileUrlRef.current}
          maximumZ={19}
          tileSize={256}
          shouldReplaceMapContent={true}
          flipY={false}
        />

        {/* Route shadow line — drawn FIRST so it appears below */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="rgba(10,46,74,0.12)"
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            geodesic={true}
          />
        )}

        {/* Main route line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2A7BB5"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
            geodesic={true}
          />
        )}

        {/* Origin marker */}
        <Marker
          coordinate={originCoordinate}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={tracksViewChanges}
          {...({ calloutEnabled: false } as any)}
        >
          <View style={styles.originMarker} />
        </Marker>

        {/* Destination marker with animated pulse */}
        <Marker
          coordinate={destinationCoordinate}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={tracksViewChanges}
          {...({ calloutEnabled: false } as any)}
        >
          <View style={styles.destMarkerWrapper}>
            <Animated.View
              style={[
                styles.destPulseRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseOpacity,
                },
              ]}
            />
            <View style={styles.destDot} />
          </View>
        </Marker>
      </MapView>

      {/* Navigation Pill — Floating Overlay */}
      <View style={styles.navPill}>
        <View style={styles.navArrowBox}>
          <Text style={styles.navArrowIcon}>↑</Text>
        </View>
        <View style={styles.navTextBlock}>
          <Text style={styles.navPrimary}>{navInstruction}</Text>
          <Text style={styles.navSecondary}>
            {distanceKm} ك • {durationMin} د
          </Text>
        </View>
        <View style={styles.navCompass}>
          <Text style={styles.navCompassText}>⊕</Text>
        </View>
      </View>

      {/* Attribution — REQUIRED BY OSM LICENSE */}
      <View style={styles.attribution}>
        <Text style={styles.attributionText}>© OpenStreetMap</Text>
      </View>
    </View>
  );
};

export default ReportMap;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  originMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0D6B9A',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  destMarkerWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destPulseRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  destDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  navPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 46, 74, 0.92)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
    zIndex: 10,
  },
  navArrowBox: {
    width: 34,
    height: 34,
    backgroundColor: '#18A6C8',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  navTextBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },
  navPrimary: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  navSecondary: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },
  navCompass: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCompassText: {
    color: '#18A6C8',
    fontSize: 16,
  },
  attribution: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    zIndex: 10,
  },
  attributionText: {
    fontSize: 9,
    color: 'rgba(10, 46, 74, 0.6)',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
