import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface OnlineToggleProps { isOnline: boolean; onToggle: () => void; isLoading?: boolean; }

export const OnlineToggle: React.FC<OnlineToggleProps> = ({ isOnline, onToggle, isLoading }) => {
  return (
    <TouchableOpacity style={[styles.container, isOnline ? styles.online : styles.offline]} onPress={onToggle} disabled={isLoading}>
      <View style={[styles.dot, isOnline && styles.dotOnline]} />
      <Text style={[styles.text, isOnline ? styles.textOnline : styles.textOffline]}>{isOnline ? 'Online' : 'Offline'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: borderRadius.round, gap: spacing.sm },
  online: { backgroundColor: colors.online + '20' },
  offline: { backgroundColor: colors.gray200 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.offline },
  dotOnline: { backgroundColor: colors.online },
  text: { ...typography.variants.button },
  textOnline: { color: colors.online },
  textOffline: { color: colors.gray500 },
});
