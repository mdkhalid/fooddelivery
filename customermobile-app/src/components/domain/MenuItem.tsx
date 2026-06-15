import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface MenuItemProps {
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  onPress?: () => void;
  onAddToCart?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  name,
  description,
  price,
  image,
  isAvailable = true,
  isPopular = false,
  onPress,
  onAddToCart,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, !isAvailable && styles.unavailable]}
      onPress={onPress}
      disabled={!isAvailable}
    >
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          {isPopular && (
            <View style={styles.popularBadge}>
              <Ionicons name="flame" size={12} color={colors.white} />
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
          {!isAvailable && (
            <View style={styles.unavailableOverlay}>
              <Text style={styles.unavailableText}>Unavailable</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, !isAvailable && styles.unavailableText]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        </View>
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
        {isAvailable && onAddToCart && (
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unavailable: {
    opacity: 0.6,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  popularText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.variants.body1,
    fontWeight: typography.weights.semibold,
    flex: 1,
    marginRight: spacing.sm,
  },
  price: {
    ...typography.variants.body1,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  description: {
    ...typography.variants.caption,
    color: colors.gray500,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  unavailableText: {
    color: colors.gray500,
  },
});
