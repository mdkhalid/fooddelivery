import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface ProtectedScreenProps {
  title?: string;
  message?: string;
  onLogin?: () => void;
  onGoBack?: () => void;
}

export const ProtectedScreen: React.FC<ProtectedScreenProps> = ({
  title = 'Sign In Required',
  message = 'Please sign in to access this feature.',
  onLogin,
  onGoBack,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        {onLogin && (
          <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        )}
        {onGoBack && (
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.variants.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    ...typography.variants.body1,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  loginText: {
    ...typography.variants.body1,
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  backButton: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  backText: {
    ...typography.variants.body1,
    color: colors.gray600,
    fontWeight: typography.weights.medium,
  },
});
