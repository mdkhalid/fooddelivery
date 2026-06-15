import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services';
import { CreateOrderRequest } from '../types/order.types';

export const useOrders = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getOrders(params || {}),
    staleTime: 0,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    staleTime: 0,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      orderService.cancelOrder(orderId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    },
  });
};

export const useReorder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.reorder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useOrderTracking = (orderId: string) => {
  return useQuery({
    queryKey: ['orderTracking', orderId],
    queryFn: () => orderService.getOrderTracking(orderId),
    refetchInterval: 5000, // Poll every 5 seconds for live tracking
    staleTime: 0,
  });
};

export const useRateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: { restaurantRating: number; driverRating?: number; comment?: string } }) =>
      orderService.rateOrder(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    },
  });
};

export const useInvoice = (orderId: string) => {
  return useQuery({
    queryKey: ['invoice', orderId],
    queryFn: () => orderService.getInvoice(orderId),
    staleTime: 30 * 60 * 1000,
  });
};
