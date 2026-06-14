import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().default('US'),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  cuisineTags: z.array(z.string()).default([]),
});

export const updateBranchSchema = createBranchSchema.partial();

export const updateOperatingHoursSchema = z.object({
  hours: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    openTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    closeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    isClosed: z.boolean().default(false),
  })),
});

export const addServiceableZoneSchema = z.object({
  name: z.string().min(1),
  geoJson: z.any(), // GeoJSON Polygon
  minOrderAmount: z.number().optional(),
  deliveryFeeOverride: z.number().optional(),
  estimatedDeliveryMin: z.number().optional(),
});

export const createMenuCategorySchema = z.object({
  name: z.string().min(1).max(50),
  sortOrder: z.number().int().default(0),
});

export const updateMenuCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const createMenuItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional(),
  dietaryTags: z.array(z.string()).default([]),
  allergenInfo: z.array(z.string()).default([]),
  spiceLevel: z.number().int().min(1).max(5).optional(),
  preparationTime: z.number().int().positive().optional(),
  sortOrder: z.number().int().default(0),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export const createModifierGroupSchema = z.object({
  name: z.string().min(1).max(50),
  selectionRule: z.enum(['single', 'multi', 'required_single', 'required_multi']).default('single'),
  sortOrder: z.number().int().default(0),
  options: z.array(z.object({
    name: z.string().min(1).max(50),
    price: z.number().default(0),
    isDefault: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
  })).default([]),
});

export const updateModifierGroupSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  selectionRule: z.enum(['single', 'multi', 'required_single', 'required_multi']).optional(),
  sortOrder: z.number().int().optional(),
});

export const addModifierOptionSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.number().default(0),
  isDefault: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const updateModifierOptionSchema = addModifierOptionSchema.partial();

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
