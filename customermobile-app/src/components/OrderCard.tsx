import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../types/order.types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { formatCurrency, formatDate } from '../utils/format';
import { Badge } from './ui/Badge';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const statusColors: Record<string, string> = {
  pending: colors.orderStatus.pending,
  confirmed: colors.orderStatus.confirmed,
  preparing: colors.orderStatus.preparing,
  ready_for_pickup: colors.orderStatus.ready,
  picked_up: colors.orderStatus.pickedUp,
  out_for_delivery: colors.orderStatus.outForDelivery,
  delivered: colors.orderStatus.delivered,
  cancelled: colors.orderStatus.cancelled,
  failed: colors.orderStatus.cancelled,
  refunded: colors.orderStatus.refunded,
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
        <View style={styles.headerInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>{order.restaurantName}</Text>
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>
        <Badge
          value={order.status.replace('_', ' ')}
          variant="primary"
          size="sm"
        />
      </View>
      <View style={styles.items}>
        {order.items.slice(0, 2).map((item) => (
          <Text key={item.id} style={styles.itemText} numberOfLines={1}>
            {item.quantity}x {item.name}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreText}>+{order.items.length - 2} more items</Text>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
        {order.status === 'delivered' && (
          <TouchableOpacity style={styles.reorderButton}>
            <Ionicons name="refresh-outline" size={16} color={colors.primary} />
            <Text style={styles.reorderText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  restaurantImage: { width: 48, height: 48, borderRadius: borderRadius.md, backgroundColor: colors.gray200 },
  headerInfo: { flex: 1, marginLeft: spacing.md },
  restaurantName: { ...typography.variants.body1, color: colors.text, fontWeight: typography.weights.medium },
  date: { ...typography.variants.caption, color: colors.textSecondary, marginTop: spacing.xxs },
  items: { marginBottom: spacing.md },
  itemText: { ...typography.variants.body2, color: colors.textSecondary, marginBottom: spacing.xxs },
  moreText: { ...typography.variants.caption, color: colors.primary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { ...typography.variants.h4, color: colors.text },
  reorderButton: { flexDirection: 'row', alignItems: 'center' },
  reorderText: { ...typography.variants.body2, color: colors.primary, marginLeft: spacing.xs },
});
