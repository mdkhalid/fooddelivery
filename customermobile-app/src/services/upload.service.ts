import api from './api';
import { ApiResponse } from '../types/api.types';

export const uploadService = {
  uploadImage: async (uri: string, type: 'avatar' | 'dispute' | 'general' = 'general'): Promise<{ url: string }> => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : 'image/jpeg';
    formData.append('file', { uri, name: filename, type: mimeType } as any);
    formData.append('type', type);
    const response = await api.post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  uploadMultiple: async (uris: string[], type: 'dispute' | 'general' = 'general'): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    uris.forEach((uri, index) => {
      const filename = uri.split('/').pop() || `image${index}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('files', { uri, name: filename, type: mimeType } as any);
    });
    formData.append('type', type);
    const response = await api.post<ApiResponse<{ urls: string[] }>>('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
