import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { OrderStatusBadge } from '../../components/domain/OrderStatusBadge';
import { useOrderDetail } from '../../hooks/useOrderDetail';
import { useOrders } from '../../hooks/useOrders';
import { useNavigation as useNav } from '../../hooks/useNavigation';
import { formatCurrency, formatDistance } from '../../utils/format';
import { HomeStackParamList } from '../../types/navigation.types';

type OrderDetailRouteProp = RouteProp<HomeStackParamList, 'OrderDetail'>;

export const OrderDetailScreen: React.FC = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation();
  const { orderId } = route.params;
  const { order } = useOrderDetail(orderId);
  const { updateStatus, confirmPickup, confirmDelivery } = useOrders();
  const { openNavigation } = useNav();

  if (!order) return null;

  const handleAction = () => {
    const statusActions: Record<string, () => void> = {
      'accepted': () => openNavigation(order.restaurant.latitude, order.restaurant.longitude, order.restaurant.name),
      'arrived_at_restaurant': () => updateStatus({ orderId: order.id, status: 'ready_for_pickup' }),
      'ready_for_pickup': () => confirmPickup({ orderId: order.id }),
      'picked_up': () => openNavigation(order.deliveryAddress.latitude, order.deliveryAddress.longitude, order.deliveryAddress.address),
      'out_for_delivery': () => confirmDelivery({ orderId: order.id }),
    };
    statusActions[order.status]?.();
  };

  const getActionLabel = () => {
    const labels: Record<string, string> = { 'accepted': 'Navigate to Restaurant', 'arrived_at_restaurant': "I've Arrived", 'ready_for_pickup': 'Confirm Pickup', 'picked_up': 'Navigate to Customer', 'out_for_delivery': 'Mark Delivered' };
    return labels[order.status] || 'View';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.title}>Order #{order.orderNumber}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant</Text>
          <Text style={styles.name}>{order.restaurant.name}</Text>
          <Text style={styles.address}>{order.restaurant.address}</Text>
          <TouchableOpacity style={styles.link} onPress={() => openNavigation(order.restaurant.latitude, order.restaurant.longitude, order.restaurant.name)}>
            <Ionicons name="navigate" size={16} color={colors.primary} /><Text style={styles.linkText}>Open Navigation</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <Text style={styles.name}>{order.customer.name}</Text>
          <Text style={styles.address}>{order.deliveryAddress.address}</Text>
          {order.deliveryAddress.deliveryInstructions && <Text style={styles.instructions}>Note: {order.deliveryAddress.deliveryInstructions}</Text>}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemQty}>{item.quantity}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.summary}>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Distance</Text><Text style={styles.summaryValue}>{formatDistance(order.distance)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>{formatCurrency(order.deliveryFee)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tip</Text><Text style={styles.summaryValue}>{formatCurrency(order.tip)}</Text></View>
          <View style={[styles.summaryRow, styles.totalRow]}><Text style={styles.totalLabel}>Total Earning</Text><Text style={styles.totalValue}>{formatCurrency(order.deliveryFee + order.tip)}</Text></View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleAction}><Text style={styles.actionText}>{getActionLabel()}</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  title: { ...typography.variants.h4, color: colors.text, flex: 1 },
  section: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { ...typography.variants.body3, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  name: { ...typography.variants.h5, color: colors.text, marginBottom: spacing.xs },
  address: { ...typography.variants.body2, color: colors.gray600 },
  instructions: { ...typography.variants.body2, color: colors.warning, fontStyle: 'italic', marginTop: spacing.sm },
  link: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  linkText: { ...typography.variants.body2, color: colors.primary, fontWeight: typography.weights.medium },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  itemQty: { ...typography.variants.body2, color: colors.primary, fontWeight: typography.weights.semibold, width: 30 },
  itemName: { ...typography.variants.body2, color: colors.text, flex: 1 },
  itemPrice: { ...typography.variants.body2, color: colors.gray600 },
  summary: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  summaryLabel: { ...typography.variants.body2, color: colors.gray600 },
  summaryValue: { ...typography.variants.body2, color: colors.text, fontWeight: typography.weights.medium },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.gray200, marginTop: spacing.sm, paddingTop: spacing.md },
  totalLabel: { ...typography.variants.h5, color: colors.text },
  totalValue: { ...typography.variants.h5, color: colors.success, fontWeight: typography.weights.bold },
  footer: { padding: spacing.xl, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray200 },
  actionButton: { backgroundColor: colors.primary, paddingVertical: spacing.lg, borderRadius: borderRadius.md, alignItems: 'center' },
  actionText: { ...typography.variants.button, color: colors.white },
});
