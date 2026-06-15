import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { OrderStatusBadge } from '../../components/domain/OrderStatusBadge';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate, formatDistance } from '../../utils/format';
import { Order } from '../../types/order.types';

export const DeliveryHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { availableOrders, isLoading } = useOrders();

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: item.id })}>
      <View style={styles.header}>
        <Text style={styles.restaurant}>{item.restaurant.name}</Text>
        <OrderStatusBadge status={item.status} />
      </View>
      <Text style={styles.address}>{item.deliveryAddress.address}</Text>
      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(item.deliveredAt || item.assignedAt)}</Text>
        <Text style={styles.earning}>{formatCurrency(item.deliveryFee + item.tip)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={[]} keyExtractor={item => item.id} contentContainerStyle={styles.list} ListHeaderComponent={<Text style={styles.title}>Delivery History</Text>} renderItem={renderItem} ListEmptyComponent={<View style={styles.empty}><Ionicons name="receipt-outline" size={48} color={colors.gray300} /><Text style={styles.emptyText}>{isLoading ? 'Loading...' : 'No deliveries yet'}</Text></View>} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.xl },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  restaurant: { ...typography.variants.h5, color: colors.text, flex: 1 },
  address: { ...typography.variants.body2, color: colors.gray500, marginBottom: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { ...typography.variants.caption, color: colors.gray500 },
  earning: { ...typography.variants.body1, color: colors.success, fontWeight: typography.weights.bold },
  empty: { alignItems: 'center', marginTop: spacing.xxxl, gap: spacing.md },
  emptyText: { ...typography.variants.body1, color: colors.gray500 },
});
