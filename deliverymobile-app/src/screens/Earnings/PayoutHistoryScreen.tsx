import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { PayoutCard } from '../../components/domain/PayoutCard';
import { usePayouts } from '../../hooks/usePayouts';

export const PayoutHistoryScreen: React.FC = () => {
  const { payouts, isLoading } = usePayouts();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={payouts} keyExtractor={item => item.id} contentContainerStyle={styles.list} ListHeaderComponent={<Text style={styles.title}>Payout History</Text>} renderItem={({ item }) => <PayoutCard payout={item} />} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>{isLoading ? 'Loading...' : 'No payouts yet'}</Text></View>} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.xl },
  empty: { alignItems: 'center', marginTop: spacing.xxxl },
  emptyText: { ...typography.variants.body1, color: colors.gray500 },
});
