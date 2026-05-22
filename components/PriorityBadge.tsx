import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getPriorityColor } from '../theme';
import { getPriorityLabel, Language } from '../i18n/strings';

interface PriorityBadgeProps {
  priority: number;
  lang: Language;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, lang }) => {
  const color = getPriorityColor(priority);
  const label = getPriorityLabel(priority, lang);
  const isAr = lang === 'ar';

  return (
    <View 
      style={[
        styles.container, 
        { flexDirection: isAr ? 'row-reverse' : 'row' }
      ]} 
      accessibilityLabel={label} 
      accessibilityRole="text"
    >
      <View style={[styles.dot, { backgroundColor: color }, isAr ? { marginLeft: 6 } : { marginRight: 6 }]} />
      <Text 
        style={[
          styles.label, 
          { color, fontFamily: isAr ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
