import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Order, OrderListParams, PlaceOrderRequest, PlaceOrderResponse, CancelOrderRequest, ReorderRequest, ReorderResponse } from '@/types/order.types';

export function useOrderList(params: OrderListParams = {}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Order>>('/orders', { params });
      return data;
    },
    staleTime: 60 * 1000,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: PlaceOrderRequest) => {
      const { data } = await api.post<ApiResponse<PlaceOrderResponse>>('/orders', request);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, ...request }: CancelOrderRequest & { orderId: string }) => {
      const { data } = await api.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`, request);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    },
  });
}

export function useReorder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ReorderRequest) => {
      const { data } = await api.post<ApiResponse<ReorderResponse>>('/orders/reorder', request);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
