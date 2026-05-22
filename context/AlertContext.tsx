import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, spacing, shadows } from '../theme';
import { useLanguage } from '../hooks/useLanguage';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertOptions {
  title: string;
  message: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
}

interface AlertContextData {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextData | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRTL, lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({ title: '', message: '' });

  const showAlert = useCallback((opts: AlertOptions) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setVisible(false);
  }, []);

  const handleButtonPress = (onPress?: () => void) => {
    hideAlert();
    if (onPress) {
      setTimeout(() => {
        onPress();
      }, 100);
    }
  };

  const renderButtons = () => {
    const buttons = options.buttons && options.buttons.length > 0 
      ? options.buttons 
      : [{ text: lang === 'ar' ? 'تم' : 'OK', style: 'default' as const }];

    return (
      <View style={[styles.buttonContainer, isRTL && styles.buttonContainerRTL]}>
        {buttons.map((btn, index) => {
          const isCancel = btn.style === 'cancel';
          const isDestructive = btn.style === 'destructive';
          
          let buttonBg = colors.primary;
          let buttonText = colors.textOnBlue;
          let buttonBorder = colors.primary;

          if (isCancel) {
            buttonBg = colors.white;
            buttonText = colors.textSecondary;
            buttonBorder = colors.borderMedium;
          } else if (isDestructive) {
            buttonBg = colors.error || '#D63C3C';
            buttonText = colors.white;
            buttonBorder = colors.error || '#D63C3C';
          }

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                {
                  backgroundColor: buttonBg,
                  borderColor: buttonBorder,
                  flex: buttons.length > 2 ? undefined : 1,
                  minWidth: buttons.length > 2 ? '100%' : undefined,
                  marginBottom: buttons.length > 2 ? spacing.xs : 0,
                }
              ]}
              onPress={() => handleButtonPress(btn.onPress)}
              accessibilityRole="button"
              accessibilityLabel={btn.text}
            >
              <Text 
                style={[
                  styles.buttonText, 
                  { 
                    color: buttonText,
                    fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold'
                  }
                ]}
              >
                {btn.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={options.cancelable !== false ? hideAlert : undefined}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            activeOpacity={1} 
            style={StyleSheet.absoluteFill} 
            onPress={options.cancelable !== false ? hideAlert : undefined} 
          />
          <View style={styles.alertCard}>
            {/* Header Accent Line */}
            <View style={styles.accentLine} />
            
            <ScrollView 
              style={styles.scrollContent} 
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text 
                style={[
                  styles.title,
                  isRTL && styles.titleRTL,
                  { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }
                ]}
              >
                {options.title}
              </Text>
              
              <Text 
                style={[
                  styles.message,
                  isRTL && styles.messageRTL,
                  { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }
                ]}
              >
                {options.message}
              </Text>
            </ScrollView>

            {renderButtons()}
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 31, 45, 0.45)', // Premium dark blue-gray backdrop overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  alertCard: {
    width: Math.min(width - spacing.xl * 2, 340),
    backgroundColor: colors.white,
    borderRadius: radius.lg, // 12px rounding
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.card,
  },
  accentLine: {
    height: 4,
    backgroundColor: colors.primary, // Lighter blue accent top bar
  },
  scrollContent: {
    maxHeight: 240,
  },
  scrollContentContainer: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'left',
  },
  titleRTL: {
    textAlign: 'right',
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'left',
  },
  messageRTL: {
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.primaryUltraLight,
  },
  buttonContainerRTL: {
    flexDirection: 'row-reverse',
  },
  button: {
    height: 40,
    borderRadius: radius.sm, // 6px rounded button layout
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
