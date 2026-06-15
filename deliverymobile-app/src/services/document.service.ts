import api from './api';
import { ApiResponse } from '../types/api.types';
import { Document } from '../types/driver.types';

export const documentService = {
  getDocuments: async (): Promise<ApiResponse<Document[]>> => {
    const response = await api.get('/driver/documents');
    return response.data;
  },

  uploadDocument: async (type: string, fileUri: string): Promise<ApiResponse<Document>> => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', { uri: fileUri, type: 'image/jpeg', name: `${type}.jpg` } as any);
    const response = await api.post('/driver/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteDocument: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/driver/documents/${id}`);
    return response.data;
  },

  getDocumentStatus: async (): Promise<ApiResponse<{ isApproved: boolean; pendingCount: number; rejectedCount: number }>> => {
    const response = await api.get('/driver/documents/status');
    return response.data;
  },
};
