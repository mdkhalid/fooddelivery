import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface DividerProps {
  color?: string;
  thickness?: number;
  style?: ViewStyle;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  color = colors.gray200,
  thickness = 1,
  style,
  orientation = 'horizontal',
  label,
}) => {
  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          { backgroundColor: color, width: thickness },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.line, { backgroundColor: color, height: thickness }]} />
        <View style={styles.labelContainer}>
          <View style={[styles.labelLine, { backgroundColor: color, height: thickness }]} />
          <View style={[styles.labelWrapper, { backgroundColor: colors.white }]}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
          <View style={[styles.labelLine, { backgroundColor: color, height: thickness }]} />
        </View>
        <View style={[styles.line, { backgroundColor: color, height: thickness }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        { backgroundColor: color, height: thickness },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    marginVertical: spacing.md,
  },
  vertical: {
    height: '100%',
    marginHorizontal: spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  line: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  labelLine: {
    width: 20,
  },
  labelWrapper: {
    paddingHorizontal: spacing.sm,
  },
  labelText: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: '500',
  },
});
