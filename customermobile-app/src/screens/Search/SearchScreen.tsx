import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from '../../hooks';
import { RestaurantCard } from '../../components/RestaurantCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Restaurant } from '../../types/restaurant.types';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [recentSearches] = useState(['Pizza', 'Sushi', 'Burger']);
  const [isSearching, setIsSearching] = useState(false);

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, dishes..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.length === 0 ? (
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity key={index} style={styles.recentItem}>
              <Ionicons name="time-outline" size={20} color={colors.gray400} />
              <Text style={styles.recentText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <FlatList
          data={[]}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>Results for "{query}"</Text>
            </View>
          }
          ListEmptyComponent={
            isSearching ? (
              <FlatList
                data={[1, 2, 3]}
                renderItem={() => <SkeletonCard style={styles.skeletonCard} />}
                keyExtractor={(item) => item.toString()}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color={colors.gray300} />
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.variants.body1,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
  },
  recentContainer: { padding: spacing.xl },
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.md },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  recentText: { ...typography.variants.body1, color: colors.text, marginLeft: spacing.md },
  resultsHeader: { padding: spacing.xl },
  resultsText: { ...typography.variants.body2, color: colors.textSecondary },
  skeletonCard: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  emptyContainer: { alignItems: 'center', paddingVertical: spacing.xxxxxl },
  emptyText: { ...typography.variants.body1, color: colors.textSecondary, marginTop: spacing.md },
});
