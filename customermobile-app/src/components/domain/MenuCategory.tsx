import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { MenuItem } from './MenuItem';

interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
}

interface MenuCategoryProps {
  name: string;
  description?: string;
  items: MenuItemData[];
  onItemPress?: (item: MenuItemData) => void;
  onAddToCart?: (item: MenuItemData) => void;
}

export const MenuCategory: React.FC<MenuCategoryProps> = ({
  name,
  description,
  items,
  onItemPress,
  onAddToCart,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {items.map((item) => (
        <MenuItem
          key={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          image={item.image}
          isAvailable={item.isAvailable}
          isPopular={item.isPopular}
          onPress={() => onItemPress?.(item)}
          onAddToCart={() => onAddToCart?.(item)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
  },
  name: {
    ...typography.variants.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.variants.body2,
    color: colors.gray500,
  },
});
