import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number').optional(),
});

export const addAddressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  building: z.string().optional(),
  apartment: z.string().optional(),
  floor: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().default('US'),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googlePlaceId: z.string().optional(),
  isDefault: z.boolean().default(false),
  deliveryNotes: z.string().optional(),
});

export const updateAddressSchema = addAddressSchema.partial();

export const topUpWalletSchema = z.object({
  amount: z.number().positive('Amount must be positive').min(1, 'Minimum top-up is $1'),
  paymentMethodId: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddAddressInput = z.infer<typeof addAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type TopUpWalletInput = z.infer<typeof topUpWalletSchema>;
