import api from './api';
import { ApiResponse } from '../types/api.types';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types/user.types';
import { Address } from '../types/restaurant.types';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<ApiResponse<UserProfile>>('/user/profile');
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.put<ApiResponse<UserProfile>>('/user/profile', data);
    return response.data.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.put('/user/password', data);
  },

  uploadAvatar: async (uri: string): Promise<{ url: string }> => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    formData.append('avatar', { uri, name: filename, type } as any);
    const response = await api.post<ApiResponse<{ url: string }>>('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get<ApiResponse<Address[]>>('/user/addresses');
    return response.data.data;
  },

  addAddress: async (data: Omit<Address, 'id'>): Promise<Address> => {
    const response = await api.post<ApiResponse<Address>>('/user/addresses', data);
    return response.data.data;
  },

  updateAddress: async (addressId: string, data: Partial<Address>): Promise<Address> => {
    const response = await api.put<ApiResponse<Address>>(`/user/addresses/${addressId}`, data);
    return response.data.data;
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await api.delete(`/user/addresses/${addressId}`);
  },

  setDefaultAddress: async (addressId: string): Promise<void> => {
    await api.put(`/user/addresses/${addressId}/default`);
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.delete('/user/account', { data: { password } });
  },
};
