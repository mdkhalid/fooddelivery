import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
  User,
  UpdateProfileRequest,
  UploadAvatarResponse,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  Wallet,
} from '@/types/user.types';

export const userService = {
  async getProfile() {
    const { data } = await api.get<ApiResponse<User>>('/users/profile');
    return data.data;
  },

  async updateProfile(requestData: UpdateProfileRequest) {
    const { data } = await api.put<ApiResponse<User>>('/users/profile', requestData);
    return data.data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await api.post<ApiResponse<UploadAvatarResponse>>('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  async getAddresses() {
    const { data } = await api.get<ApiResponse<Address[]>>('/users/addresses');
    return data.data;
  },

  async addAddress(requestData: CreateAddressRequest) {
    const { data } = await api.post<ApiResponse<Address>>('/users/addresses', requestData);
    return data.data;
  },

  async updateAddress(id: string, requestData: UpdateAddressRequest) {
    const { data } = await api.put<ApiResponse<Address>>(
      `/users/addresses/${id}`,
      requestData,
    );
    return data.data;
  },

  async deleteAddress(id: string) {
    const { data } = await api.delete<ApiResponse<{ message: string }>>(`/users/addresses/${id}`);
    return data.data;
  },

  async setDefaultAddress(id: string) {
    const { data } = await api.patch<ApiResponse<Address>>(
      `/users/addresses/${id}/default`,
    );
    return data.data;
  },

  async getWallet() {
    const { data } = await api.get<ApiResponse<Wallet>>('/users/wallet');
    return data.data;
  },

  async topUpWallet(amount: number) {
    const { data } = await api.post<ApiResponse<{ clientSecret?: string; transactionId: string }>>(
      '/users/wallet/topup',
      { amount },
    );
    return data.data;
  },
};
