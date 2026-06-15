import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Payout } from '../../types/earnings.types';
import { formatCurrency, formatDate } from '../../utils/format';

interface PayoutCardProps { payout: Payout; }

const getStatusConfig = (status: Payout['status']) => {
  switch (status) {
    case 'completed': return { icon: 'checkmark-circle' as const, color: colors.success };
    case 'processing': return { icon: 'time' as const, color: colors.warning };
    case 'pending': return { icon: 'hourglass' as const, color: colors.info };
    case 'failed': return { icon: 'close-circle' as const, color: colors.danger };
    default: return { icon: 'help-circle' as const, color: colors.gray500 };
  }
};

export const PayoutCard: React.FC<PayoutCardProps> = ({ payout }) => {
  const config = getStatusConfig(payout.status);
  return (
    <View style={styles.container}>
      <View style={styles.icon}><Ionicons name={config.icon} size={24} color={config.color} /></View>
      <View style={styles.info}>
        <Text style={styles.amount}>{formatCurrency(payout.amount)}</Text>
        <Text style={styles.date}>{formatDate(payout.createdAt)}</Text>
      </View>
      <Text style={[styles.status, { color: config.color }]}>{payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  info: { flex: 1 },
  amount: { ...typography.variants.body1, fontWeight: typography.weights.semibold, color: colors.text },
  date: { ...typography.variants.caption, color: colors.gray500 },
  status: { ...typography.variants.body3, fontWeight: typography.weights.medium },
});
