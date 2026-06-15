import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal as RNModal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface SelectOption { label: string; value: string; }
interface SelectProps { label?: string; options: SelectOption[]; value?: string; placeholder?: string; onValueChange: (value: string) => void; error?: string; }

export const Select: React.FC<SelectProps> = ({ label, options, value, placeholder = 'Select', onValueChange, error }) => {
  const [isVisible, setIsVisible] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={[styles.button, error && styles.error]} onPress={() => setIsVisible(true)}>
        <Text style={[styles.buttonText, !selected && styles.placeholder]}>{selected?.label || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.gray500} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <RNModal visible={isVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setIsVisible(false)}>
          <View style={styles.modal}>
            <FlatList data={options} keyExtractor={item => item.value} renderItem={({ item }) => (
              <TouchableOpacity style={[styles.option, item.value === value && styles.optionSelected]} onPress={() => { onValueChange(item.value); setIsVisible(false); }}>
                <Text style={[styles.optionText, item.value === value && styles.optionTextSelected]}>{item.label}</Text>
                {item.value === value && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            )} />
          </View>
        </TouchableOpacity>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { ...typography.variants.body2, color: colors.gray700, marginBottom: spacing.xs },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.gray300, borderRadius: borderRadius.md, backgroundColor: colors.white, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  error: { borderColor: colors.danger },
  buttonText: { ...typography.variants.body1, color: colors.text, flex: 1 },
  placeholder: { color: colors.gray400 },
  errorText: { ...typography.variants.caption, color: colors.danger, marginTop: spacing.xs },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.white, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, maxHeight: '60%', padding: spacing.lg },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  optionSelected: { backgroundColor: colors.primaryLight + '10' },
  optionText: { ...typography.variants.body1, color: colors.text, flex: 1 },
  optionTextSelected: { color: colors.primary, fontWeight: typography.weights.semibold },
});
