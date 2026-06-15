import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, TextInput, Card } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) return;
    setIsLoading(true);
    try {
      // await authService.resetPassword({ token: route.params.token, password });
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to reset password:', error);
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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Create a new password</Text>
          </View>

          {isSuccess ? (
            <Card style={styles.successCard}>
              <Ionicons name="checkmark-circle-outline" size={64} color={colors.success} />
              <Text style={styles.successTitle}>Password Reset!</Text>
              <Text style={styles.successMessage}>Your password has been successfully reset</Text>
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={styles.successButton}
              />
            </Card>
          ) : (
            <Card style={styles.formCard}>
              <TextInput
                label="New Password"
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.gray500} />}
                rightIcon={
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.gray500}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TextInput
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.gray500} />}
              />

              <Button
                title="Reset Password"
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
  container: { flex: 1, backgroundColor: colors.background },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  header: { marginBottom: spacing.xxxl },
  title: { ...typography.variants.h1, color: colors.text },
  subtitle: { ...typography.variants.body1, color: colors.textSecondary, marginTop: spacing.xs },
  formCard: { marginBottom: spacing.xl },
  resetButton: { marginTop: spacing.sm },
  successCard: { alignItems: 'center', paddingVertical: spacing.xxxl },
  successTitle: { ...typography.variants.h3, color: colors.text, marginTop: spacing.lg },
  successMessage: { ...typography.variants.body1, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  successButton: { marginTop: spacing.xl, width: '100%' },
});
