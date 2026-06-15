import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { earningsService } from '../services/earnings.service';

export const usePayouts = () => {
  const queryClient = useQueryClient();

  const payoutsQuery = useQuery({
    queryKey: ['payouts'],
    queryFn: async () => {
      const response = await earningsService.getPayouts();
      return response.data;
    },
  });

  const settingsQuery = useQuery({
    queryKey: ['payoutSettings'],
    queryFn: async () => {
      const response = await earningsService.getPayoutSettings();
      return response.data;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: any) => earningsService.updatePayoutSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payoutSettings'] });
    },
  });

  const requestPayoutMutation = useMutation({
    mutationFn: (amount: number) => earningsService.requestPayout(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
    },
  });

  return {
    payouts: payoutsQuery.data?.data || [],
    settings: settingsQuery.data,
    updateSettings: updateSettingsMutation.mutate,
    requestPayout: requestPayoutMutation.mutate,
    isLoading: payoutsQuery.isLoading || settingsQuery.isLoading,
  };
};