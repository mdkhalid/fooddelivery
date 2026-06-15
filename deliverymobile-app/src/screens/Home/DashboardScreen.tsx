import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { OnlineToggle } from '../../components/domain/OnlineToggle';
import { OrderCard } from '../../components/domain/OrderCard';
import { ActiveDeliveryCard } from '../../components/domain/ActiveDeliveryCard';
import { ShiftTimer } from '../../components/domain/ShiftTimer';
import { useOrders } from '../../hooks/useOrders';
import { useAvailability } from '../../hooks/useAvailability';
import { useShiftTimer } from '../../hooks/useShiftTimer';
import { useLocation } from '../../hooks/useLocation';
import { useOrderStore } from '../../stores/orderStore';

export const DashboardScreen: React.FC = () => {
  const { availableOrders, activeOrder, acceptOrder } = useOrders();
  const { goOnline, goOffline } = useAvailability();
  const { isOnline } = useOrderStore();
  const { isShiftActive, formattedDuration, startShift, endShift } = useShiftTimer();
  const { startTracking, stopTracking } = useLocation();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleToggleOnline = () => {
    if (isOnline) { goOffline(undefined); stopTracking(); endShift(); }
    else { goOnline(undefined); startTracking(); startShift(); }
  };

  const onRefresh = async () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <View><Text style={styles.greeting}>Welcome back!</Text><Text style={styles.name}>Driver</Text></View>
          <OnlineToggle isOnline={isOnline} onToggle={handleToggleOnline} />
        </View>
        {isShiftActive && <ShiftTimer duration={formattedDuration} isActive={isShiftActive} />}
        {activeOrder ? (
          <ActiveDeliveryCard order={activeOrder} onNavigate={() => {}} onAction={() => {}} actionLabel="View Order" />
        ) : (
          <View>
            <Text style={styles.sectionTitle}>{isOnline ? 'Available Orders' : 'Go online to see orders'}</Text>
            {isOnline && availableOrders.map(order => <OrderCard key={order.id} order={order} onAccept={() => acceptOrder(order.id)} />)}
            {isOnline && availableOrders.length === 0 && <Text style={styles.empty}>No orders available right now</Text>}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  greeting: { ...typography.variants.body2, color: colors.gray500 },
  name: { ...typography.variants.h3, color: colors.text },
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.lg },
  empty: { ...typography.variants.body1, color: colors.gray500, textAlign: 'center', marginTop: spacing.xl },
});
