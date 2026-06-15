import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface OrderStatusTimelineProps {
  steps: TimelineStep[];
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.step}>
          <View style={styles.indicatorContainer}>
            <View
              style={[
                styles.indicator,
                step.isCompleted && styles.completedIndicator,
                step.isCurrent && styles.currentIndicator,
              ]}
            >
              {step.isCompleted ? (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              ) : step.isCurrent ? (
                <View style={styles.currentDot} />
              ) : (
                <View style={styles.pendingDot} />
              )}
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  (step.isCompleted || step.isCurrent) && styles.completedLine,
                ]}
              />
            )}
          </View>
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                step.isCompleted && styles.completedTitle,
                step.isCurrent && styles.currentTitle,
              ]}
            >
              {step.title}
            </Text>
            {step.description && (
              <Text style={styles.description}>{step.description}</Text>
            )}
            {step.timestamp && <Text style={styles.timestamp}>{step.timestamp}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
  },
  step: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  indicatorContainer: {
    alignItems: 'center',
    width: 28,
  },
  indicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  completedIndicator: {
    backgroundColor: colors.success,
  },
  currentIndicator: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray400,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: colors.gray200,
    marginTop: 4,
  },
  completedLine: {
    backgroundColor: colors.success,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    marginTop: -4,
  },
  title: {
    ...typography.variants.body1,
    color: colors.gray500,
    fontWeight: typography.weights.medium,
  },
  completedTitle: {
    color: colors.success,
  },
  currentTitle: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  description: {
    ...typography.variants.caption,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  timestamp: {
    ...typography.variants.caption,
    color: colors.gray400,
    marginTop: spacing.xs,
  },
});
