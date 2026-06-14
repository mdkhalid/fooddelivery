import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type { ApplyPromoResponse } from '@/types/cart.types';

export interface ValidateCouponParams {
  code: string;
  cartId?: string;
  cartSubtotal?: number;
  restaurantId?: string;
}

export const couponService = {
  async validateCoupon(code: string, cartId?: string) {
    const { data } = await api.post<ApiResponse<ApplyPromoResponse>>('/coupons/validate', {
      code,
      cartId,
    } satisfies ValidateCouponParams);
    return data.data;
  },
};
