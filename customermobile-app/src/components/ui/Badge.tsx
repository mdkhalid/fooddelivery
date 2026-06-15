import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface BadgeProps {
  value: number | string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  value,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  return (
    <View style={[styles.base, styles[variant], styles[`${size}Badge`], style]}>
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  info: {
    backgroundColor: colors.info,
  },
  smBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: spacing.xs,
  },
  mdBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing.sm,
  },
  lgBadge: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: spacing.md,
  },
  text: {
    ...typography.variants.caption,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  smText: {
    fontSize: 10,
  },
  mdText: {
    fontSize: 12,
  },
  lgText: {
    fontSize: 14,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  successText: {
    color: colors.white,
  },
  warningText: {
    color: colors.gray900,
  },
  dangerText: {
    color: colors.white,
  },
  infoText: {
    color: colors.white,
  },
});
