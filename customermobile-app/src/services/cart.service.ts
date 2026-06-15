import api from './api';
import { ApiResponse } from '../types/api.types';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, ApplyCouponRequest } from '../types/cart.types';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await api.post<ApiResponse<Cart>>('/cart/items', data);
    return response.data.data;
  },

  updateCartItem: async (data: UpdateCartItemRequest): Promise<Cart> => {
    const response = await api.put<ApiResponse<Cart>>(`/cart/items/${data.itemId}`, { quantity: data.quantity });
    return response.data.data;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return response.data.data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },

  applyCoupon: async (data: ApplyCouponRequest): Promise<{ discount: number; total: number }> => {
    const response = await api.post<ApiResponse<{ discount: number; total: number }>>('/cart/coupon', data);
    return response.data.data;
  },

  removeCoupon: async (): Promise<Cart> => {
    const response = await api.delete<ApiResponse<Cart>>('/cart/coupon');
    return response.data.data;
  },

  validateCart: async (): Promise<{ isValid: boolean; errors: string[] }> => {
    const response = await api.get<ApiResponse<{ isValid: boolean; errors: string[] }>>('/cart/validate');
    return response.data.data;
  },
};
