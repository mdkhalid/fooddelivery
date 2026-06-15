import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useOrder, useOrderTracking } from '../../hooks';
import { LoadingState } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export const OrderTrackingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId } = route.params;
  const { data: tracking, isLoading: isTrackingLoading } = useOrderTracking(orderId);
  const { data: order, isLoading: isOrderLoading } = useOrder(orderId);

  if (isTrackingLoading || isOrderLoading) return <LoadingState fullScreen />;
  if (!tracking) return <LoadingState fullScreen />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Order Tracking</Text>
        <View style={styles.connectionDot} />
      </View>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={64} color={colors.gray300} />
        <Text style={styles.mapText}>Live Map</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusText}>{tracking.status.replace('_', ' ').toUpperCase()}</Text>
          <Text style={styles.eta}>ETA: {tracking.estimatedArrival}</Text>
        </View>

        {order?.driver && (
          <View style={styles.driverCard}>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{order.driver.name}</Text>
              <Text style={styles.driverVehicle}>{order.driver.vehicleType} • {order.driver.vehicleNumber}</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
  },
  title: { ...typography.variants.h4, color: colors.text },
  connectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  mapPlaceholder: {
    flex: 1, backgroundColor: colors.gray100, margin: spacing.lg,
    borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center',
  },
  mapText: { ...typography.variants.body2, color: colors.textSecondary, marginTop: spacing.sm },
  statusCard: {
    backgroundColor: colors.white, padding: spacing.xl,
    borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 8,
  },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  statusText: { ...typography.variants.h4, color: colors.text },
  eta: { ...typography.variants.body2, color: colors.primary },
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray50, padding: spacing.md, borderRadius: borderRadius.md },
  driverInfo: { flex: 1 },
  driverName: { ...typography.variants.body1, color: colors.text, fontWeight: typography.weights.medium },
  driverVehicle: { ...typography.variants.caption, color: colors.textSecondary, marginTop: spacing.xxs },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
});
