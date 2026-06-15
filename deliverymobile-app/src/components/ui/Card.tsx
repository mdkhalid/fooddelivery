import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows } from '../../theme/spacing';

interface CardProps { children: React.ReactNode; style?: ViewStyle; variant?: 'elevated' | 'outlined'; }

export const Card: React.FC<CardProps> = ({ children, style, variant = 'elevated' }) => {
  return <View style={[styles.card, variant === 'outlined' ? styles.outlined : styles.elevated, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: 16 },
  elevated: { ...shadows.md },
  outlined: { borderWidth: 1, borderColor: colors.gray200 },
});
