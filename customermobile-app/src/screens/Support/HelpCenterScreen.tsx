import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export const HelpCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const helpCategories: HelpCategory[] = [
    {
      id: '1',
      title: 'Orders',
      icon: 'receipt-outline',
      description: 'Track, modify, or cancel orders',
    },
    {
      id: '2',
      title: 'Delivery',
      icon: 'bicycle-outline',
      description: 'Delivery times and fees',
    },
    {
      id: '3',
      title: 'Account',
      icon: 'person-outline',
      description: 'Profile settings and preferences',
    },
    {
      id: '4',
      title: 'Payments',
      icon: 'card-outline',
      description: 'Payment methods and refunds',
    },
    {
      id: '5',
      title: 'Promotions',
      icon: 'pricetag-outline',
      description: 'Coupons and special offers',
    },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time from the Orders tab. Simply tap on your active order to see the live map and delivery status.',
      category: 'Orders',
    },
    {
      id: '2',
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within 5 minutes of placing it. After that, the restaurant may have already started preparing your food.',
      category: 'Orders',
    },
    {
      id: '3',
      question: 'What are the delivery hours?',
      answer: 'Delivery hours vary by restaurant. Most restaurants deliver from 10 AM to 11 PM. Check the restaurant details for specific hours.',
      category: 'Delivery',
    },
    {
      id: '4',
      question: 'How is the delivery fee calculated?',
      answer: 'Delivery fees are based on distance, demand, and restaurant. Free delivery may be available for orders above a certain amount.',
      category: 'Delivery',
    },
    {
      id: '5',
      question: 'How do I update my payment method?',
      answer: 'Go to Profile > Payment Methods to add, remove, or set a default payment method.',
      category: 'Payments',
    },
    {
      id: '6',
      question: 'How do I apply a coupon?',
      answer: 'Enter your coupon code in the cart before checkout. The discount will be applied to your order total.',
      category: 'Promotions',
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search help topics..."
          placeholderTextColor={colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help Categories</Text>
        <View style={styles.categoriesGrid}>
          {helpCategories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon as any} size={24} color={colors.primary} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {filteredFAQs.map((faq) => (
          <TouchableOpacity key={faq.id} style={styles.faqItem} onPress={() => toggleFAQ(faq.id)}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.gray500}
              />
            </View>
            {expandedFAQ === faq.id && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Still need help?</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => navigation.navigate('Chat' as never)}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Start a Chat</Text>
            <Text style={styles.contactDescription}>Chat with our support team</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.variants.body1,
    paddingVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.variants.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  categoryTitle: {
    ...typography.variants.body1,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    ...typography.variants.caption,
    color: colors.gray500,
    lineHeight: 18,
  },
  faqItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    ...typography.variants.body1,
    fontWeight: typography.weights.medium,
    flex: 1,
    marginRight: spacing.md,
  },
  faqAnswer: {
    ...typography.variants.body2,
    color: colors.gray600,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...typography.variants.body1,
    fontWeight: typography.weights.medium,
  },
  contactDescription: {
    ...typography.variants.caption,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
});
