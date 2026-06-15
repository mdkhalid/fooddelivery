import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface LocationPickerProps {
  onSearch?: (query: string) => void;
  onUseCurrentLocation?: () => void;
  onMapPress?: () => void;
  placeholder?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onSearch,
  onUseCurrentLocation,
  onMapPress,
  placeholder = 'Search for a location',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.gray400} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onUseCurrentLocation}>
          <Ionicons name="locate" size={24} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Current Location</Text>
            <Text style={styles.actionSubtitle}>Use your device's location</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onMapPress}>
          <Ionicons name="map" size={24} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Choose on Map</Text>
            <Text style={styles.actionSubtitle}>Pin location manually</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={48} color={colors.gray300} />
        <Text style={styles.mapText}>Tap to open map</Text>
      </View>
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
    marginBottom: spacing.lg,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.variants.body1,
    paddingVertical: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: spacing.sm,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...typography.variants.body2,
    fontWeight: typography.weights.medium,
  },
  actionSubtitle: {
    ...typography.variants.caption,
    color: colors.gray500,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  mapText: {
    ...typography.variants.body2,
    color: colors.gray500,
    marginTop: spacing.md,
  },
});
