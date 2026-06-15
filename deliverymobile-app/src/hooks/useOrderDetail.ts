import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export const useOrderDetail = (orderId: string) => {
  const query = useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const response = await orderService.getOrderDetail(orderId);
      return response.data;
    },
    enabled: !!orderId,
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};