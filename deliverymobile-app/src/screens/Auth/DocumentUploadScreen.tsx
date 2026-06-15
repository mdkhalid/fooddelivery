import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { DocumentUploader } from '../../components/domain/DocumentUploader';
import { useDocuments } from '../../hooks/useDocuments';

export const DocumentUploadScreen: React.FC = () => {
  const { documents, uploadDocument } = useDocuments();

  const handleUpload = (type: string) => {
    uploadDocument({ type, fileUri: 'mock_uri' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Upload Documents</Text>
        <Text style={styles.subtitle}>Please upload the required documents to get approved</Text>
        <View style={styles.documents}>
          <DocumentUploader type="profile_photo" label="Profile Photo" document={documents.find(d => d.type === 'profile_photo')} onUpload={() => handleUpload('profile_photo')} />
          <DocumentUploader type="driving_license" label="Driving License" document={documents.find(d => d.type === 'driving_license')} onUpload={() => handleUpload('driving_license')} />
          <DocumentUploader type="vehicle_registration" label="Vehicle Registration" document={documents.find(d => d.type === 'vehicle_registration')} onUpload={() => handleUpload('vehicle_registration')} />
          <DocumentUploader type="insurance" label="Insurance Certificate" document={documents.find(d => d.type === 'insurance')} onUpload={() => handleUpload('insurance')} />
        </View>
        <Button title="Continue" onPress={() => {}} style={styles.button} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.variants.body1, color: colors.gray500, marginBottom: spacing.xl },
  documents: { gap: spacing.md },
  button: { marginTop: spacing.xl },
});
