import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';

export const SkeletonCard = () => {
  const theme = useTheme();
  const skeletonColor = theme.colors.surfaceVariant;

  return (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={[styles.shimmer, { width: '70%', height: 24, backgroundColor: skeletonColor }]} />
          <View style={[styles.shimmer, { width: '40%', height: 16, marginTop: 8, backgroundColor: skeletonColor }]} />
        </View>
        <View style={[styles.shimmer, { width: 80, height: 28, borderRadius: 14, backgroundColor: skeletonColor }]} />
      </View>
      
      <View style={styles.content}>
        <View style={[styles.shimmer, { width: '100%', height: 16, backgroundColor: skeletonColor }]} />
        <View style={[styles.shimmer, { width: '90%', height: 16, marginTop: 8, backgroundColor: skeletonColor }]} />
      </View>
      
      <View style={[styles.image, { backgroundColor: skeletonColor }]} />
      
      <View style={styles.footer}>
        <View style={[styles.shimmer, { width: '30%', height: 16, backgroundColor: skeletonColor }]} />
        <View style={[styles.shimmer, { width: '15%', height: 16, backgroundColor: skeletonColor }]} />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  content: { marginBottom: 16 },
  image: { height: 180, width: '100%', borderRadius: 12, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  shimmer: { borderRadius: 4 }
});

