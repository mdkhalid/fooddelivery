import api from './api';
import { ApiResponse } from '../types/api.types';

export const uploadService = {
  uploadImage: async (uri: string, type: 'profile' | 'document' | 'delivery'): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', { uri, type: 'image/jpeg', name: `${type}_${Date.now()}.jpg` } as any);
    formData.append('type', type);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
