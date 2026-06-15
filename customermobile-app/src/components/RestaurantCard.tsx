import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '../types/restaurant.types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { formatDistance, formatDuration, formatCurrency } from '../utils/format';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: restaurant.coverImage }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.rating} />
            <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <Text style={styles.cuisine} numberOfLines={1}>
          {restaurant.cuisine.join(' • ')}
        </Text>
        
        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Ionicons name="bicycle-outline" size={14} color={colors.gray500} />
            <Text style={styles.infoText}>
              {restaurant.deliveryFee === 0 ? 'Free' : formatCurrency(restaurant.deliveryFee)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color={colors.gray500} />
            <Text style={styles.infoText}>{formatDuration(restaurant.estimatedDeliveryTime)}</Text>
          </View>
          {restaurant.distance && (
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={14} color={colors.gray500} />
              <Text style={styles.infoText}>{formatDistance(restaurant.distance)}</Text>
            </View>
          )}
        </View>

        {!restaurant.isOpen && (
          <View style={styles.closedBadge}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: colors.gray200,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.variants.h4,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  rating: {
    ...typography.variants.caption,
    color: colors.text,
    marginLeft: spacing.xxs,
    fontWeight: typography.weights.semibold,
  },
  cuisine: {
    ...typography.variants.body3,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoText: {
    ...typography.variants.caption,
    color: colors.gray600,
    marginLeft: spacing.xxs,
  },
  closedBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  closedText: {
    ...typography.variants.caption,
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
});
