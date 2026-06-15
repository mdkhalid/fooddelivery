import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface Cuisine {
  id: string;
  name: string;
  icon?: string;
}

interface CuisineFilterProps {
  cuisines: Cuisine[];
  selectedCuisineId?: string;
  onSelect?: (cuisine: Cuisine) => void;
}

export const CuisineFilter: React.FC<CuisineFilterProps> = ({
  cuisines,
  selectedCuisineId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cuisines.map((cuisine) => (
          <TouchableOpacity
            key={cuisine.id}
            style={[
              styles.chip,
              cuisine.id === selectedCuisineId && styles.chipSelected,
            ]}
            onPress={() => onSelect?.(cuisine)}
          >
            <Text
              style={[
                styles.chipText,
                cuisine.id === selectedCuisineId && styles.chipTextSelected,
              ]}
            >
              {cuisine.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.variants.body2,
    color: colors.gray600,
    fontWeight: typography.weights.medium,
  },
  chipTextSelected: {
    color: colors.white,
  },
});
