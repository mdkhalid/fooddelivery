import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { earningsService } from '../services/earnings.service';

export const useEarnings = () => {
  const queryClient = useQueryClient();

  const summaryQuery = useQuery({
    queryKey: ['earnings', 'summary'],
    queryFn: async () => {
      const response = await earningsService.getSummary();
      return response.data;
    },
  });

  const earningsQuery = useQuery({
    queryKey: ['earnings'],
    queryFn: async () => {
      const response = await earningsService.getEarnings();
      return response.data;
    },
  });

  const incentivesQuery = useQuery({
    queryKey: ['incentives'],
    queryFn: async () => {
      const response = await earningsService.getIncentives();
      return response.data;
    },
  });

  return {
    summary: summaryQuery.data,
    earnings: earningsQuery.data?.data || [],
    incentives: incentivesQuery.data || [],
    isLoading: summaryQuery.isLoading || earningsQuery.isLoading,
  };
};