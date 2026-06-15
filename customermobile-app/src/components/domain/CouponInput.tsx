import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface CouponInputProps {
  onApply: (code: string) => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  onApply,
  isLoading = false,
  error,
  success,
}) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Ionicons name="pricetag-outline" size={20} color={colors.gray400} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter coupon code"
            placeholderTextColor={colors.gray400}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleApply}
          disabled={isLoading || !code.trim()}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Applying...' : 'Apply'}
          </Text>
        </TouchableOpacity>
      </View>
      {error && (
        <View style={styles.messageContainer}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {success && (
        <View style={styles.messageContainer}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.successText}>{success}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  icon: {
    marginLeft: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.variants.body1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.variants.body2,
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  errorText: {
    ...typography.variants.caption,
    color: colors.danger,
  },
  successText: {
    ...typography.variants.caption,
    color: colors.success,
  },
});
