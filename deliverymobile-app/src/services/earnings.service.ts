import api from './api';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { EarningsSummary, EarningEntry, Payout, PayoutSettings, Incentive } from '../types/earnings.types';

export const earningsService = {
  getSummary: async (): Promise<ApiResponse<EarningsSummary>> => {
    const response = await api.get('/driver/earnings/summary');
    return response.data;
  },

  getEarnings: async (startDate?: string, endDate?: string, page = 1): Promise<ApiResponse<PaginatedResponse<EarningEntry>>> => {
    const params = new URLSearchParams({ page: String(page) });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/driver/earnings?${params.toString()}`);
    return response.data;
  },

  getPayouts: async (page = 1): Promise<ApiResponse<PaginatedResponse<Payout>>> => {
    const response = await api.get(`/driver/payouts?page=${page}`);
    return response.data;
  },

  getPayoutSettings: async (): Promise<ApiResponse<PayoutSettings>> => {
    const response = await api.get('/driver/payout-settings');
    return response.data;
  },

  updatePayoutSettings: async (settings: Partial<PayoutSettings>): Promise<ApiResponse<PayoutSettings>> => {
    const response = await api.put('/driver/payout-settings', settings);
    return response.data;
  },

  requestPayout: async (amount: number): Promise<ApiResponse<Payout>> => {
    const response = await api.post('/driver/payouts/request', { amount });
    return response.data;
  },

  getIncentives: async (): Promise<ApiResponse<Incentive[]>> => {
    const response = await api.get('/driver/incentives');
    return response.data;
  },
};
