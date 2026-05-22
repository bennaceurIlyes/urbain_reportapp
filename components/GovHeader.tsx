import React from 'react';
import { View, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import Svg, { Path } from 'react-native-svg';

interface GovHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  badge?: number | string;
}

const WaterDropIcon = () => (
  <Svg width={22} height={28} viewBox="0 0 22 28">
    <Path
      d="M11 0 C11 0 1 12 1 18 C1 23.5 5.5 27 11 27 C16.5 27 21 23.5 21 18 C21 12 11 0 11 0 Z"
      fill="rgba(255,255,255,0.90)"
    />
    <Path
      d="M11 10 Q8 16 8 18 Q8 21 11 22 Q14 21 14 18 Q14 16 11 10 Z"
      fill="rgba(255,255,255,0.30)"
    />
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

  const brandSubtitle = subtitle || (isRTL 
    ? 'وحدة بشار  ·  الجزائرية للمياه' 
    : 'ADE BÉCHAR  ·  ALGÉRIENNE DES EAUX'
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1A6FA3" />
      <LinearGradient
        colors={['#1A6FA3', '#0A4C78']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, { paddingTop: insets.top + spacing.sm }]}
      >
        {/* Thin bright blue accent bottom line */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: colors.primaryBorder,
          opacity: 0.6,
        }} />
        
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
          
          {/* Water drop logo element */}
          <View style={isRTL ? { marginLeft: spacing.xs } : { marginRight: spacing.xs }}>
            <WaterDropIcon />
          </View>

          <View style={[styles.titleContainer, isRTL && styles.titleContainerRTL]}>
            <View style={[styles.titleRow, isRTL && styles.titleRowRTL]}>
              <Text 
                style={[
                  styles.title, 
                  isRTL && styles.titleRTL,
                  { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }
                ]}
              >
                {title}
              </Text>
              {badge !== undefined && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            {brandSubtitle && (
              <Text 
                style={[
                  styles.subtitle, 
                  isRTL && styles.subtitleRTL,
                  { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }
                ]}
              >
                {brandSubtitle}
              </Text>
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
    padding: 8,
    marginRight: spacing.xs,
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
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: 0.2,
    lineHeight: 24,
    textAlign: 'left',
  },
  titleRTL: {
    textAlign: 'right',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    letterSpacing: 0.8,
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
