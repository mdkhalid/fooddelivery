import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useOrder, useCancelOrder } from '../../hooks';
import { Button, Card, LoadingState, ErrorState } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatCurrency, formatDate } from '../../utils/format';

export const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId } = route.params;
  const { data: order, isLoading, error } = useOrder(orderId);
  const { mutate: cancelOrder } = useCancelOrder();

  if (isLoading) return <LoadingState fullScreen />;
  if (error || !order) return <ErrorState onRetry={() => navigation.goBack()} />;

  const statusColor = colors.orderStatus[order.status as keyof typeof colors.orderStatus] || colors.gray500;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.section}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={styles.statusText}>{order.status.replace('_', ' ').toUpperCase()}</Text>
          </View>
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt, 'long')}</Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.deliveryFee)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.tax)}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>-{formatCurrency(order.discount)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </Card>

        {['pending', 'confirmed'].includes(order.status) && (
          <Button
            title="Cancel Order"
            variant="danger"
            onPress={() => cancelOrder({ orderId })}
            style={styles.cancelButton}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.gray200,
  },
  title: { ...typography.variants.h4, color: colors.text },
  content: { padding: spacing.xl },
  section: { marginBottom: spacing.lg },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  statusText: { ...typography.variants.overline, color: colors.text },
  restaurantName: { ...typography.variants.h3, color: colors.text },
  orderDate: { ...typography.variants.body2, color: colors.textSecondary, marginTop: spacing.xs },
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.md },
  itemRow: { flexDirection: 'row', marginBottom: spacing.sm },
  itemQuantity: { ...typography.variants.body2, color: colors.textSecondary, width: 30 },
  itemName: { flex: 1, ...typography.variants.body2, color: colors.text },
  itemPrice: { ...typography.variants.body2, color: colors.text },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryLabel: { ...typography.variants.body2, color: colors.textSecondary },
  summaryValue: { ...typography.variants.body2, color: colors.text },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  totalLabel: { ...typography.variants.h4, color: colors.text },
  totalValue: { ...typography.variants.h4, color: colors.primary },
  cancelButton: { marginTop: spacing.md },
});
