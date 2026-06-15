import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal as RNModal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  error?: string;
  isRequired?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  placeholder = 'Select an option',
  onValueChange,
  error,
  isRequired = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isRequired && styles.required]}>
          {label}
          {isRequired && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.selectButton, error && styles.error]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.selectText, !selectedOption && styles.placeholder]}>
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.gray500} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <RNModal visible={isVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item.value === value && styles.optionSelected]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, item.value === value && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                  {item.value === value && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { ...typography.variants.body2, color: colors.gray700, marginBottom: spacing.xs },
  required: { color: colors.danger },
  asterisk: { color: colors.danger },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  error: { borderColor: colors.danger },
  selectText: { ...typography.variants.body1, color: colors.text, flex: 1 },
  placeholder: { color: colors.gray400 },
  errorText: { ...typography.variants.caption, color: colors.danger, marginTop: spacing.xs },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: { ...typography.variants.h4, color: colors.text },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  optionSelected: { backgroundColor: colors.primaryLight + '10' },
  optionText: { ...typography.variants.body1, color: colors.text },
  optionTextSelected: { color: colors.primary, fontWeight: typography.weights.medium },
});
