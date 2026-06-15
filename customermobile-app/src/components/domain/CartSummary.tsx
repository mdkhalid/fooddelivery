import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount?: number;
  total: number;
  currency?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  deliveryFee,
  tax,
  discount = 0,
  total,
  currency = '$',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{currency}{subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Delivery Fee</Text>
        <Text style={styles.value}>{currency}{deliveryFee.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tax</Text>
        <Text style={styles.value}>{currency}{tax.toFixed(2)}</Text>
      </View>
      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, styles.discountLabel]}>Discount</Text>
          <Text style={[styles.value, styles.discountValue]}>{currency}{discount.toFixed(2)}</Text>
        </View>
      )}
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{currency}{total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.variants.body2,
    color: colors.gray600,
  },
  value: {
    ...typography.variants.body2,
    color: colors.text,
  },
  discountLabel: {
    color: colors.success,
  },
  discountValue: {
    color: colors.success,
    fontWeight: typography.weights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.md,
  },
  totalLabel: {
    ...typography.variants.h4,
    color: colors.text,
  },
  totalValue: {
    ...typography.variants.h3,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
});
