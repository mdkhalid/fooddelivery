import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { EarningEntry } from '../../types/earnings.types';
import { formatCurrency } from '../../utils/format';

interface EarningsChartProps { data: EarningEntry[]; }

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - spacing.xl * 2;

export const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  if (data.length === 0) return <View style={styles.empty}><Text style={styles.emptyText}>No earnings data</Text></View>;
  const maxEarning = Math.max(...data.map(d => d.total));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earnings Trend</Text>
      <View style={styles.chart}>
        {data.slice(-7).map((item, index) => (
          <View key={item.id} style={styles.barContainer}>
            <View style={[styles.bar, { height: (item.total / maxEarning) * 100 }]} />
            <Text style={styles.barLabel}>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  title: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.lg },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barContainer: { alignItems: 'center', flex: 1 },
  bar: { width: 24, backgroundColor: colors.primary, borderRadius: borderRadius.xs },
  barLabel: { ...typography.variants.small, color: colors.gray500, marginTop: spacing.xs },
  empty: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center' },
  emptyText: { ...typography.variants.body2, color: colors.gray500 },
});
