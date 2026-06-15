import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth.service';
import { validateEmail } from '../../utils/validation';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !validateEmail(email)) { setError('Valid email is required'); return; }
    setIsLoading(true);
    try { await authService.forgotPassword(email); setSent(true); }
    catch { setError('Failed to send reset email'); }
    finally { setIsLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
      <View style={styles.content}>
        <Ionicons name="mail-open-outline" size={64} color={colors.primary} style={styles.icon} />
        {sent ? (
          <View style={styles.success}><Text style={styles.title}>Check Your Email</Text><Text style={styles.subtitle}>We've sent a password reset link to {email}</Text></View>
        ) : (
          <View><Text style={styles.title}>Forgot Password?</Text><Text style={styles.subtitle}>Enter your email and we'll send you a reset link</Text>
            <TextInput label="Email" placeholder="Enter your email" value={email} onChangeText={(t) => { setEmail(t); setError(''); }} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" error={error} isRequired />
            <Button title="Send Reset Link" onPress={handleSubmit} isLoading={isLoading} style={styles.button} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  back: { padding: spacing.sm },
  content: { flex: 1, justifyContent: 'center' },
  icon: { alignSelf: 'center', marginBottom: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.variants.body1, color: colors.gray500, textAlign: 'center', marginBottom: spacing.xl },
  success: { alignItems: 'center' },
  button: { marginTop: spacing.lg },
});
