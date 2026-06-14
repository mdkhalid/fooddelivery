import { z } from 'zod';

// ── Cart ──

export const addToCartSchema = z.object({
  branchId: z.string().uuid(),
  menuItemId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
  modifiers: z.array(z.object({
    modifierGroupId: z.string().uuid(),
    modifierOptionId: z.string().uuid(),
  })).default([]),
  specialInstructions: z.string().max(500).optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  modifiers: z.array(z.object({
    modifierGroupId: z.string().uuid(),
    modifierOptionId: z.string().uuid(),
  })).optional(),
  specialInstructions: z.string().max(500).optional(),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
});

export const checkoutSchema = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.enum(['CARD', 'WALLET', 'COD', 'SPLIT']),
  tipAmount: z.number().min(0).default(0),
  deliveryNotes: z.string().max(500).optional(),
  isScheduled: z.boolean().default(false),
  scheduledFor: z.string().datetime().optional(),
  idempotencyKey: z.string().min(1).optional(),
});

// ── Order ──

export const cancelOrderSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

export const reorderSchema = z.object({
  orderId: z.string().uuid(),
});

// ── Payment ──

export const initiatePaymentSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethodId: z.string().optional(), // Stripe payment method ID
});

export const refundSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive().optional(), // Full refund if omitted
  reason: z.string().max(500).optional(),
});

// ── Rating ──

export const createRatingSchema = z.object({
  orderId: z.string().uuid(),
  targetType: z.enum(['restaurant', 'driver']),
  score: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10).default([]),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
