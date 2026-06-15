import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { EmergencyButton } from '../../components/domain/EmergencyButton';
import { useSupport } from '../../hooks/useSupport';

const HELP_CATEGORIES = [
  { icon: 'receipt-outline', label: 'Order Issue', category: 'order' },
  { icon: 'navigate-outline', label: 'Navigation Issue', category: 'navigation' },
  { icon: 'card-outline', label: 'Payment Issue', category: 'payment' },
  { icon: 'person-outline', label: 'Customer Issue', category: 'customer' },
  { icon: 'car-outline', label: 'Vehicle Issue', category: 'vehicle' },
];

export const SupportScreen: React.FC = () => {
  const { createTicket } = useSupport();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'How do I go online?', a: 'Tap the Online/Offline toggle on the dashboard. Make sure your location services are enabled.' },
    { q: 'How do I update delivery status?', a: 'Use the action buttons on the active delivery card to progress through each delivery stage.' },
    { q: 'When do I get paid?', a: 'Payouts are processed according to your payout schedule (daily/weekly/bi-weekly) to your linked bank account.' },
    { q: 'What if a customer is not available?', a: 'Wait 10 minutes, then mark as "Failed Delivery". The order will be returned to the restaurant.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Support</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report a Problem</Text>
          <View style={styles.categories}>
            {HELP_CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.category} style={styles.categoryCard} onPress={() => createTicket({ category: cat.category, subject: cat.label, description: '' })}>
                <Ionicons name={cat.icon as any} size={24} color={colors.primary} />
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          {faqs.map((faq, index) => (
            <TouchableOpacity key={index} style={styles.faqItem} onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Ionicons name={expandedFaq === index ? 'chevron-up' : 'chevron-down'} size={20} color={colors.gray500} />
              </View>
              {expandedFaq === index && <Text style={styles.faqAnswer}>{faq.a}</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <EmergencyButton />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text },
  section: {},
  sectionTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.md },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  categoryCard: { width: '47%', backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.gray200 },
  categoryLabel: { ...typography.variants.body3, color: colors.text, fontWeight: typography.weights.medium },
  faqItem: { backgroundColor: colors.white, borderRadius: borderRadius.md, padding: spacing.lg, marginBottom: spacing.sm },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { ...typography.variants.body1, fontWeight: typography.weights.medium, flex: 1, marginRight: spacing.md },
  faqAnswer: { ...typography.variants.body2, color: colors.gray600, marginTop: spacing.md, lineHeight: 22 },
});
