import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface SkeletonProps { width: number; height: number; borderRadius?: number; style?: ViewStyle; }

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }), Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })])).start();
  }, []);
  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: colors.gray200, opacity }, style]} />;
};
