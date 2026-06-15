import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface BadgeProps { label: string; variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray'; size?: 'sm' | 'md'; }

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'info', size = 'md' }) => {
  const getBgColor = () => {
    switch (variant) { case 'success': return colors.success; case 'warning': return colors.warning; case 'danger': return colors.danger; case 'gray': return colors.gray500; default: return colors.info; }
  };
  return (
    <View style={[styles.badge, { backgroundColor: getBgColor() }, size === 'sm' && styles.small]}>
      <Text style={[styles.text, size === 'sm' && styles.smallText]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.round, alignSelf: 'flex-start' },
  small: { paddingHorizontal: spacing.xs, paddingVertical: 2 },
  text: { ...typography.variants.caption, color: colors.white, fontWeight: typography.weights.semibold },
  smallText: { ...typography.variants.small },
});
