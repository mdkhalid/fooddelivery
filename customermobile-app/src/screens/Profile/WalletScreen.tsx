import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../hooks';
import { Card, Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatCurrency } from '../../utils/format';

export const WalletScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { balance, isLoading } = useWallet();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
          <Button title="Top Up" onPress={() => {}} style={styles.topUpButton} />
        </Card>

        <Card style={styles.historyCard}>
          <Text style={styles.historyTitle}>Transaction History</Text>
          <View style={styles.emptyHistory}>
            <Ionicons name="receipt-outline" size={48} color={colors.gray300} />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  title: { ...typography.variants.h4, color: colors.text },
  content: { padding: spacing.xl },
  balanceCard: { alignItems: 'center', paddingVertical: spacing.xxxl, marginBottom: spacing.xl },
  balanceLabel: { ...typography.variants.body2, color: colors.textSecondary },
  balanceValue: { ...typography.variants.h1, color: colors.primary, marginTop: spacing.sm },
  topUpButton: { marginTop: spacing.xl },
  historyCard: { padding: spacing.xl },
  historyTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.lg },
  emptyHistory: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyText: { ...typography.variants.body2, color: colors.textSecondary, marginTop: spacing.md },
});
