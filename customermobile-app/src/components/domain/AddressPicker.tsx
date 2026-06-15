import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressPickerProps {
  savedAddresses?: SavedAddress[];
  onSelectAddress?: (address: SavedAddress) => void;
  onUseCurrentLocation?: () => void;
  onAddNewAddress?: () => void;
}

export const AddressPicker: React.FC<AddressPickerProps> = ({
  savedAddresses = [],
  onSelectAddress,
  onUseCurrentLocation,
  onAddNewAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAddresses = savedAddresses.filter(
    (addr) =>
      addr.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search address"
          placeholderTextColor={colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <TouchableOpacity style={styles.locationButton} onPress={onUseCurrentLocation}>
        <Ionicons name="locate" size={20} color={colors.primary} />
        <Text style={styles.locationText}>Use Current Location</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredAddresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.addressItem} onPress={() => onSelectAddress?.(item)}>
            <View style={styles.addressIcon}>
              <Ionicons
                name={item.label.toLowerCase().includes('home') ? 'home' : 'location'}
                size={20}
                color={colors.gray500}
              />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>{item.label}</Text>
              <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No saved addresses found</Text>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={onAddNewAddress}>
        <Ionicons name="add-circle" size={24} color={colors.primary} />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.variants.body1,
    paddingVertical: spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primaryLight + '10',
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  locationText: {
    ...typography.variants.body1,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    ...typography.variants.body1,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  addressText: {
    ...typography.variants.caption,
    color: colors.gray500,
  },
  emptyText: {
    ...typography.variants.body2,
    color: colors.gray500,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  addButtonText: {
    ...typography.variants.body1,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
});
