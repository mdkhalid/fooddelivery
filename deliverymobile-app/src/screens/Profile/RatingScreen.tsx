import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { RatingStars } from '../../components/domain/RatingStars';
import { RatingCard } from '../../components/domain/RatingCard';
import { useRatings } from '../../hooks/useRatings';

export const RatingScreen: React.FC = () => {
  const { ratings, summary } = useRatings();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Ratings</Text>
        {summary && (
          <View style={styles.summaryCard}>
            <Text style={styles.ratingNumber}>{summary.averageRating.toFixed(1)}</Text>
            <RatingStars rating={Math.round(summary.averageRating)} size={28} />
            <Text style={styles.totalRatings}>{summary.totalRatings} ratings</Text>
            <View style={styles.breakdown}>
              {summary.breakdown.map(item => (
                <View key={item.stars} style={styles.breakdownRow}>
                  <Text style={styles.starLabel}>{item.stars}</Text>
                  <View style={styles.bar}><View style={[styles.barFill, { width: `${(item.count / summary.totalRatings) * 100}%` as any }]} /></View>
                  <Text style={styles.countLabel}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {ratings.map(rating => <RatingCard key={rating.id} rating={rating} />)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.xl },
  summaryCard: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.xl },
  ratingNumber: { ...typography.variants.h1, color: colors.text, fontWeight: typography.weights.bold, marginBottom: spacing.sm },
  totalRatings: { ...typography.variants.body2, color: colors.gray500, marginTop: spacing.sm, marginBottom: spacing.lg },
  breakdown: { width: '100%' },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  starLabel: { ...typography.variants.body3, color: colors.gray600, width: 16 },
  bar: { flex: 1, height: 8, backgroundColor: colors.gray200, borderRadius: 4 },
  barFill: { height: '100%', backgroundColor: colors.warning, borderRadius: 4 },
  countLabel: { ...typography.variants.body3, color: colors.gray500, width: 24, textAlign: 'right' },
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.lg },
});
