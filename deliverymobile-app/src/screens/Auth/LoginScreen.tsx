import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) login({ email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Ionicons name="bicycle" size={64} color={colors.primary} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue delivering</Text>
          </View>
          <View style={styles.form}>
            <TextInput label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" error={errors.email} isRequired />
            <TextInput label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} icon="lock-closed-outline" secureTextEntry error={errors.password} isRequired />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.forgotPassword}>Forgot Password?</Text></TouchableOpacity>
            <Button title="Sign In" onPress={handleLogin} isLoading={isLoading} style={styles.button} />
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.link}>Sign Up</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.xxxl, marginTop: spacing.xxl },
  title: { ...typography.variants.h1, color: colors.text, marginTop: spacing.lg },
  subtitle: { ...typography.variants.body1, color: colors.gray500, marginTop: spacing.sm },
  form: { gap: spacing.md },
  forgotPassword: { ...typography.variants.body2, color: colors.primary, textAlign: 'right', marginBottom: spacing.md },
  button: { marginTop: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { ...typography.variants.body2, color: colors.gray500 },
  link: { ...typography.variants.body2, color: colors.primary, fontWeight: typography.weights.semibold },
});
