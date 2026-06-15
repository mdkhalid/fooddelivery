import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFeaturedRestaurants, usePopularRestaurants, useGeolocation } from '../hooks';
import { RestaurantCard } from '../components/RestaurantCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { Restaurant } from '../types/restaurant.types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { currentLocation, requestLocation, isLocationLoading } = useGeolocation();
  const { data: featuredRestaurants, isLoading: isLoadingFeatured, refetch: refetchFeatured } = useFeaturedRestaurants();
  const { data: popularRestaurants, isLoading: isLoadingPopular, refetch: refetchPopular } = usePopularRestaurants();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!currentLocation) {
      requestLocation();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchPopular()]);
    setRefreshing(false);
  };

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
    />
  );

  const renderHeader = () => (
    <View>
      <View style={styles.addressBar}>
        <Ionicons name="location" size={20} color={colors.primary} />
        <Text style={styles.addressText} numberOfLines={1}>
          {currentLocation ? 'Current Location' : 'Set your location'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.gray500} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.gray500} />
        <Text style={styles.searchPlaceholder}>Search restaurants, dishes...</Text>
      </View>

      {featuredRestaurants && featuredRestaurants.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <FlatList
            data={featuredRestaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Near You</Text>
      </View>
    </View>
  );

  if (isLoadingFeatured && isLoadingPopular) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>FoodDelivery</Text>
        </View>
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <SkeletonCard style={styles.skeletonCard} />}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FoodDelivery</Text>
      </View>

      <FlatList
        data={popularRestaurants || []}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="restaurant-outline"
            title="No restaurants found"
            message="We're expanding! Try a different address."
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.variants.h2,
    color: colors.primary,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  addressText: {
    flex: 1,
    ...typography.variants.body1,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  searchPlaceholder: {
    ...typography.variants.body1,
    color: colors.gray500,
    marginLeft: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.variants.h4,
    color: colors.text,
  },
  horizontalList: {
    paddingRight: spacing.xl,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  skeletonCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
