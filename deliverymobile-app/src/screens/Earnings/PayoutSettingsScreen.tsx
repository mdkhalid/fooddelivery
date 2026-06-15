import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { TextInput } from '../../components/ui/TextInput';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { usePayouts } from '../../hooks/usePayouts';

const FREQUENCY_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-Weekly', value: 'bi_weekly' },
];

export const PayoutSettingsScreen: React.FC = () => {
  const { settings, updateSettings, isLoading } = usePayouts();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Payout Settings</Text>
        <View style={styles.card}>
          <TextInput label="Bank Name" placeholder="Enter bank name" value={settings?.bankName || ''} onChangeText={() => {}} icon="business-outline" />
          <TextInput label="Account Number" placeholder="Enter account number" value={settings?.accountNumber || ''} onChangeText={() => {}} icon="card-outline" />
          <TextInput label="Routing Number" placeholder="Enter routing number" value={settings?.routingNumber || ''} onChangeText={() => {}} icon="key-outline" />
          <Select label="Payout Frequency" options={FREQUENCY_OPTIONS} value={settings?.payoutFrequency || 'weekly'} onValueChange={() => {}} />
          <Button title="Save Settings" onPress={() => {}} isLoading={isLoading} style={styles.button} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.xl },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.xl },
  button: { marginTop: spacing.lg },
});
