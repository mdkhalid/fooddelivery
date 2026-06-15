import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Order } from '../../types/order.types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { useDeliveryTimer } from '../../hooks/useDeliveryTimer';

interface ActiveDeliveryCardProps { order: Order; onNavigate: () => void; onAction: () => void; actionLabel: string; }

export const ActiveDeliveryCard: React.FC<ActiveDeliveryCardProps> = ({ order, onNavigate, onAction, actionLabel }) => {
  const { formattedTime } = useDeliveryTimer();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <OrderStatusBadge status={order.status} />
        <Text style={styles.timer}>{formattedTime}</Text>
      </View>
      <Text style={styles.restaurant}>{order.restaurant.name}</Text>
      <Text style={styles.address} numberOfLines={1}>{order.status === 'picked_up' || order.status === 'out_for_delivery' ? order.deliveryAddress.address : order.restaurant.address}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.navigateButton} onPress={onNavigate}><Ionicons name="navigate" size={20} color={colors.primary} /><Text style={styles.navigateText}>Navigate</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onAction}><Text style={styles.actionText}>{actionLabel}</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.primary + '40' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  timer: { ...typography.variants.h4, color: colors.primary, fontWeight: typography.weights.bold },
  restaurant: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.xs },
  address: { ...typography.variants.body2, color: colors.gray500, marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.md },
  navigateButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.primary },
  navigateText: { ...typography.variants.button, color: colors.primary },
  actionButton: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: borderRadius.md, backgroundColor: colors.primary },
  actionText: { ...typography.variants.button, color: colors.white },
});
