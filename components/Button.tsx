import React, { useRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, StyleProp, ActivityIndicator, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../theme';
import { useLanguage } from '../hooks/useLanguage';

interface ButtonProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  loading, 
  variant = 'primary', 
  onPress, 
  style, 
  disabled,
  icon
}) => {
  const { isRTL } = useLanguage();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getButtonStyle = () => {
    switch(variant) {
      case 'primary': return styles.primary;
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      case 'link': return styles.link;
      default: return styles.primary;
    }
  };

  const getTextColor = () => {
    switch(variant) {
      case 'secondary': return colors.primary;
      case 'outline': return colors.primary;
      case 'link': return colors.primary;
      default: return colors.textOnBlue;
    }
  };

  const onPressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 3,
    }).start();
  };

  const onPressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 3,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: variant === 'link' ? 'auto' : '100%' }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.base,
          getButtonStyle(),
          (disabled || loading) && styles.disabled,
          style
        ]}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <View style={[styles.content, isRTL && styles.contentRTL]}>
            {icon && (
              <MaterialCommunityIcons 
                name={icon} 
                size={20} 
                color={getTextColor()} 
                style={styles.icon}
              />
            )}
            <Text style={[
              styles.text, 
              { 
                color: getTextColor(),
                fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold'
              }
            ]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52, // Large, premium touch-friendly button
    width: '100%',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.button, // Fully rounded-2xl (16px) style
    borderWidth: 0,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.elevated,
  },
  secondary: {
    backgroundColor: colors.primaryTint,
    borderWidth: 0,
  },
  outline: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    height: 'auto' as any,
    paddingHorizontal: 0,
    width: 'auto',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.surfaceGray,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentRTL: {
    flexDirection: 'row-reverse',
  },
  icon: {
    marginRight: 0,
  },
  text: {
    fontSize: 15,
  },
});
