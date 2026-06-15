import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAddresses } from '../../hooks';
import { Card, EmptyState, Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export const AddressListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { addresses, deleteAddress, setDefault } = useAddresses();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Addresses</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        renderItem={({ item }) => (
          <Card style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.addressTitle}>{item.street}</Text>
            </View>
            <Text style={styles.addressText}>{item.street}, {item.building || ''}</Text>
            <View style={styles.addressActions}>
              <Button title="Set Default" variant="ghost" size="sm" onPress={() => setDefault(item.id)} />
              <Button title="Delete" variant="ghost" size="sm" onPress={() => deleteAddress(item.id)} />
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState icon="location-outline" title="No addresses" message="Add your first delivery address" actionLabel="Add Address" onAction={() => navigation.navigate('AddAddress')} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  title: { ...typography.variants.h4, color: colors.text },
  listContent: { padding: spacing.xl },
  addressCard: { marginBottom: spacing.md },
  addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  addressTitle: { ...typography.variants.body1, color: colors.text, fontWeight: typography.weights.medium, marginLeft: spacing.sm },
  addressText: { ...typography.variants.body2, color: colors.textSecondary, marginBottom: spacing.md },
  addressActions: { flexDirection: 'row', justifyContent: 'flex-end' },
});
