import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/document.service';

export const useDocuments = () => {
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await documentService.getDocuments();
      return response.data;
    },
  });

  const statusQuery = useQuery({
    queryKey: ['documents', 'status'],
    queryFn: async () => {
      const response = await documentService.getDocumentStatus();
      return response.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ type, fileUri }: { type: string; fileUri: string }) =>
      documentService.uploadDocument(type, fileUri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return {
    documents: documentsQuery.data || [],
    status: statusQuery.data,
    uploadDocument: uploadMutation.mutate,
    deleteDocument: deleteMutation.mutate,
    isLoading: documentsQuery.isLoading,
  };
};