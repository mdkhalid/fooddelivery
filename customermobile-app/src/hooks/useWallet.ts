import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService } from '../services';
import { TopUpRequest } from '../types/payment.types';

export const useWallet = () => {
  const queryClient = useQueryClient();

  const { data: wallet, isLoading, error, refetch } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletService.getWallet(),
    staleTime: 5 * 60 * 1000,
  });

  const topUpMutation = useMutation({
    mutationFn: (data: TopUpRequest) => walletService.topUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });

  return {
    wallet,
    balance: wallet?.balance || 0,
    isLoading,
    error,
    refetch,
    topUp: topUpMutation.mutate,
    isTopUpLoading: topUpMutation.isPending,
    topUpError: topUpMutation.error,
  };
};

export const useWalletTransactions = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['walletTransactions', params],
    queryFn: () => walletService.getTransactions(params || {}),
    staleTime: 5 * 60 * 1000,
  });
};
