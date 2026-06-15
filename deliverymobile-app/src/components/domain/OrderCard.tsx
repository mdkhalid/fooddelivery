import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Order } from '../../types/order.types';
import { formatDistance, formatCurrency } from '../../utils/format';

interface OrderCardProps { order: Order; onAccept?: () => void; onReject?: () => void; onPress?: () => void; showActions?: boolean; }

export const OrderCard: React.FC<OrderCardProps> = ({ order, onAccept, onReject, onPress, showActions = true }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
        <Text style={styles.earnings}>{formatCurrency(order.deliveryFee + order.tip)}</Text>
      </View>
      <Text style={styles.address} numberOfLines={1}>{order.restaurant.address}</Text>
      <View style={styles.details}>
        <View style={styles.detailItem}><Ionicons name="location" size={16} color={colors.primary} /><Text style={styles.detailText}>{formatDistance(order.distance)}</Text></View>
        <View style={styles.detailItem}><Ionicons name="time" size={16} color={colors.gray500} /><Text style={styles.detailText}>{order.items.length} items</Text></View>
        {order.paymentMethod === 'cash' && <View style={styles.cashBadge}><Text style={styles.cashText}>COD</Text></View>}
      </View>
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject}><Text style={styles.rejectText}>Reject</Text></TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}><Text style={styles.acceptText}>Accept</Text></TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.gray200 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  restaurantName: { ...typography.variants.h5, color: colors.text, flex: 1 },
  earnings: { ...typography.variants.h5, color: colors.success, fontWeight: typography.weights.bold },
  address: { ...typography.variants.body2, color: colors.gray500, marginBottom: spacing.md },
  details: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  detailText: { ...typography.variants.body3, color: colors.gray600 },
  cashBadge: { backgroundColor: colors.warning + '20', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.xs },
  cashText: { ...typography.variants.small, color: colors.warning, fontWeight: typography.weights.semibold },
  actions: { flexDirection: 'row', gap: spacing.md },
  rejectButton: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.gray300 },
  rejectText: { ...typography.variants.button, color: colors.gray600 },
  acceptButton: { flex: 2, paddingVertical: spacing.md, alignItems: 'center', borderRadius: borderRadius.md, backgroundColor: colors.primary },
  acceptText: { ...typography.variants.button, color: colors.white },
});
