import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Button, TextInput, Card } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login, isLoginLoading, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue ordering</Text>
          </View>

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

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.gray500} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.gray500}
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {loginError && (
              <Text style={styles.error}>Invalid email or password</Text>
            )}

            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoginLoading}
              style={styles.loginButton}
            />
          </Card>

          <View style={styles.socialLogin}>
            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.socialButtons}>
              <Button
                title="Google"
                variant="outline"
                onPress={() => {}}
                leftIcon={<Ionicons name="logo-google" size={20} color={colors.primary} />}
                style={styles.socialButton}
              />
              <Button
                title="Apple"
                variant="outline"
                onPress={() => {}}
                leftIcon={<Ionicons name="logo-apple" size={20} color={colors.primary} />}
                style={styles.socialButton}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpText}> Sign Up</Text>
            </TouchableOpacity>
          </View>
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
  forgotPassword: {
    ...typography.variants.body2,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  error: {
    ...typography.variants.body3,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  socialLogin: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  orText: {
    ...typography.variants.body2,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.variants.body2,
    color: colors.textSecondary,
  },
  signUpText: {
    ...typography.variants.body2,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});
