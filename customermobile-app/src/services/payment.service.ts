import api from './api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';
import { PaymentMethod, PaymentTransaction, Wallet, TopUpRequest } from '../types/payment.types';

export const paymentService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get<ApiResponse<PaymentMethod[]>>('/payment/methods');
    return response.data.data;
  },

  addPaymentMethod: async (data: { token: string; isDefault?: boolean }): Promise<PaymentMethod> => {
    const response = await api.post<ApiResponse<PaymentMethod>>('/payment/methods', data);
    return response.data.data;
  },

  deletePaymentMethod: async (methodId: string): Promise<void> => {
    await api.delete(`/payment/methods/${methodId}`);
  },

  setDefaultPaymentMethod: async (methodId: string): Promise<void> => {
    await api.put(`/payment/methods/${methodId}/default`);
  },

  getWallet: async (): Promise<Wallet> => {
    const response = await api.get<ApiResponse<Wallet>>('/payment/wallet');
    return response.data.data;
  },

  topUpWallet: async (data: TopUpRequest): Promise<PaymentTransaction> => {
    const response = await api.post<ApiResponse<PaymentTransaction>>('/payment/wallet/topup', data);
    return response.data.data;
  },

  getWalletTransactions: async (params: PaginationParams): Promise<PaginatedResponse<PaymentTransaction>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<PaymentTransaction>>>('/payment/wallet/transactions', { params });
    return response.data.data;
  },

  getTransactions: async (params: PaginationParams): Promise<PaginatedResponse<PaymentTransaction>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<PaymentTransaction>>>('/payment/transactions', { params });
    return response.data.data;
  },
};
