import React from 'react';
import { Switch as RNSwitch, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface SwitchProps { value: boolean; onValueChange: (value: boolean) => void; label?: string; disabled?: boolean; }

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange, label, disabled }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNSwitch value={value} onValueChange={onValueChange} trackColor={{ false: colors.gray300, true: colors.primaryLight }} thumbColor={value ? colors.primary : colors.gray400} disabled={disabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  label: { ...typography.variants.body1, color: colors.text, flex: 1 },
});
