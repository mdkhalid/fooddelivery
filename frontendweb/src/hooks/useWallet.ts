import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { Wallet, WalletTransaction } from '@/types/user.types';

export function useWalletInfo() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Wallet>>('/wallet');
      return data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useTopUpWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, paymentMethodId }: { amount: number; paymentMethodId?: string }) => {
      const { data } = await api.post<ApiResponse<WalletTransaction>>('/wallet/topup', {
        amount,
        paymentMethodId,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
    },
  });
}
