import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicle.service';

export const useVehicle = () => {
  const queryClient = useQueryClient();

  const vehiclesQuery = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await vehicleService.getVehicles();
      return response.data;
    },
  });

  const addVehicleMutation = useMutation({
    mutationFn: (vehicle: any) => vehicleService.addVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: ({ id, vehicle }: { id: string; vehicle: any }) =>
      vehicleService.updateVehicle(id, vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  return {
    vehicles: vehiclesQuery.data || [],
    addVehicle: addVehicleMutation.mutate,
    updateVehicle: updateVehicleMutation.mutate,
    deleteVehicle: deleteVehicleMutation.mutate,
    isLoading: vehiclesQuery.isLoading,
  };
};