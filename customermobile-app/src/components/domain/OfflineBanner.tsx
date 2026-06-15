import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface OfflineBannerProps {
  isVisible: boolean;
  message?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isVisible,
  message = "You're offline. Some features may be unavailable.",
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline" size={16} color={colors.white} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  message: {
    ...typography.variants.caption,
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
});
