import React from 'react';
import { View, StyleSheet } from 'react-native';
import ToastMessage from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export const toastConfig = {
  success: (props: any) => (
    <View style={[styles.container, styles.success]}>
      <View style={styles.content}>
        <View style={[styles.indicator, styles.successIndicator]} />
        <View style={styles.textContainer}>
          <ToastMessage {...props} />
        </View>
      </View>
    </View>
  ),
  error: (props: any) => (
    <View style={[styles.container, styles.error]}>
      <View style={styles.content}>
        <View style={[styles.indicator, styles.errorIndicator]} />
        <View style={styles.textContainer}>
          <ToastMessage {...props} />
        </View>
      </View>
    </View>
  ),
  info: (props: any) => (
    <View style={[styles.container, styles.info]}>
      <View style={styles.content}>
        <View style={[styles.indicator, styles.infoIndicator]} />
        <View style={styles.textContainer}>
          <ToastMessage {...props} />
        </View>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  success: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  error: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  info: {
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  successIndicator: {
    backgroundColor: colors.success,
  },
  errorIndicator: {
    backgroundColor: colors.danger,
  },
  infoIndicator: {
    backgroundColor: colors.info,
  },
  textContainer: {
    flex: 1,
  },
});
