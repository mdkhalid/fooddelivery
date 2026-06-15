import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Switch } from '../../components/ui/Switch';
import { Select } from '../../components/ui/Select';
import { useUIStore } from '../../stores/uiStore';

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
];

const MAP_STYLE_OPTIONS = [
  { label: 'Standard', value: 'standard' },
  { label: 'Satellite', value: 'satellite' },
  { label: 'Terrain', value: 'terrain' },
];

const NAV_APP_OPTIONS = [
  { label: 'Google Maps', value: 'google_maps' },
  { label: 'Waze', value: 'waze' },
  { label: 'Apple Maps', value: 'apple_maps' },
];

export const SettingsScreen: React.FC = () => {
  const { isDarkMode, language, navigationApp, setDarkMode, setLanguage, setNavigationApp } = useUIStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <Switch label="Dark Mode" value={isDarkMode} onValueChange={setDarkMode} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <View style={styles.card}>
            <Select label="Navigation App" options={NAV_APP_OPTIONS} value={navigationApp} onValueChange={(v) => setNavigationApp(v as any)} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.card}>
            <Select label="Language" options={LANGUAGE_OPTIONS} value={language} onValueChange={setLanguage} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.md },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg },
});
