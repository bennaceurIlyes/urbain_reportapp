import React from 'react';
import { View, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import Svg, { Path, Pattern, Rect, Defs } from 'react-native-svg';

interface GovHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  badge?: number | string;
}

/** Zellij-inspired geometric overlay pattern */
const ZellijPattern = () => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="zellij" patternUnits="userSpaceOnUse" width="40" height="40">
        <Path
          d="M0 20 L20 0 L40 20 L20 40 Z"
          stroke="white"
          strokeWidth="0.5"
          fill="none"
          opacity="0.07"
        />
        <Path
          d="M10 10 L20 0 L30 10 L20 20 Z"
          stroke="white"
          strokeWidth="0.3"
          fill="none"
          opacity="0.05"
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#zellij)" />
  </Svg>
);

export const GovHeader: React.FC<GovHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
  badge,
}) => {
  const insets = useSafeAreaInsets();
  const { lang, isRTL } = useLanguage();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.republicGreen} />
      <LinearGradient
        colors={[colors.republicGreen, colors.activeGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { paddingTop: insets.top + spacing.sm }]}
      >
        <ZellijPattern />
        
        <View style={[styles.headerRow, isRTL && styles.headerRowRTL]}>
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              accessibilityLabel={isRTL ? 'العودة' : 'Retour'}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name={isRTL ? 'chevron-right' : 'chevron-left'}
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}
          
          <View style={[styles.titleContainer, isRTL && styles.titleContainerRTL]}>
            <View style={[styles.titleRow, isRTL && styles.titleRowRTL]}>
              <Text style={[styles.title, isRTL && styles.titleRTL]}>{title}</Text>
              {badge !== undefined && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            {subtitle && (
              <Text style={[styles.subtitle, isRTL && styles.subtitleRTL]}>{subtitle}</Text>
            )}
          </View>

          {rightElement ? (
            <View style={styles.rightSlot}>{rightElement}</View>
          ) : showBack ? (
            <View style={{ width: 44 }} />
          ) : null}
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRowRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  titleContainerRTL: {
    marginLeft: 0,
    marginRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRowRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  titleRTL: {
    textAlign: 'right',
  },
  badge: {
    backgroundColor: colors.governmentGold,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    textAlign: 'left',
  },
  subtitleRTL: {
    textAlign: 'right',
  },
  rightSlot: {
    marginLeft: spacing.sm,
  },
});
