import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface DriverCardProps {
  name: string;
  avatar?: string;
  phone?: string;
  vehicle?: string;
  rating?: number;
  onCall?: () => void;
  onMessage?: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  name,
  avatar,
  phone,
  vehicle,
  rating,
  onCall,
  onMessage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color={colors.gray400} />
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            {vehicle && <Text style={styles.vehicle}>{vehicle}</Text>}
            {rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={styles.rating}>{rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.actions}>
          {onCall && (
            <TouchableOpacity style={styles.actionButton} onPress={onCall}>
              <Ionicons name="call" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {onMessage && (
            <TouchableOpacity style={styles.actionButton} onPress={onMessage}>
              <Ionicons name="chatbubble" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.variants.body1,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  vehicle: {
    ...typography.variants.caption,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    ...typography.variants.body2,
    color: colors.gray600,
    fontWeight: typography.weights.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
