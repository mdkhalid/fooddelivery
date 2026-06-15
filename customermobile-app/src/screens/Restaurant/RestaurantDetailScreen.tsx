import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurant, useMenu, useCart } from '../../hooks';
import { MenuItem } from '../../types/menu.types';
import { Button, Badge, Skeleton } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { formatCurrency, formatDuration } from '../../utils/format';

export const RestaurantDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { restaurantId } = route.params;
  const { restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { categories, isLoading: isLoadingMenu } = useMenu(restaurantId);
  const { cart, itemCount, addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item, 1, []);
  };

  const sections = categories.map((category) => ({
    title: category.name,
    data: category.items,
  }));

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.menuItemBottom}>
          <Text style={styles.menuItemPrice}>{formatCurrency(item.price)}</Text>
          <Button
            title="Add"
            size="sm"
            onPress={() => handleAddToCart(item)}
            disabled={!item.isAvailable}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <SafeAreaView style={styles.container}>
        <Skeleton width={400} height={200} />
        <View style={styles.loadingContent}>
          <Skeleton width={240} height={24} />
          <Skeleton width={160} height={16} />
          <Skeleton width={320} height={16} />
        </View>
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Restaurant not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.coverImage }} style={styles.coverImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={colors.rating} />
              <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
            </View>
          </View>
          
          <Text style={styles.cuisine}>{restaurant.cuisine.join(' • ')}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={colors.gray500} />
              <Text style={styles.infoText}>{formatDuration(restaurant.estimatedDeliveryTime)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="bicycle-outline" size={16} color={colors.gray500} />
              <Text style={styles.infoText}>
                {restaurant.deliveryFee === 0 ? 'Free delivery' : formatCurrency(restaurant.deliveryFee)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={16} color={colors.gray500} />
              <Text style={styles.infoText}>Min {formatCurrency(restaurant.minimumOrder)}</Text>
            </View>
          </View>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          stickySectionHeadersEnabled={false}
          scrollEnabled={false}
        />
      </ScrollView>

      {itemCount > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartInfo}>
            <Badge value={itemCount} variant="primary" />
            <Text style={styles.cartText}>View Cart</Text>
          </View>
          <Text style={styles.cartTotal}>{formatCurrency(cart.total)}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray200,
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.black + '40',
    borderRadius: borderRadius.round,
    padding: spacing.sm,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.black + '40',
    borderRadius: borderRadius.round,
    padding: spacing.sm,
  },
  infoSection: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...typography.variants.h2,
    color: colors.text,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  rating: {
    ...typography.variants.body3,
    color: colors.text,
    marginLeft: spacing.xxs,
    fontWeight: typography.weights.semibold,
  },
  cuisine: {
    ...typography.variants.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
  },
  infoText: {
    ...typography.variants.body3,
    color: colors.gray600,
    marginLeft: spacing.xs,
  },
  sectionHeader: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    ...typography.variants.h4,
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray200,
  },
  menuItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuItemName: {
    ...typography.variants.body1,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  menuItemDescription: {
    ...typography.variants.body3,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  menuItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  menuItemPrice: {
    ...typography.variants.body1,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  cartBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartText: {
    ...typography.variants.button,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  cartTotal: {
    ...typography.variants.button,
    color: colors.white,
  },
  loadingContent: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.variants.body1,
    color: colors.textSecondary,
  },
});
