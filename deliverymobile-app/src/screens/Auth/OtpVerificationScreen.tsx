import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../types/navigation.types';

type OtpRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen: React.FC = () => {
  const route = useRoute<OtpRouteProp>();
  const { phone } = route.params;
  const { isLoading } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
      <View style={styles.content}>
        <Ionicons name="shield-checkmark-outline" size={64} color={colors.primary} style={styles.icon} />
        <Text style={styles.title}>Verify Phone</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {phone}</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View key={index} style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}>
              <Text style={styles.otpText}>{digit}</Text>
            </View>
          ))}
        </View>
        <Button title="Verify" onPress={() => {}} isLoading={isLoading} style={styles.button} />
        <TouchableOpacity style={styles.resend}><Text style={styles.resendText}>Resend Code</Text></TouchableOpacity>
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
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  otpBox: { width: 48, height: 56, borderWidth: 1, borderColor: colors.gray300, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  otpText: { ...typography.variants.h3, color: colors.text },
  button: { marginBottom: spacing.lg },
  resend: { alignItems: 'center' },
  resendText: { ...typography.variants.body2, color: colors.primary, fontWeight: typography.weights.medium },
});
