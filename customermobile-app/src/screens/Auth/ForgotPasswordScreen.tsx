import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services';
import { Button, TextInput, Card } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to send reset email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email to reset your password</Text>
          </View>

          {isSuccess ? (
            <Card style={styles.successCard}>
              <Ionicons name="mail-open-outline" size={64} color={colors.primary} />
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successMessage}>
                We've sent a password reset link to {email}
              </Text>
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={styles.successButton}
              />
            </Card>
          ) : (
            <Card style={styles.formCard}>
              <TextInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<Ionicons name="mail-outline" size={20} color={colors.gray500} />}
              />

              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                isLoading={isLoading}
                style={styles.resetButton}
              />
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.variants.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.variants.body1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  formCard: {
    marginBottom: spacing.xl,
  },
  resetButton: {
    marginTop: spacing.sm,
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  successTitle: {
    ...typography.variants.h3,
    color: colors.text,
    marginTop: spacing.lg,
  },
  successMessage: {
    ...typography.variants.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  successButton: {
    marginTop: spacing.xl,
    width: '100%',
  },
});
