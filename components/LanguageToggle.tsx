import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../i18n/strings';

export const LanguageToggle: React.FC = () => {
  const { lang, setLanguage } = useLanguage();

  const handleToggle = (newLang: Language) => {
    if (newLang !== lang) {
      setLanguage(newLang);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.pill, lang === 'ar' && styles.pillActive]}
        onPress={() => handleToggle('ar')}
        accessibilityLabel="العربية"
        accessibilityRole="button"
      >
        <Text style={[styles.pillText, lang === 'ar' && styles.pillTextActive]}>AR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.pill, lang === 'fr' && styles.pillActive]}
        onPress={() => handleToggle('fr')}
        accessibilityLabel="Français"
        accessibilityRole="button"
      >
        <Text style={[styles.pillText, lang === 'fr' && styles.pillTextActive]}>FR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6, // Modest radius matching buttons
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pillActive: {
    backgroundColor: '#FFFFFF',
  },
  pillText: {
    fontSize: 11,
    fontFamily: 'IBMPlexSans-Bold',
    color: 'rgba(255,255,255,0.85)',
  },
  pillTextActive: {
    color: colors.primary,
  },
});
