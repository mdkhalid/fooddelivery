import api from './api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';
import { Wallet, WalletTransaction, TopUpRequest } from '../types/payment.types';

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    const response = await api.get<ApiResponse<Wallet>>('/wallet');
    return response.data.data;
  },

  topUp: async (data: TopUpRequest): Promise<WalletTransaction> => {
    const response = await api.post<ApiResponse<WalletTransaction>>('/wallet/topup', data);
    return response.data.data;
  },

  getTransactions: async (params: PaginationParams): Promise<PaginatedResponse<WalletTransaction>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<WalletTransaction>>>('/wallet/transactions', { params });
    return response.data.data;
  },

  getBalance: async (): Promise<{ balance: number }> => {
    const response = await api.get<ApiResponse<{ balance: number }>>('/wallet/balance');
    return response.data.data;
  },
};
