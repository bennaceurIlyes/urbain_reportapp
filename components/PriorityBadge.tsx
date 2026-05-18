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

  return (
    <View style={styles.container} accessibilityLabel={label} accessibilityRole="text">
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
