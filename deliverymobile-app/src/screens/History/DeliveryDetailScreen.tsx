import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { OrderStatusBadge } from '../../components/domain/OrderStatusBadge';
import { useOrderDetail } from '../../hooks/useOrderDetail';
import { formatCurrency, formatDistance, formatDuration, formatDate } from '../../utils/format';
import { HistoryStackParamList } from '../../types/navigation.types';

type DeliveryDetailRouteProp = RouteProp<HistoryStackParamList, 'DeliveryDetail'>;

export const DeliveryDetailScreen: React.FC = () => {
  const route = useRoute<DeliveryDetailRouteProp>();
  const navigation = useNavigation();
  const { deliveryId } = route.params;
  const { order } = useOrderDetail(deliveryId);

  if (!order) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.title}>Delivery #{order.orderNumber}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Restaurant</Text>
          <Text style={styles.value}>{order.restaurant.name}</Text>
          <Text style={styles.subvalue}>{order.restaurant.address}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value}>{order.customer.name}</Text>
          <Text style={styles.subvalue}>{order.deliveryAddress.address}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Summary</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Distance</Text><Text style={styles.rowValue}>{formatDistance(order.distance)}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Duration</Text><Text style={styles.rowValue}>{formatDuration(order.duration)}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Delivered At</Text><Text style={styles.rowValue}>{formatDate(order.deliveredAt || order.assignedAt)}</Text></View>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Earnings</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Delivery Fee</Text><Text style={styles.rowValue}>{formatCurrency(order.deliveryFee)}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Tip</Text><Text style={styles.rowValue}>{formatCurrency(order.tip)}</Text></View>
          <View style={[styles.row, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatCurrency(order.deliveryFee + order.tip)}</Text></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  title: { ...typography.variants.h4, color: colors.text, flex: 1 },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  label: { ...typography.variants.body3, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  value: { ...typography.variants.h5, color: colors.text, marginBottom: spacing.xs },
  subvalue: { ...typography.variants.body2, color: colors.gray600 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { ...typography.variants.body2, color: colors.gray600 },
  rowValue: { ...typography.variants.body2, color: colors.text, fontWeight: typography.weights.medium },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.gray200, marginTop: spacing.sm, paddingTop: spacing.md },
  totalLabel: { ...typography.variants.h5, color: colors.text },
  totalValue: { ...typography.variants.h5, color: colors.success, fontWeight: typography.weights.bold },
});
