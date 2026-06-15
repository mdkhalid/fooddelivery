import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface TextInputProps { label?: string; placeholder?: string; value: string; onChangeText: (text: string) => void; secureTextEntry?: boolean; error?: string; isRequired?: boolean; icon?: string; multiline?: boolean; numberOfLines?: number; keyboardType?: any; autoCapitalize?: any; maxLength?: number; editable?: boolean; }

export const TextInput: React.FC<TextInputProps> = ({ label, placeholder, value, onChangeText, secureTextEntry, error, isRequired, icon, multiline, numberOfLines, keyboardType, autoCapitalize, maxLength, editable = true }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, isRequired && styles.required]}>{label}{isRequired && <Text style={styles.asterisk}> *</Text>}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.focused, error && styles.error, !editable && styles.disabled]}>
        {icon && <Ionicons name={icon as any} size={20} color={isFocused ? colors.primary : colors.gray400} style={styles.icon} />}
        <RNTextInput style={[styles.input, multiline && styles.multiline]} placeholder={placeholder} placeholderTextColor={colors.gray400} value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry && !isPasswordVisible} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} keyboardType={keyboardType} autoCapitalize={autoCapitalize} multiline={multiline} numberOfLines={numberOfLines} editable={editable} maxLength={maxLength} />
        {secureTextEntry && <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}><Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color={colors.gray400} /></TouchableOpacity>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { ...typography.variants.body2, color: colors.gray700, marginBottom: spacing.xs },
  required: { color: colors.danger },
  asterisk: { color: colors.danger },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.gray300, borderRadius: borderRadius.md, backgroundColor: colors.white, paddingHorizontal: spacing.md },
  focused: { borderColor: colors.primary },
  error: { borderColor: colors.danger },
  disabled: { backgroundColor: colors.gray100 },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, ...typography.variants.body1, paddingVertical: spacing.md },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  errorText: { ...typography.variants.caption, color: colors.danger, marginTop: spacing.xs },
});
