import api from './api';
import { ApiResponse } from '../types/api.types';
import { Schedule, Shift, DeliveryZone } from '../types/availability.types';

export const availabilityService = {
  getSchedules: async (): Promise<ApiResponse<Schedule[]>> => {
    const response = await api.get('/driver/schedules');
    return response.data;
  },

  updateSchedule: async (id: string, schedule: Partial<Schedule>): Promise<ApiResponse<Schedule>> => {
    const response = await api.put(`/driver/schedules/${id}`, schedule);
    return response.data;
  },

  createSchedule: async (schedule: Omit<Schedule, 'id'>): Promise<ApiResponse<Schedule>> => {
    const response = await api.post('/driver/schedules', schedule);
    return response.data;
  },

  deleteSchedule: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/driver/schedules/${id}`);
    return response.data;
  },

  goOnline: async (zoneId?: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/driver/online', { zoneId });
    return response.data;
  },

  goOffline: async (reason?: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/driver/offline', { reason });
    return response.data;
  },

  startShift: async (): Promise<ApiResponse<Shift>> => {
    const response = await api.post('/driver/shifts/start');
    return response.data;
  },

  endShift: async (): Promise<ApiResponse<Shift>> => {
    const response = await api.post('/driver/shifts/end');
    return response.data;
  },

  getZones: async (): Promise<ApiResponse<DeliveryZone[]>> => {
    const response = await api.get('/driver/zones');
    return response.data;
  },

  selectZone: async (zoneId: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/driver/zones/select', { zoneId });
    return response.data;
  },
};
