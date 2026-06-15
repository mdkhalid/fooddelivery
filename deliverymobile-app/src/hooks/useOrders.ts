import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { useOrderStore } from '../stores/orderStore';

export const useOrders = () => {
  const queryClient = useQueryClient();
  const { setActiveOrder, setAvailableOrders } = useOrderStore();

  const availableOrdersQuery = useQuery({
    queryKey: ['orders', 'available'],
    queryFn: async () => {
      const response = await orderService.getAvailableOrders();
      setAvailableOrders(response.data);
      return response.data;
    },
    refetchInterval: 5000,
  });

  const activeOrderQuery = useQuery({
    queryKey: ['orders', 'active'],
    queryFn: async () => {
      const response = await orderService.getActiveOrder();
      setActiveOrder(response.data);
      return response.data;
    },
  });

  const acceptOrderMutation = useMutation({
    mutationFn: (orderId: string) => orderService.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const rejectOrderMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      orderService.rejectOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const confirmPickupMutation = useMutation({
    mutationFn: ({ orderId, photo }: { orderId: string; photo?: string }) =>
      orderService.confirmPickup(orderId, photo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const confirmDeliveryMutation = useMutation({
    mutationFn: ({ orderId, photo, signature, otp }: { orderId: string; photo?: string; signature?: string; otp?: string }) =>
      orderService.confirmDelivery(orderId, photo, signature, otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
  });

  return {
    availableOrders: availableOrdersQuery.data || [],
    activeOrder: activeOrderQuery.data,
    isLoading: availableOrdersQuery.isLoading || activeOrderQuery.isLoading,
    acceptOrder: acceptOrderMutation.mutate,
    rejectOrder: rejectOrderMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    confirmPickup: confirmPickupMutation.mutate,
    confirmDelivery: confirmDeliveryMutation.mutate,
    isAccepting: acceptOrderMutation.isPending,
    isRejecting: rejectOrderMutation.isPending,
  };
};