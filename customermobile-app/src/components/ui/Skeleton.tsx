import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 200,
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const SkeletonRow: React.FC<{ count?: number; style?: ViewStyle }> = ({
  count = 3,
  style,
}) => {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} width={80} height={12} />
      ))}
    </View>
  );
};

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.card, style]}>
      <Skeleton width={300} height={120} borderRadius={8} />
      <View style={styles.cardContent}>
        <Skeleton width={180} height={16} />
        <Skeleton width={120} height={12} />
        <Skeleton width={240} height={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.gray200,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 12,
    gap: 8,
  },
});
