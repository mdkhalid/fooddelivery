import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStepIndex: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStepIndex }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;

        return (
          <React.Fragment key={step.id}>
            <View style={styles.step}>
              <View style={[styles.circle, isActive && styles.activeCircle, isCompleted && styles.completedCircle]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                ) : (
                  <View style={[styles.dot, isActive && styles.activeDot]} />
                )}
              </View>
              <View style={[styles.labelContainer, index === steps.length - 1 && styles.labelContainerLast]}>
                <Text style={[styles.labelText, isActive && styles.activeLabelText, isCompleted && styles.completedLabelText]}>
                  {step.label}
                </Text>
              </View>
            </View>
            {index < steps.length - 1 && (
              <View style={[styles.line, isCompleted && styles.completedLine]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  step: {
    alignItems: 'center',
    width: 80,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  activeCircle: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  completedCircle: {
    backgroundColor: colors.success,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray400,
  },
  activeDot: {
    backgroundColor: colors.white,
  },
  labelContainer: {
    alignItems: 'center',
    flex: 1,
  },
  labelContainerLast: {
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 12,
    color: colors.gray500,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeLabelText: {
    color: colors.primary,
    fontWeight: '700',
  },
  completedLabelText: {
    color: colors.success,
  },
  line: {
    height: 2,
    width: 40,
    backgroundColor: colors.gray200,
    marginTop: 15,
  },
  completedLine: {
    backgroundColor: colors.success,
  },
});
