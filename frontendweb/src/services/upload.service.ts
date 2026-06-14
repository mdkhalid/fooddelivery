import api from './api';
import type { ApiResponse } from '@/types/api.types';

export interface UploadImageResponse {
  url: string;
}

export interface UploadMultipleImagesResponse {
  urls: string[];
}

export const uploadService = {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<ApiResponse<UploadImageResponse>>('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  async uploadMultipleImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const { data } = await api.post<ApiResponse<UploadMultipleImagesResponse>>(
      '/uploads/images',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data.data;
  },
};
