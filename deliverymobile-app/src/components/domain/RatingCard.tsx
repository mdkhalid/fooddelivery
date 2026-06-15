import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Rating } from '../../types/rating.types';
import { RatingStars } from './RatingStars';
import { formatDate } from '../../utils/format';

interface RatingCardProps { rating: Rating; }

export const RatingCard: React.FC<RatingCardProps> = ({ rating }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{rating.ratedBy === 'customer' ? 'Customer' : 'Restaurant'}</Text>
        <Text style={styles.date}>{formatDate(rating.createdAt)}</Text>
      </View>
      <RatingStars rating={rating.rating} />
      {rating.comment && <Text style={styles.comment}>{rating.comment}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  label: { ...typography.variants.body3, color: colors.gray500 },
  date: { ...typography.variants.caption, color: colors.gray400 },
  comment: { ...typography.variants.body2, color: colors.gray600, marginTop: spacing.sm },
});
