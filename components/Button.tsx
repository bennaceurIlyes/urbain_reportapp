import React from 'react';
import { 
  Button as GButton, 
  ButtonText, 
  ButtonSpinner,
  ButtonIcon,
  HStack
} from '@gluestack-ui/themed';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface ButtonProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  icon?: any;
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
  const getAction = () => {
    switch(variant) {
      case 'primary': return 'primary';
      case 'secondary': return 'secondary';
      case 'outline': return 'outline';
      case 'link': return 'link';
      default: return 'primary';
    }
  };

  return (
    <GButton
      size="lg"
      variant={variant === 'outline' || variant === 'link' ? variant : 'solid'}
      action={getAction() as any}
      isDisabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        style
      ]}
      borderRadius="$full"
    >
      {loading ? (
        <ButtonSpinner color={variant === 'outline' ? '#006233' : '$white'} />
      ) : (
        <HStack space="xs" alignItems="center">
          {icon && <ButtonIcon as={icon} size="md" color={variant === 'outline' ? '#006233' : '$white'} />}
          <ButtonText 
            fontWeight="$bold" 
            fontSize="$md"
            color={variant === 'secondary' ? '$textLight900' : variant === 'outline' ? '#006233' : '$white'}
          >
            {title}
          </ButtonText>
        </HStack>
      )}
    </GButton>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
});

