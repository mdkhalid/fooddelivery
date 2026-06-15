import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { OrderStatus } from '../../types/order.types';

interface OrderStatusBadgeProps { status: OrderStatus; }

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'assigned': return { label: 'New Order', color: colors.info, bg: colors.info + '20' };
    case 'accepted': return { label: 'Accepted', color: colors.primary, bg: colors.primary + '20' };
    case 'arrived_at_restaurant': return { label: 'At Restaurant', color: colors.warning, bg: colors.warning + '20' };
    case 'preparing': return { label: 'Preparing', color: colors.warning, bg: colors.warning + '20' };
    case 'ready_for_pickup': return { label: 'Ready', color: colors.success, bg: colors.success + '20' };
    case 'picked_up': return { label: 'Picked Up', color: colors.primary, bg: colors.primary + '20' };
    case 'out_for_delivery': return { label: 'Delivering', color: colors.info, bg: colors.info + '20' };
    case 'delivered': return { label: 'Delivered', color: colors.success, bg: colors.success + '20' };
    case 'failed_delivery': return { label: 'Failed', color: colors.danger, bg: colors.danger + '20' };
    case 'cancelled': return { label: 'Cancelled', color: colors.gray500, bg: colors.gray200 };
    default: return { label: status, color: colors.gray500, bg: colors.gray200 };
  }
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = getStatusConfig(status);
  return <View style={[styles.badge, { backgroundColor: config.bg }]}><Text style={[styles.text, { color: config.color }]}>{config.label}</Text></View>;
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.round, alignSelf: 'flex-start' },
  text: { ...typography.variants.caption, fontWeight: typography.weights.semibold },
});
