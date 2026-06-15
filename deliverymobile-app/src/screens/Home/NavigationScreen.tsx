import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { HomeStackParamList } from '../../types/navigation.types';

type NavigationRouteProp = RouteProp<HomeStackParamList, 'Navigation'>;

export const NavigationScreen: React.FC = () => {
  const route = useRoute<NavigationRouteProp>();
  const { orderId, destination } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.title}>Navigation</Text>
        <Text style={styles.subtitle}>Navigating to {destination === 'restaurant' ? 'Restaurant' : 'Customer'}</Text>
        <Text style={styles.note}>Map integration would go here</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.sm },
  subtitle: { ...typography.variants.body1, color: colors.gray500, marginBottom: spacing.md },
  note: { ...typography.variants.body2, color: colors.gray400, fontStyle: 'italic' },
});
