import React, { useState } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from 'react-native-paper';
import { colors, radius } from '../theme';

interface Coords {
  latitude: number;
  longitude: number;
}

interface MapRouteViewProps {
  startCoords: Coords | null;
  endCoords: Coords;
  height?: number;
  onRouteUpdate?: (distance: number, duration: number, instructions: any[]) => void;
}

export const MapRouteView: React.FC<MapRouteViewProps> = ({ startCoords, endCoords, height = 240, onRouteUpdate }) => {
  const [loading, setLoading] = useState(true);

  // Web fallback window event listener
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (e: MessageEvent) => {
        try {
          const payload = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (payload && payload.type === 'route_info') {
            onRouteUpdate?.(payload.distance, payload.duration, payload.instructions);
          }
        } catch (err) {}
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [onRouteUpdate]);

  // HTML content loaded inside WebView / iframe
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body, html, #map {
          margin: 0; padding: 0; width: 100%; height: 100%;
          background-color: #f8fafc;
        }
        /* Custom UI aesthetics matching shadcn/mapcn */
        .leaflet-bar {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-bar a {
          background-color: #ffffff !important;
          color: #1e293b !important;
          border: 1px solid #e2e8f0 !important;
          border-bottom: none !important;
        }
        .leaflet-bar a:first-child {
          border-top-left-radius: 8px !important;
          border-top-right-radius: 8px !important;
        }
        .leaflet-bar a:last-child {
          border-bottom-left-radius: 8px !important;
          border-bottom-right-radius: 8px !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        /* Pulsing user current location marker styling */
        .user-pulse-marker {
          position: relative;
          width: 20px;
          height: 20px;
        }
        .user-pulse-marker::before {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #2563eb;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
          top: 3px;
          left: 3px;
          z-index: 10;
        }
        .user-pulse-marker::after {
          content: '';
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.45);
          top: -6px;
          left: -6px;
          animation: radar 2s infinite ease-out;
          z-index: 1;
        }
        @keyframes radar {
          0% { transform: scale(0.4); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* Pulsing red beacon marker for problems */
        .problem-beacon-marker {
          position: relative;
          width: 30px;
          height: 30px;
        }
        .problem-beacon-core {
          width: 18px;
          height: 18px;
          border-radius: 50% 50% 50% 0;
          background: #ef4444;
          transform: rotate(-45deg);
          position: absolute;
          top: 4px;
          left: 4px;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          z-index: 10;
        }
        .problem-beacon-core::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
          top: 6px;
          left: 6px;
        }
        .problem-beacon-pulse {
          position: absolute;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.35);
          top: -8px;
          left: -8px;
          animation: radar-red 2s infinite ease-out;
          z-index: 1;
        }
        @keyframes radar-red {
          0% { transform: scale(0.4); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      </style>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const start = ${startCoords ? JSON.stringify(startCoords) : 'null'};
        const end = ${JSON.stringify(endCoords)};

        try {
          // Initialize map centered at problem
          const map = L.map('map', {
            zoomControl: true,
            attributionControl: false
          }).setView([end.latitude, end.longitude], 14);

          // Render clean CARTO Voyager tiles (premium minimalist Mapcn look)
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);

          // Render issue destination marker (red pulsing beacon)
          const problemIcon = L.divIcon({
            className: 'problem-beacon-marker',
            html: '<div class="problem-beacon-pulse"></div><div class="problem-beacon-core"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          const problemMarker = L.marker([end.latitude, end.longitude], { icon: problemIcon }).addTo(map);
          problemMarker.bindPopup('<b>Problem Location</b>').openPopup();

          const bounds = L.latLngBounds([[end.latitude, end.longitude]]);

          // If Team Leader's start GPS coords are available, render start pin and routing path
          if (start && start.latitude && start.longitude) {
            // User location pulse marker
            const userIcon = L.divIcon({
              className: 'user-pulse-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            const userMarker = L.marker([start.latitude, start.longitude], { icon: userIcon }).addTo(map);
            userMarker.bindPopup('<b>Your Location</b>');

            bounds.extend([start.latitude, start.longitude]);

            // Call standard OSRM driving engine API to construct route (chemin) with steps
            const osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + 
              start.longitude + ',' + start.latitude + ';' + 
              end.longitude + ',' + end.latitude + '?overview=full&geometries=geojson&steps=true';

            fetch(osrmUrl)
              .then(res => res.json())
              .then(data => {
                if (data.routes && data.routes.length > 0) {
                  const route = data.routes[0];
                  const routeGeometry = route.geometry;
                  const coords = routeGeometry.coordinates.map(c => [c[1], c[0]]); // Leaflet is [lat, lng]
                  
                  // Sleek, glowing dual polyline path styling
                  // 1. Semi-transparent thick outer route glow
                  const glowPath = L.polyline(coords, {
                    color: '#60a5fa',
                    weight: 12,
                    opacity: 0.45,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }).addTo(map);

                  // 2. Sharp solid vibrant inner path core
                  const corePath = L.polyline(coords, {
                    color: '#2563eb',
                    weight: 5,
                    opacity: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }).addTo(map);

                  map.fitBounds(corePath.getBounds(), { padding: [50, 50] });

                  // Communicate route data back to React Native host
                  const payload = {
                    type: 'route_info',
                    distance: route.distance,
                    duration: route.duration,
                    instructions: route.legs[0].steps.map(s => ({
                      type: s.maneuver.type,
                      modifier: s.maneuver.modifier,
                      instruction: s.maneuver.instruction,
                      distance: s.distance
                    }))
                  };
                  
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
                  } else {
                    window.parent.postMessage(JSON.stringify(payload), '*');
                  }
                } else {
                  map.fitBounds(bounds, { padding: [50, 50] });
                }
              })
              .catch(err => {
                console.error("OSRM Route fetch error:", err);
                map.fitBounds(bounds, { padding: [50, 50] });
              });
          } else {
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        } catch (error) {
          console.error("Leaflet initiation error:", error);
        }
      </script>
    </body>
    </html>
  `;

  // Callback to hide loader
  const handleMapLoaded = () => {
    setLoading(false);
  };

  const handleMessage = (event: any) => {
    try {
      const payload = typeof event.nativeEvent.data === 'string' 
        ? JSON.parse(event.nativeEvent.data) 
        : event.nativeEvent.data;
      if (payload && payload.type === 'route_info') {
        onRouteUpdate?.(payload.distance, payload.duration, payload.instructions);
      }
    } catch (e) {}
  };

  return (
    <View style={[styles.container, { height }]}>
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={htmlContent}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="OpenStreetMap Embedded Navigation"
          onLoad={handleMapLoaded}
        />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          onLoadEnd={handleMapLoaded}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      )}
      
      {loading && (
        <View style={[StyleSheet.absoluteFillObject, styles.loaderContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Loading live route...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});
