import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface CartItemProps {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  modifiers?: { name: string; price: number }[];
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  name,
  price,
  quantity,
  image,
  modifiers = [],
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const modifiersTotal = modifiers.reduce((sum, mod) => sum + mod.price, 0);
  const itemTotal = (price + modifiersTotal) * quantity;

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
        {modifiers.length > 0 && (
          <Text style={styles.modifiers}>
            {modifiers.map((m) => m.name).join(', ')}
          </Text>
        )}
        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={onDecrement}>
              <Ionicons name="remove" size={16} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={onIncrement}>
              <Ionicons name="add" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>${itemTotal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.variants.body1,
    fontWeight: typography.weights.semibold,
    flex: 1,
    marginRight: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
  },
  modifiers: {
    ...typography.variants.caption,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.sm,
  },
  quantityButton: {
    padding: spacing.sm,
  },
  quantity: {
    ...typography.variants.body2,
    fontWeight: typography.weights.semibold,
    minWidth: 24,
    textAlign: 'center',
  },
  price: {
    ...typography.variants.body1,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});
