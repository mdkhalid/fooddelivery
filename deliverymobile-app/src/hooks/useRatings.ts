import { useQuery } from '@tanstack/react-query';
import { ratingService } from '../services/rating.service';

export const useRatings = () => {
  const ratingsQuery = useQuery({
    queryKey: ['ratings'],
    queryFn: async () => {
      const response = await ratingService.getRatings();
      return response.data;
    },
  });

  const summaryQuery = useQuery({
    queryKey: ['ratings', 'summary'],
    queryFn: async () => {
      const response = await ratingService.getSummary();
      return response.data;
    },
  });

  return {
    ratings: ratingsQuery.data?.data || [],
    summary: summaryQuery.data,
    isLoading: ratingsQuery.isLoading || summaryQuery.isLoading,
  };
};