import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { EarningsSummary } from '../../components/domain/EarningsSummary';
import { EarningsChart } from '../../components/domain/EarningsChart';
import { IncentiveCard } from '../../components/domain/IncentiveCard';
import { useEarnings } from '../../hooks/useEarnings';

export const EarningsScreen: React.FC = () => {
  const { summary, earnings, incentives, isLoading } = useEarnings();

  if (isLoading) return <View style={styles.loading}><Text style={styles.loadingText}>Loading earnings...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Earnings</Text>
        {summary && (
          <View style={styles.summaries}>
            <EarningsSummary title="Today" data={summary.today} />
            <EarningsSummary title="This Week" data={summary.week} />
            <EarningsSummary title="This Month" data={summary.month} />
          </View>
        )}
        <EarningsChart data={earnings} />
        {incentives.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Active Incentives</Text>
            {incentives.map(incentive => <IncentiveCard key={incentive.id} incentive={incentive} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...typography.variants.body1, color: colors.gray500 },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.xl },
  summaries: { gap: spacing.md, marginBottom: spacing.lg },
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.lg, marginTop: spacing.md },
});
