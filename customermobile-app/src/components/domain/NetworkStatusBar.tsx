import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import NetInfo from '@react-native-community/netinfo';

export const NetworkStatusBar: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;
      setIsConnected(connected);

      if (!connected) {
        setIsVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Ionicons
        name={isConnected ? 'wifi' : 'wifi-outline'}
        size={16}
        color={colors.white}
      />
      <Text style={styles.message}>
        {isConnected ? 'Back online' : "You're offline"}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray800,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  message: {
    ...typography.variants.caption,
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
});
