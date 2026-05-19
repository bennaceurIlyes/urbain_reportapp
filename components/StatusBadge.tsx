import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, borderRadius } from '../theme';
import { getStatusLabel, Language } from '../i18n/strings';
import { getStatusColor } from '../theme';

interface StatusBadgeProps {
  status: string | number;
  lang: Language;
  is_resolved?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, lang, is_resolved }) => {
  const color = getStatusColor(status, is_resolved);
  const label = getStatusLabel(status, lang, is_resolved);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + '18' },
      ]}
      accessibilityLabel={label}
      accessibilityRole="text"
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.badge,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
