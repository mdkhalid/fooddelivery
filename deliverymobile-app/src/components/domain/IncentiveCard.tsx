import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Incentive } from '../../types/earnings.types';
import { formatCurrency } from '../../utils/format';

interface IncentiveCardProps { incentive: Incentive; }

export const IncentiveCard: React.FC<IncentiveCardProps> = ({ incentive }) => {
  const progress = Math.min(incentive.progress / incentive.target, 1);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={20} color={colors.warning} />
        <Text style={styles.title}>{incentive.title}</Text>
      </View>
      <Text style={styles.description}>{incentive.description}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.progress}>{incentive.progress}/{incentive.target}</Text>
        <Text style={styles.reward}>{formatCurrency(incentive.reward)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.warning + '40' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  title: { ...typography.variants.h5, color: colors.text },
  description: { ...typography.variants.body2, color: colors.gray500, marginBottom: spacing.md },
  progressBar: { height: 6, backgroundColor: colors.gray200, borderRadius: 3, marginBottom: spacing.sm },
  progressFill: { height: '100%', backgroundColor: colors.warning, borderRadius: 3 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  progress: { ...typography.variants.body3, color: colors.gray600 },
  reward: { ...typography.variants.body3, color: colors.success, fontWeight: typography.weights.bold },
});
