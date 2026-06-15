import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { DocumentUploader } from '../../components/domain/DocumentUploader';
import { useDocuments } from '../../hooks/useDocuments';

export const DocumentsScreen: React.FC = () => {
  const { documents, uploadDocument, status } = useDocuments();

  const handleUpload = (type: string) => { uploadDocument({ type, fileUri: 'mock_uri' }); };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Documents</Text>
        {status && (
          <View style={styles.statusBar}>
            <View style={[styles.statusDot, { backgroundColor: status.isApproved ? colors.success : colors.warning }]} />
            <Text style={styles.statusText}>{status.isApproved ? 'All documents approved' : `${status.pendingCount} pending, ${status.rejectedCount} rejected`}</Text>
          </View>
        )}
        <View style={styles.documents}>
          <DocumentUploader type="profile_photo" label="Profile Photo" document={documents.find(d => d.type === 'profile_photo')} onUpload={() => handleUpload('profile_photo')} onDelete={() => {}} />
          <DocumentUploader type="driving_license" label="Driving License" document={documents.find(d => d.type === 'driving_license')} onUpload={() => handleUpload('driving_license')} onDelete={() => {}} />
          <DocumentUploader type="vehicle_registration" label="Vehicle Registration" document={documents.find(d => d.type === 'vehicle_registration')} onUpload={() => handleUpload('vehicle_registration')} onDelete={() => {}} />
          <DocumentUploader type="insurance" label="Insurance Certificate" document={documents.find(d => d.type === 'insurance')} onUpload={() => handleUpload('insurance')} onDelete={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.lg },
  statusBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, marginBottom: spacing.xl, gap: spacing.sm },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { ...typography.variants.body2, color: colors.gray600 },
  documents: { gap: spacing.md },
});
