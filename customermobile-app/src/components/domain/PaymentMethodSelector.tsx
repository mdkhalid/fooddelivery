import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'wallet' | 'apple_pay' | 'google_pay';
  label: string;
  details?: string;
  icon?: string;
  isDefault?: boolean;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethodId?: string;
  onSelect?: (method: PaymentMethod) => void;
  onAddNew?: () => void;
}

const getPaymentIcon = (type: PaymentMethod['type']): string => {
  switch (type) {
    case 'card':
      return 'card-outline';
    case 'cash':
      return 'cash-outline';
    case 'wallet':
      return 'wallet-outline';
    case 'apple_pay':
      return 'logo-apple';
    case 'google_pay':
      return 'logo-google';
    default:
      return 'card-outline';
  }
};

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethodId,
  onSelect,
  onAddNew,
}) => {
  return (
    <View style={styles.container}>
      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.method,
            method.id === selectedMethodId && styles.methodSelected,
          ]}
          onPress={() => onSelect?.(method)}
        >
          <View style={styles.methodIcon}>
            <Ionicons
              name={getPaymentIcon(method.type) as any}
              size={24}
              color={method.id === selectedMethodId ? colors.primary : colors.gray500}
            />
          </View>
          <View style={styles.methodInfo}>
            <View style={styles.methodHeader}>
              <Text
                style={[
                  styles.methodLabel,
                  method.id === selectedMethodId && styles.methodLabelSelected,
                ]}
              >
                {method.label}
              </Text>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            {method.details && (
              <Text style={styles.methodDetails}>{method.details}</Text>
            )}
          </View>
          <View style={[
            styles.radio,
            method.id === selectedMethodId && styles.radioSelected,
          ]}>
            {method.id === selectedMethodId && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}

      {onAddNew && (
        <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  methodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  methodLabel: {
    ...typography.variants.body1,
    fontWeight: typography.weights.medium,
  },
  methodLabelSelected: {
    color: colors.primary,
  },
  defaultBadge: {
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  defaultText: {
    ...typography.variants.caption,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  methodDetails: {
    ...typography.variants.caption,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  addButtonText: {
    ...typography.variants.body1,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
});
