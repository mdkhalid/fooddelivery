import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { ScheduleEditor } from '../../components/domain/ScheduleEditor';
import { useAvailability } from '../../hooks/useAvailability';

export const AvailabilityScreen: React.FC = () => {
  const { schedules, updateSchedule, zones } = useAvailability();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Availability</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          <ScheduleEditor schedules={schedules} onToggle={(id, isActive) => updateSchedule({ id, schedule: { isActive } })} onEdit={() => {}} onAdd={() => {}} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Zones</Text>
          {zones.map(zone => (
            <View key={zone.id} style={styles.zoneCard}>
              <Text style={styles.zoneName}>{zone.name}</Text>
              <View style={styles.zoneInfo}>
                <View style={[styles.demandDot, { backgroundColor: zone.demandLevel === 'high' ? colors.success : zone.demandLevel === 'medium' ? colors.warning : colors.gray400 }]} />
                <Text style={styles.zoneDemand}>{zone.demandLevel} demand</Text>
                {zone.surgeMultiplier > 1 && <Text style={styles.zoneSurge}>{zone.surgeMultiplier}x surge</Text>}
              </View>
            </View>
          ))}
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
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.lg },
  zoneCard: { backgroundColor: colors.white, borderRadius: borderRadius.md, padding: spacing.lg, marginBottom: spacing.sm },
  zoneName: { ...typography.variants.body1, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.sm },
  zoneInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  demandDot: { width: 8, height: 8, borderRadius: 4 },
  zoneDemand: { ...typography.variants.body3, color: colors.gray600, flex: 1 },
  zoneSurge: { ...typography.variants.body3, color: colors.success, fontWeight: typography.weights.semibold },
});
