import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme';
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 2,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  pillActive: {
    backgroundColor: '#FFFFFF',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  pillTextActive: {
    color: colors.republicGreen,
  },
});
