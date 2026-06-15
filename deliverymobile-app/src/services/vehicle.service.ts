import api from './api';
import { ApiResponse } from '../types/api.types';
import { Vehicle } from '../types/driver.types';

export const vehicleService = {
  getVehicles: async (): Promise<ApiResponse<Vehicle[]>> => {
    const response = await api.get('/driver/vehicles');
    return response.data;
  },

  addVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<ApiResponse<Vehicle>> => {
    const response = await api.post('/driver/vehicles', vehicle);
    return response.data;
  },

  updateVehicle: async (id: string, vehicle: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    const response = await api.put(`/driver/vehicles/${id}`, vehicle);
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/driver/vehicles/${id}`);
    return response.data;
  },

  setDefaultVehicle: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.patch(`/driver/vehicles/${id}/default`);
    return response.data;
  },
};
