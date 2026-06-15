import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', size = 'md', isLoading, disabled, style }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      case 'ghost': return styles.ghost;
      default: return styles.primary;
    }
  };
  const getTextStyle = () => {
    switch (variant) {
      case 'outline': return styles.outlineText;
      case 'ghost': return styles.ghostText;
      default: return styles.primaryText;
    }
  };
  const getSizeStyle = () => {
    switch (size) {
      case 'sm': return styles.small;
      case 'lg': return styles.large;
      default: return styles.medium;
    }
  };
  return (
    <TouchableOpacity style={[styles.button, getButtonStyle(), getSizeStyle(), disabled && styles.disabled, style]} onPress={onPress} disabled={disabled || isLoading} activeOpacity={0.7}>
      {isLoading ? <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} size="small" /> : <Text style={[styles.text, getTextStyle()]}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  small: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  medium: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  large: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  text: { ...typography.variants.button },
  primaryText: { color: colors.white },
  outlineText: { color: colors.primary },
  ghostText: { color: colors.primary },
  disabled: { opacity: 0.5 },
});
