import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface ShiftTimerProps { duration: string; isActive: boolean; }

export const ShiftTimer: React.FC<ShiftTimerProps> = ({ duration, isActive }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Shift Duration</Text>
      <Text style={[styles.time, isActive && styles.timeActive]}>{duration}</Text>
      {isActive && <View style={styles.activeIndicator}><View style={styles.activeDot} /><Text style={styles.activeText}>On Shift</Text></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.lg },
  label: { ...typography.variants.caption, color: colors.gray500, marginBottom: spacing.xs },
  time: { ...typography.variants.h2, color: colors.text, fontWeight: typography.weights.bold, fontVariant: ['tabular-nums'] },
  timeActive: { color: colors.success },
  activeIndicator: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  activeText: { ...typography.variants.body3, color: colors.success, fontWeight: typography.weights.medium },
});
