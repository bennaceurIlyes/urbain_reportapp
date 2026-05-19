import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      case 'secondary': return '#1A1A2E';
      case 'outline': return '#006233';
      case 'link': return '#006233';
      default: return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
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
        <View style={styles.content}>
          {icon && (
            <MaterialCommunityIcons 
              name={icon} 
              size={20} 
              color={getTextColor()} 
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  primary: {
    backgroundColor: '#006233',
    shadowColor: '#006233',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  secondary: {
    backgroundColor: '#F2F2F7',
    borderWidth: 0,
  },
  outline: {
    borderColor: '#006233',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    height: 'auto' as any,
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 0,
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
  },
});
