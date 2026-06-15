import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { EarningsBreakdown } from '../../types/earnings.types';
import { formatCurrency } from '../../utils/format';

interface EarningsSummaryProps { title: string; data: EarningsBreakdown; }

export const EarningsSummary: React.FC<EarningsSummaryProps> = ({ title, data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.total}>{formatCurrency(data.total)}</Text>
      <View style={styles.breakdown}>
        <View style={styles.row}><Text style={styles.label}>Delivery Fees</Text><Text style={styles.value}>{formatCurrency(data.deliveryFees)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Tips</Text><Text style={styles.value}>{formatCurrency(data.tips)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Bonuses</Text><Text style={styles.value}>{formatCurrency(data.bonuses)}</Text></View>
        {data.deductions > 0 && <View style={styles.row}><Text style={styles.deductionLabel}>Deductions</Text><Text style={styles.deductionValue}>-{formatCurrency(data.deductions)}</Text></View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  title: { ...typography.variants.body2, color: colors.gray500, marginBottom: spacing.xs },
  total: { ...typography.variants.h1, color: colors.text, fontWeight: typography.weights.bold, marginBottom: spacing.lg },
  breakdown: { gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...typography.variants.body2, color: colors.gray600 },
  value: { ...typography.variants.body2, color: colors.text, fontWeight: typography.weights.medium },
  deductionLabel: { ...typography.variants.body2, color: colors.danger },
  deductionValue: { ...typography.variants.body2, color: colors.danger, fontWeight: typography.weights.medium },
});
