import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface Modifier {
  id: string;
  name: string;
  price: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  modifiers: Modifier[];
}

interface ModifierSelectorProps {
  group: ModifierGroup;
  selectedModifiers: string[];
  onToggle: (modifierId: string) => void;
}

export const ModifierSelector: React.FC<ModifierSelectorProps> = ({
  group,
  selectedModifiers,
  onToggle,
}) => {
  const handlePress = (modifierId: string) => {
    if (group.type === 'single') {
      // For single selection, deselect all others first
      const currentSelected = selectedModifiers.find((id) =>
        group.modifiers.some((m) => m.id === id)
      );
      if (currentSelected && currentSelected !== modifierId) {
        onToggle(currentSelected); // deselect current
      }
      if (currentSelected !== modifierId) {
        onToggle(modifierId); // select new
      }
    } else {
      onToggle(modifierId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{group.name}</Text>
        {group.required && <Text style={styles.required}>Required</Text>}
      </View>
      {group.modifiers.map((modifier) => {
        const isSelected = selectedModifiers.includes(modifier.id);
        return (
          <TouchableOpacity
            key={modifier.id}
            style={[styles.modifier, isSelected && styles.modifierSelected]}
            onPress={() => handlePress(modifier.id)}
          >
            <View style={styles.modifierContent}>
              <Text style={[styles.modifierName, isSelected && styles.modifierNameSelected]}>
                {modifier.name}
              </Text>
              {modifier.price > 0 && (
                <Text style={[styles.modifierPrice, isSelected && styles.modifierPriceSelected]}>
                  +${modifier.price.toFixed(2)}
                </Text>
              )}
            </View>
            {group.type === 'single' ? (
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            ) : (
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.variants.h4,
    color: colors.text,
  },
  required: {
    ...typography.variants.caption,
    color: colors.danger,
    fontWeight: typography.weights.medium,
  },
  modifier: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: spacing.sm,
  },
  modifierSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
  },
  modifierContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modifierName: {
    ...typography.variants.body1,
    color: colors.text,
  },
  modifierNameSelected: {
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  modifierPrice: {
    ...typography.variants.body2,
    color: colors.gray500,
  },
  modifierPriceSelected: {
    color: colors.primary,
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
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
