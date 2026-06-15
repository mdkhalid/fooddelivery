import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface RatingSheetProps {
  title?: string;
  onSubmit: (rating: number, comment: string) => void;
  onCancel?: () => void;
}

export const RatingSheet: React.FC<RatingSheetProps> = ({
  title = 'Rate your experience',
  onSubmit,
  onCancel,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color={star <= rating ? colors.warning : colors.gray300}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      {rating > 0 && (
        <Text style={styles.ratingText}>
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Add a comment (optional)"
        placeholderTextColor={colors.gray400}
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <View style={styles.actions}>
        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  title: {
    ...typography.variants.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  star: {
    marginHorizontal: spacing.sm,
  },
  ratingText: {
    ...typography.variants.body1,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xl,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 100,
    ...typography.variants.body1,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  cancelText: {
    ...typography.variants.body1,
    color: colors.gray600,
  },
  submitButton: {
    flex: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    ...typography.variants.body1,
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
});
