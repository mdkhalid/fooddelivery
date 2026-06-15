import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDisputes } from '../../hooks';
import { Card, EmptyState, Badge } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatDate } from '../../utils/format';

export const DisputeListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { disputes } = useDisputes();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Disputes</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={disputes}
        renderItem={({ item }) => (
          <Card style={styles.disputeCard}>
            <View style={styles.disputeHeader}>
              <Text style={styles.disputeType}>{item.type.replace('_', ' ')}</Text>
              <Badge value={item.status} variant={item.status === 'resolved' ? 'success' : 'warning'} size="sm" />
            </View>
            <Text style={styles.disputeDescription} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.disputeDate}>{formatDate(item.createdAt)}</Text>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState icon="document-text-outline" title="No disputes" message="Your disputes will appear here" />}
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
  disputeCard: { marginBottom: spacing.md },
  disputeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  disputeType: { ...typography.variants.body1, color: colors.text, fontWeight: typography.weights.medium, textTransform: 'capitalize' },
  disputeDescription: { ...typography.variants.body2, color: colors.textSecondary, marginBottom: spacing.sm },
  disputeDate: { ...typography.variants.caption, color: colors.textSecondary },
});
