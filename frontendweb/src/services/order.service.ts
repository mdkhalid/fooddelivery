import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Order,
  OrderListParams,
  PlaceOrderRequest,
  PlaceOrderResponse,
  CancelOrderRequest,
  OrderTracking,
  ReorderResponse,
} from '@/types/order.types';

export const orderService = {
  async placeOrder(requestData: PlaceOrderRequest) {
    const { data } = await api.post<ApiResponse<PlaceOrderResponse>>(
      '/orders',
      requestData,
    );
    return data.data;
  },

  async getOrders(params?: OrderListParams) {
    const { data } = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return data;
  },

  async getOrder(id: string) {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  async cancelOrder(id: string, reason: string) {
    const { data } = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, {
      reason,
    } satisfies CancelOrderRequest);
    return data.data;
  },

  async reorder(id: string) {
    const { data } = await api.post<ApiResponse<ReorderResponse>>(`/orders/${id}/reorder`);
    return data.data;
  },

  async getOrderTracking(id: string) {
    const { data } = await api.get<ApiResponse<OrderTracking>>(`/orders/${id}/tracking`);
    return data.data;
  },
};
