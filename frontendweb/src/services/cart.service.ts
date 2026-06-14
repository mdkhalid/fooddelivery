import api from './api';
import type { ApiResponse } from '@/types/api.types';
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  ApplyPromoRequest,
  ApplyPromoResponse,
} from '@/types/cart.types';

export const cartService = {
  async getCart() {
    const { data } = await api.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  async addToCart(
    itemId: string,
    quantity: number,
    modifiers?: { modifierGroupId: string; modifierOptionId: string }[],
    specialInstructions?: string,
    restaurantId?: string,
  ) {
    const { data } = await api.post<ApiResponse<Cart>>('/cart/items', {
      restaurantId: restaurantId ?? '',
      menuItemId: itemId,
      quantity,
      modifiers,
      specialInstructions,
    } satisfies AddToCartRequest);
    return data.data;
  },

  async updateCartItem(
    itemId: string,
    quantity: number,
    modifiers?: { modifierGroupId: string; modifierOptionId: string }[],
    specialInstructions?: string,
  ) {
    const { data } = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
      quantity,
      modifiers,
      specialInstructions,
    } satisfies Omit<UpdateCartItemRequest, 'cartItemId'>);
    return data.data;
  },

  async removeCartItem(itemId: string) {
    const { data } = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return data.data;
  },

  async applyCoupon(code: string) {
    const { data } = await api.post<ApiResponse<ApplyPromoResponse>>('/cart/coupon', {
      code,
      cartSubtotal: 0,
      restaurantId: '',
    } satisfies ApplyPromoRequest);
    return data.data;
  },

  async removeCoupon() {
    const { data } = await api.delete<ApiResponse<Cart>>('/cart/coupon');
    return data.data;
  },

  async validateCart() {
    const { data } = await api.post<ApiResponse<{ valid: boolean; errors: string[] }>>(
      '/cart/validate',
    );
    return data.data;
  },
};
