import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface DeliveryTimerProps { time: string; label?: string; }

export const DeliveryTimer: React.FC<DeliveryTimerProps> = ({ time, label = 'Elapsed Time' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.md },
  label: { ...typography.variants.caption, color: colors.gray500, marginBottom: spacing.xs },
  time: { ...typography.variants.h1, color: colors.text, fontWeight: typography.weights.bold, fontVariant: ['tabular-nums'] },
});
