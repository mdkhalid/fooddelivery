import api from './api';
import { ApiResponse } from '../types/api.types';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
}

export const couponService = {
  validateCoupon: async (code: string, subtotal: number): Promise<{ isValid: boolean; coupon?: Coupon; error?: string }> => {
    const response = await api.get<ApiResponse<{ isValid: boolean; coupon?: Coupon; error?: string }>>('/coupons/validate', {
      params: { code, subtotal },
    });
    return response.data.data;
  },

  getAvailableCoupons: async (): Promise<Coupon[]> => {
    const response = await api.get<ApiResponse<Coupon[]>>('/coupons/available');
    return response.data.data;
  },

  applyCoupon: async (code: string, orderId: string): Promise<{ discount: number }> => {
    const response = await api.post<ApiResponse<{ discount: number }>>('/coupons/apply', { code, orderId });
    return response.data.data;
  },
};
