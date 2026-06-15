import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Document } from '../../types/driver.types';

interface DocumentUploaderProps { type: string; label: string; document?: Document; onUpload: () => void; onDelete?: () => void; }

const getStatusConfig = (status: Document['status']) => {
  switch (status) {
    case 'approved': return { color: colors.success, icon: 'checkmark-circle' as const, label: 'Approved' };
    case 'rejected': return { color: colors.danger, icon: 'close-circle' as const, label: 'Rejected' };
    case 'pending': return { color: colors.warning, icon: 'time' as const, label: 'Pending' };
    default: return { color: colors.gray400, icon: 'cloud-upload' as const, label: 'Upload' };
  }
};

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ type, label, document, onUpload, onDelete }) => {
  const status = document ? getStatusConfig(document.status) : null;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {document ? (
        <View style={styles.document}>
          <Image source={{ uri: document.url }} style={styles.preview} />
          <View style={styles.documentInfo}>
            <Ionicons name={status?.icon || 'document'} size={16} color={status?.color || colors.gray400} />
            <Text style={[styles.status, { color: status?.color || colors.gray400 }]}>{status?.label}</Text>
          </View>
          {onDelete && <TouchableOpacity onPress={onDelete}><Ionicons name="trash" size={20} color={colors.danger} /></TouchableOpacity>}
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={onUpload}>
          <Ionicons name="cloud-upload" size={32} color={colors.primary} />
          <Text style={styles.uploadText}>Tap to upload</Text>
        </TouchableOpacity>
      )}
      {document?.status === 'rejected' && document.rejectionReason && <Text style={styles.rejectionReason}>{document.rejectionReason}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.variants.body1, fontWeight: typography.weights.medium, color: colors.text, marginBottom: spacing.sm },
  document: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray50, borderRadius: borderRadius.md, padding: spacing.md },
  preview: { width: 60, height: 40, borderRadius: borderRadius.sm, marginRight: spacing.md },
  documentInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  status: { ...typography.variants.body3, fontWeight: typography.weights.medium },
  uploadButton: { borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: borderRadius.md, padding: spacing.xl, alignItems: 'center', backgroundColor: colors.primary + '05' },
  uploadText: { ...typography.variants.body2, color: colors.primary, marginTop: spacing.sm },
  rejectionReason: { ...typography.variants.caption, color: colors.danger, marginTop: spacing.xs },
});
