import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLoyalty } from '../../hooks';
import { Card, Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export const LoyaltyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { account, rewards } = useLoyalty();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Loyalty & Rewards</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.tierCard}>
          <Text style={styles.tierLabel}>Current Tier</Text>
          <Text style={styles.tierValue}>{account?.tier?.toUpperCase() || 'BRONZE'}</Text>
          <Text style={styles.pointsLabel}>Points Balance</Text>
          <Text style={styles.pointsValue}>{account?.points || 0}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Available Rewards</Text>
        {rewards.map((reward) => (
          <Card key={reward.id} style={styles.rewardCard}>
            <Text style={styles.rewardName}>{reward.name}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
            <Text style={styles.rewardCost}>{reward.pointsCost} points</Text>
            <Button title="Redeem" onPress={() => {}} size="sm" />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  title: { ...typography.variants.h4, color: colors.text },
  content: { padding: spacing.xl },
  tierCard: { alignItems: 'center', paddingVertical: spacing.xxxl, marginBottom: spacing.xl },
  tierLabel: { ...typography.variants.body2, color: colors.textSecondary },
  tierValue: { ...typography.variants.h1, color: colors.primary, marginTop: spacing.sm },
  pointsLabel: { ...typography.variants.body2, color: colors.textSecondary, marginTop: spacing.xl },
  pointsValue: { ...typography.variants.h2, color: colors.text, marginTop: spacing.sm },
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.md },
  rewardCard: { marginBottom: spacing.md },
  rewardName: { ...typography.variants.body1, color: colors.text, fontWeight: typography.weights.medium },
  rewardDescription: { ...typography.variants.body2, color: colors.textSecondary, marginTop: spacing.xs },
  rewardCost: { ...typography.variants.body2, color: colors.primary, marginTop: spacing.sm },
});
