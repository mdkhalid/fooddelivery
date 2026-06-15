import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useOrders } from '../../hooks';
import { Avatar, Card } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatCurrency } from '../../utils/format';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { icon: 'location-outline', label: 'My Addresses', screen: 'AddressList' },
  { icon: 'wallet-outline', label: 'My Wallet', screen: 'Wallet' },
  { icon: 'heart-outline', label: 'My Favorites', screen: 'Favorites' },
  { icon: 'notifications-outline', label: 'Notifications', screen: 'Notifications' },
  { icon: 'star-outline', label: 'Taste Profile', screen: 'TasteProfile' },
  { icon: 'gift-outline', label: 'Loyalty & Rewards', screen: 'Loyalty' },
  { icon: 'receipt-outline', label: 'Scheduled Orders', screen: 'ScheduledOrders' },
  { icon: 'document-text-outline', label: 'Disputes', screen: 'DisputeList' },
  { icon: 'settings-outline', label: 'Settings', screen: 'Settings' },
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { data } = useOrders({ limit: 100 });

  const totalOrders = data?.pagination?.total || 0;
  const totalSpent = data?.data?.reduce((sum, order) => sum + order.total, 0) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <Avatar uri={user?.avatar} name={user?.name} size="xl" />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCurrency(totalSpent)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.screen}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons name={item.icon} size={24} color={colors.gray600} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  title: { ...typography.variants.h2, color: colors.text },
  profileSection: { alignItems: 'center', paddingVertical: spacing.xl },
  userName: { ...typography.variants.h3, color: colors.text, marginTop: spacing.md },
  userEmail: { ...typography.variants.body2, color: colors.textSecondary, marginTop: spacing.xs },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: spacing.xl,
    borderRadius: borderRadius.lg, padding: spacing.xl, marginBottom: spacing.xl,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.variants.h3, color: colors.primary },
  statLabel: { ...typography.variants.caption, color: colors.textSecondary, marginTop: spacing.xs },
  statDivider: { width: 1, backgroundColor: colors.gray200 },
  menuCard: { marginHorizontal: spacing.xl },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  menuLabel: { flex: 1, ...typography.variants.body1, color: colors.text, marginLeft: spacing.md },
  badge: { backgroundColor: colors.primary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xs },
  badgeText: { ...typography.variants.caption, color: colors.white, fontSize: 10 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.xl, marginTop: spacing.lg, paddingVertical: spacing.lg,
    backgroundColor: colors.danger + '10', borderRadius: borderRadius.lg,
  },
  logoutText: { ...typography.variants.body1, color: colors.danger, marginLeft: spacing.sm },
});
