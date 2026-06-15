import React from 'react';
import { View, StyleSheet } from 'react-native';
import ToastMessage from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

export const toastConfig = {
  success: (props: any) => (
    <View style={[styles.container, styles.success]}><ToastMessage {...props} /></View>
  ),
  error: (props: any) => (
    <View style={[styles.container, styles.error]}><ToastMessage {...props} /></View>
  ),
  info: (props: any) => (
    <View style={[styles.container, styles.info]}><ToastMessage {...props} /></View>
  ),
};

const styles = StyleSheet.create({
  container: { marginHorizontal: spacing.lg, marginTop: spacing.xl, borderRadius: borderRadius.md, backgroundColor: colors.white, borderLeftWidth: 4 },
  success: { borderLeftColor: colors.success },
  error: { borderLeftColor: colors.danger },
  info: { borderLeftColor: colors.info },
});
