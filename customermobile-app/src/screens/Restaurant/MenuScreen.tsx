import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { MenuItem } from '../../components/domain/MenuItem';
import { MenuCategory } from '../../components/domain/MenuCategory';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { ModifierSelector } from '../../components/domain/ModifierSelector';
import { HomeStackParamList } from '../../types/navigation.types';

interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  category: string;
  modifiers?: ModifierGroup[];
}

interface ModifierGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  modifiers: { id: string; name: string; price: number }[];
}

interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  modifiers?: { name: string; price: number }[];
}

export const MenuScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, 'Menu'>>();
  const { restaurantId, restaurantName } = route.params;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const bottomSheetRef = useRef<any>(null);

  // Mock data - replace with real data from API
  const categories = [
    { id: '1', name: 'Popular', description: 'Most ordered items' },
    { id: '2', name: 'Appetizers', description: 'Start your meal right' },
    { id: '3', name: 'Main Course', description: 'Hearty and satisfying' },
    { id: '4', name: 'Desserts', description: 'Sweet endings' },
    { id: '5', name: 'Drinks', description: 'Refreshing beverages' },
  ];

  const menuItems: MenuItemData[] = [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      price: 12.99,
      image: 'https://picsum.photos/200',
      isAvailable: true,
      isPopular: true,
      category: '1',
      modifiers: [
        {
          id: 'm1',
          name: 'Cooking Level',
          type: 'single',
          required: true,
          modifiers: [
            { id: 'm1a', name: 'Medium Rare', price: 0 },
            { id: 'm1b', name: 'Medium', price: 0 },
            { id: 'm1c', name: 'Well Done', price: 0 },
          ],
        },
        {
          id: 'm2',
          name: 'Add-ons',
          type: 'multiple',
          required: false,
          modifiers: [
            { id: 'm2a', name: 'Extra Cheese', price: 1.50 },
            { id: 'm2b', name: 'Bacon', price: 2.00 },
            { id: 'm2c', name: 'Avocado', price: 2.50 },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan and croutons',
      price: 9.99,
      image: 'https://picsum.photos/200',
      isAvailable: true,
      isPopular: false,
      category: '2',
    },
    {
      id: '3',
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, mozzarella, and fresh basil',
      price: 14.99,
      image: 'https://picsum.photos/200',
      isAvailable: true,
      isPopular: true,
      category: '3',
    },
    {
      id: '4',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten center',
      price: 7.99,
      image: 'https://picsum.photos/200',
      isAvailable: true,
      isPopular: false,
      category: '4',
    },
    {
      id: '5',
      name: 'Cola',
      description: 'Chilled carbonated soft drink',
      price: 2.99,
      image: 'https://picsum.photos/200',
      isAvailable: true,
      isPopular: false,
      category: '5',
    },
  ];

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  const handleItemPress = useCallback((item: MenuItemData) => {
    setSelectedItem(item);
    setSelectedModifiers([]);
    bottomSheetRef.current?.present();
  }, []);

  const handleToggleModifier = useCallback((modifierId: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(modifierId)
        ? prev.filter((id) => id !== modifierId)
        : [...prev, modifierId]
    );
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!selectedItem) return;

    const itemModifiers = selectedItem.modifiers
      ?.flatMap((group) => group.modifiers)
      .filter((mod) => selectedModifiers.includes(mod.id))
      .map((mod) => ({ name: mod.name, price: mod.price })) || [];

    const newItem: CartItemData = {
      id: `${selectedItem.id}-${Date.now()}`,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: 1,
      image: selectedItem.image,
      modifiers: itemModifiers,
    };

    setCartItems((prev) => [...prev, newItem]);
    bottomSheetRef.current?.dismiss();
  }, [selectedItem, selectedModifiers]);

  const cartTotal = cartItems.reduce((sum, item) => {
    const modifiersTotal = item.modifiers?.reduce((mSum, mod) => mSum + mod.price, 0) || 0;
    return sum + (item.price + modifiersTotal) * item.quantity;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, item.id === selectedCategory && styles.categoryChipSelected]}
              onPress={() => setSelectedCategory(item.id === selectedCategory ? null : item.id)}
            >
              <Text style={[styles.categoryText, item.id === selectedCategory && styles.categoryTextSelected]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItem
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            isAvailable={item.isAvailable}
            isPopular={item.isPopular}
            onPress={() => handleItemPress(item)}
            onAddToCart={() => handleItemPress(item)}
          />
        )}
        contentContainerStyle={styles.menuList}
      />

      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
          </View>
          <Text style={styles.cartText}>View Cart</Text>
          <Text style={styles.cartTotal}>${cartTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      <BottomSheet ref={bottomSheetRef} title={selectedItem?.name || 'Item Details'}>
        {selectedItem && (
          <View>
            {selectedItem.description && (
              <Text style={styles.itemDescription}>{selectedItem.description}</Text>
            )}
            <Text style={styles.itemPrice}>${selectedItem.price.toFixed(2)}</Text>

            {selectedItem.modifiers?.map((group) => (
              <ModifierSelector
                key={group.id}
                group={group}
                selectedModifiers={selectedModifiers.filter((id) =>
                  group.modifiers.some((m) => m.id === id)
                )}
                onToggle={handleToggleModifier}
              />
            ))}

            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoryBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  categoryList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.gray100,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    ...typography.variants.body2,
    color: colors.gray600,
    fontWeight: typography.weights.medium,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  menuList: {
    padding: spacing.md,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    margin: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cartBadge: {
    backgroundColor: colors.white,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cartBadgeText: {
    ...typography.variants.caption,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  cartText: {
    ...typography.variants.body1,
    color: colors.white,
    fontWeight: typography.weights.semibold,
    flex: 1,
  },
  cartTotal: {
    ...typography.variants.body1,
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  itemDescription: {
    ...typography.variants.body2,
    color: colors.gray600,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  itemPrice: {
    ...typography.variants.h3,
    color: colors.primary,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xl,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  addToCartText: {
    ...typography.variants.body1,
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
});
