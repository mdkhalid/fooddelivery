import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface EmergencyButtonProps { phoneNumber?: string; }

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ phoneNumber = '911' }) => {
  const handlePress = () => {
    Alert.alert('Emergency', 'Call emergency services?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${phoneNumber}`) },
    ]);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Ionicons name="call" size={24} color={colors.white} />
      <Text style={styles.text}>Emergency</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.danger, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: borderRadius.md, gap: spacing.sm },
  text: { ...typography.variants.button, color: colors.white },
});
