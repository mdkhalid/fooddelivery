import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Schedule } from '../../types/availability.types';

interface ScheduleEditorProps { schedules: Schedule[]; onToggle: (id: string, isActive: boolean) => void; onEdit: (id: string) => void; onAdd: () => void; }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ schedules, onToggle, onEdit, onAdd }) => {
  return (
    <View style={styles.container}>
      {DAYS.map((day, index) => {
        const schedule = schedules.find(s => s.dayOfWeek === index);
        return (
          <View key={day} style={styles.dayRow}>
            <Text style={styles.dayText}>{day}</Text>
            {schedule ? (
              <View style={styles.scheduleInfo}>
                <Text style={styles.time}>{schedule.startTime} - {schedule.endTime}</Text>
                <Switch value={schedule.isActive} onValueChange={(val) => onToggle(schedule.id, val)} />
                <TouchableOpacity onPress={() => onEdit(schedule.id)}><Ionicons name="pencil" size={18} color={colors.gray500} /></TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={onAdd}><Ionicons name="add-circle-outline" size={20} color={colors.primary} /></TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg },
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  dayText: { ...typography.variants.body1, fontWeight: typography.weights.medium, width: 40 },
  scheduleInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1, justifyContent: 'flex-end' },
  time: { ...typography.variants.body2, color: colors.gray600 },
  addButton: { padding: spacing.xs },
});
