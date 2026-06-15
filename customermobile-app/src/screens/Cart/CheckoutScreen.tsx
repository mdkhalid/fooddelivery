import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, useCreateOrder } from '../../hooks';
import { Button, Card, TextInput } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatCurrency } from '../../utils/format';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { cart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'cod'>('card');
  const [notes, setNotes] = useState('');

  const handlePlaceOrder = () => {
    createOrder(
      {
        restaurantId: cart.restaurantId || '',
        items: cart.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          modifiers: item.modifiers.map((mod) => ({ modifierId: mod.modifierId })),
        })),
        deliveryAddressId: 'default',
        paymentMethod,
        notes,
      },
      {
        onSuccess: (order) => {
          navigation.navigate('OrderTracking', { orderId: order.id });
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Home</Text>
              <Text style={styles.addressText}>123 Main Street, Apt 4B</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {(['card', 'wallet', 'cod'] as const).map((method) => (
            <TouchableOpacity
              key={method}
              style={[styles.paymentOption, paymentMethod === method && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod(method)}
            >
              <Ionicons
                name={method === 'card' ? 'card-outline' : method === 'wallet' ? 'wallet-outline' : 'cash-outline'}
                size={24}
                color={paymentMethod === method ? colors.primary : colors.gray500}
              />
              <Text style={[styles.paymentText, paymentMethod === method && styles.paymentTextSelected]}>
                {method === 'card' ? 'Credit/Debit Card' : method === 'wallet' ? 'Wallet' : 'Cash on Delivery'}
              </Text>
              {paymentMethod === method && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.orderItemPrice}>{formatCurrency(item.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(cart.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatCurrency(cart.deliveryFee)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{formatCurrency(cart.tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(cart.total)}</Text>
          </View>
        </Card>

        <TextInput
          label="Order Notes (Optional)"
          placeholder="Any special instructions?"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Place Order • ${formatCurrency(cart.total)}`}
          onPress={handlePlaceOrder}
          isLoading={isPending}
          style={styles.placeOrderButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: { ...typography.variants.h4, color: colors.text },
  content: { padding: spacing.xl },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.md },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressInfo: { flex: 1, marginLeft: spacing.md },
  addressLabel: { ...typography.variants.body1, color: colors.text, fontWeight: typography.weights.medium },
  addressText: { ...typography.variants.body2, color: colors.textSecondary, marginTop: spacing.xs },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  paymentOptionSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '10' },
  paymentText: { flex: 1, ...typography.variants.body1, color: colors.text, marginLeft: spacing.md },
  paymentTextSelected: { color: colors.primary },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  orderItemName: { ...typography.variants.body2, color: colors.text },
  orderItemPrice: { ...typography.variants.body2, color: colors.text },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryLabel: { ...typography.variants.body2, color: colors.textSecondary },
  summaryValue: { ...typography.variants.body2, color: colors.text },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  totalLabel: { ...typography.variants.h4, color: colors.text },
  totalValue: { ...typography.variants.h4, color: colors.primary },
  footer: { padding: spacing.xl },
  placeOrderButton: {},
});
