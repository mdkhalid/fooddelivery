import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { TextInput } from '../../components/ui/TextInput';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validation';

const VEHICLE_TYPES = [
  { label: 'Car', value: 'car' },
  { label: 'Bike', value: 'bike' },
  { label: 'Scooter', value: 'scooter' },
  { label: 'Bicycle', value: 'bicycle' },
];

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email';
    if (!phone) newErrors.phone = 'Phone is required';
    else if (!validatePhone(phone)) newErrors.phone = 'Invalid phone';
    const passwordValidation = validatePassword(password);
    if (!password) newErrors.password = 'Password is required';
    else if (!passwordValidation.isValid) newErrors.password = passwordValidation.errors[0];
    if (!vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) register({ name, email, phone, password, vehicleType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join as a delivery partner</Text>
          <View style={styles.form}>
            <TextInput label="Full Name" placeholder="Enter your name" value={name} onChangeText={setName} icon="person-outline" error={errors.name} isRequired />
            <TextInput label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" error={errors.email} isRequired />
            <TextInput label="Phone" placeholder="Enter your phone" value={phone} onChangeText={setPhone} icon="call-outline" keyboardType="phone-pad" error={errors.phone} isRequired />
            <TextInput label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} icon="lock-closed-outline" secureTextEntry error={errors.password} isRequired />
            <Select label="Vehicle Type" options={VEHICLE_TYPES} value={vehicleType} onValueChange={setVehicleType} error={errors.vehicleType} />
            <Button title="Create Account" onPress={handleRegister} isLoading={isLoading} style={styles.button} />
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.link}>Sign In</Text></TouchableOpacity>
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
  title: { ...typography.variants.h1, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.variants.body1, color: colors.gray500, marginBottom: spacing.xl },
  form: { gap: spacing.md },
  button: { marginTop: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { ...typography.variants.body2, color: colors.gray500 },
  link: { ...typography.variants.body2, color: colors.primary, fontWeight: typography.weights.semibold },
});
