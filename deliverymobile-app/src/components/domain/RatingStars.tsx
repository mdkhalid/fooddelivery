import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface RatingStarsProps { rating: number; size?: number; interactive?: boolean; onRate?: (rating: number) => void; }

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 20, interactive = false, onRate }) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => interactive && onRate?.(star)} disabled={!interactive}>
          <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={size} color={star <= rating ? colors.warning : colors.gray300} style={styles.star} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({ container: { flexDirection: 'row' }, star: { marginRight: 2 } });
