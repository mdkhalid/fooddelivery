import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { availabilityService } from '../services/availability.service';
import { useOrderStore } from '../stores/orderStore';

export const useAvailability = () => {
  const queryClient = useQueryClient();
  const { setIsOnline } = useOrderStore();

  const schedulesQuery = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const response = await availabilityService.getSchedules();
      return response.data;
    },
  });

  const zonesQuery = useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const response = await availabilityService.getZones();
      return response.data;
    },
  });

  const goOnlineMutation = useMutation({
    mutationFn: (zoneId?: string) => availabilityService.goOnline(zoneId),
    onSuccess: () => {
      setIsOnline(true);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const goOfflineMutation = useMutation({
    mutationFn: (reason?: string) => availabilityService.goOffline(reason),
    onSuccess: () => {
      setIsOnline(false);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: (schedule: any) => availabilityService.createSchedule(schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, schedule }: { id: string; schedule: any }) =>
      availabilityService.updateSchedule(id, schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: string) => availabilityService.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  return {
    schedules: schedulesQuery.data || [],
    zones: zonesQuery.data || [],
    goOnline: goOnlineMutation.mutate,
    goOffline: goOfflineMutation.mutate,
    createSchedule: createScheduleMutation.mutate,
    updateSchedule: updateScheduleMutation.mutate,
    deleteSchedule: deleteScheduleMutation.mutate,
    isLoading: schedulesQuery.isLoading || zonesQuery.isLoading,
  };
};