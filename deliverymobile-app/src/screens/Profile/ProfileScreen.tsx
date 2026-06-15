import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Avatar } from '../../components/ui/Avatar';
import { useAuthStore } from '../../stores/authStore';

interface MenuItem { icon: string; label: string; screen: string; color?: string; }

const menuItems: MenuItem[] = [
  { icon: 'car-outline', label: 'My Vehicle', screen: 'Vehicle' },
  { icon: 'document-text-outline', label: 'Documents', screen: 'Documents' },
  { icon: 'calendar-outline', label: 'Availability', screen: 'Availability' },
  { icon: 'star-outline', label: 'Ratings', screen: 'Rating' },
  { icon: 'help-circle-outline', label: 'Support', screen: 'Support' },
  { icon: 'settings-outline', label: 'Settings', screen: 'Settings' },
  { icon: 'log-out-outline', label: 'Sign Out', screen: 'Logout', color: colors.danger },
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const handleMenuPress = (item: MenuItem) => {
    if (item.screen === 'Logout') { /* logout logic */ }
    else navigation.navigate(item.screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Avatar uri={user?.avatar} name={user?.name} size={80} />
          <Text style={styles.name}>{user?.name || 'Driver'}</Text>
          <Text style={styles.email}>{user?.email || 'driver@email.com'}</Text>
        </View>
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handleMenuPress(item)}>
              <Ionicons name={item.icon as any} size={24} color={item.color || colors.gray600} />
              <Text style={[styles.menuLabel, item.color && { color: item.color }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.xl, paddingVertical: spacing.xl },
  name: { ...typography.variants.h3, color: colors.text, marginTop: spacing.md },
  email: { ...typography.variants.body2, color: colors.gray500, marginTop: spacing.xs },
  menu: { backgroundColor: colors.white, borderRadius: borderRadius.lg, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.gray100, gap: spacing.md },
  menuLabel: { ...typography.variants.body1, color: colors.text, flex: 1 },
});
