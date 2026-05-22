import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, shadows } from '../theme';

/** Shimmer effect skeleton card for loading states */
export const SkeletonCard: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.card}>
      {/* Priority bar skeleton */}
      <View style={styles.priorityBar} />
      
      <View style={styles.content}>
        {/* Title row */}
        <View style={styles.topRow}>
          <View style={styles.titleSkeleton}>
            <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <View style={styles.badgeSkeleton}>
            <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>

        {/* Description lines */}
        <View style={styles.line1}>
          <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <View style={styles.line2}>
          <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.metaSkeleton}>
            <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <View style={styles.thumbSkeleton}>
            <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

const skeletonBg = '#EAEAEA';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md, // 8px Modest rounding
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    overflow: 'hidden',
    flexDirection: 'row',
    ...shadows.card,
  },
  priorityBar: {
    width: 4,
    backgroundColor: skeletonBg,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleSkeleton: {
    height: 16,
    width: '55%',
    backgroundColor: skeletonBg,
    borderRadius: radius.xs,
    overflow: 'hidden',
  },
  badgeSkeleton: {
    height: 22,
    width: 65,
    backgroundColor: skeletonBg,
    borderRadius: radius.xs,
    overflow: 'hidden',
  },
  line1: {
    height: 12,
    width: '90%',
    backgroundColor: skeletonBg,
    borderRadius: radius.xs,
    marginBottom: 8,
    overflow: 'hidden',
  },
  line2: {
    height: 12,
    width: '70%',
    backgroundColor: skeletonBg,
    borderRadius: radius.xs,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider, // Clean hairline divider
  },
  metaSkeleton: {
    height: 12,
    width: 80,
    backgroundColor: skeletonBg,
    borderRadius: radius.xs,
    overflow: 'hidden',
  },
  thumbSkeleton: {
    width: 60,
    height: 60,
    borderRadius: radius.xs,
    backgroundColor: skeletonBg,
    overflow: 'hidden',
  },
  shimmer: {
    width: 200,
    height: '100%',
  },
});
