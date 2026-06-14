import { z } from 'zod';

export const registerDriverSchema = z.object({
  vehicleType: z.enum(['car', 'motorcycle', 'bicycle', 'scooter']),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleColor: z.string().optional(),
  vehiclePlate: z.string().optional(),
});

export const updateDriverProfileSchema = z.object({
  vehicleType: z.enum(['car', 'motorcycle', 'bicycle', 'scooter']).optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleColor: z.string().optional(),
  vehiclePlate: z.string().optional(),
  maxDeliveryDistanceKm: z.number().min(1).max(50).optional(),
  autoAccept: z.boolean().optional(),
  acceptsNightDelivery: z.boolean().optional(),
  preferredZones: z.array(z.string()).optional(),
});

export const driverLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  bearing: z.number().min(0).max(360).optional(),
  speed: z.number().min(0).optional(),
  accuracy: z.number().min(0).optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
});

export const acceptOrderSchema = z.object({
  orderId: z.string().uuid(),
});

export const declineOrderSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(1).max(200),
});

export const updateDeliveryStatusSchema = z.object({
  status: z.enum(['PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED_AT_DESTINATION', 'DELIVERED', 'FAILED']),
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const uploadDocumentSchema = z.object({
  type: z.enum(['license_front', 'license_back', 'insurance', 'registration', 'background_check', 'profile_photo']),
  fileUrl: z.string().url(),
});

export const registerFleetSchema = z.object({
  companyName: z.string().min(1).max(100),
  registrationNumber: z.string().min(1),
  taxId: z.string().optional(),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
  maxDrivers: z.number().int().min(1).max(200).default(50),
  defaultEarningsSplit: z.number().min(50).max(100).default(70),
});

export const addFleetDriverSchema = z.object({
  driverUserId: z.string().uuid(),
  earningsSplit: z.number().min(50).max(100).optional(),
});

export type DriverLocationInput = z.infer<typeof driverLocationSchema>;
export type RegisterFleetInput = z.infer<typeof registerFleetSchema>;
