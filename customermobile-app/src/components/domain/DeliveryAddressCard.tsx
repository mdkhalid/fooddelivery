import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface DeliveryAddressCardProps {
  label: string;
  address: string;
  apartment?: string;
  floor?: string;
  isDefault?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
}

export const DeliveryAddressCard: React.FC<DeliveryAddressCardProps> = ({
  label,
  address,
  apartment,
  floor,
  isDefault = false,
  onSelect,
  onEdit,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onSelect}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={label.toLowerCase().includes('home') ? 'home' : label.toLowerCase().includes('work') ? 'briefcase' : 'location'}
          size={24}
          color={isDefault ? colors.primary : colors.gray500}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.address}>{address}</Text>
        {apartment && <Text style={styles.detail}>{apartment}</Text>}
        {floor && <Text style={styles.detail}>Floor {floor}</Text>}
      </View>
      {onEdit && (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Ionicons name="pencil" size={18} color={colors.gray500} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  label: {
    ...typography.variants.body1,
    fontWeight: typography.weights.semibold,
  },
  defaultBadge: {
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  defaultText: {
    ...typography.variants.caption,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  address: {
    ...typography.variants.body2,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  detail: {
    ...typography.variants.caption,
    color: colors.gray500,
  },
  editButton: {
    padding: spacing.sm,
  },
});
