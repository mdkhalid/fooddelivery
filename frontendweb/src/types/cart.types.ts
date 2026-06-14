// Cart Types

import { SelectedModifier } from './menu.types';

export interface Cart {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogoUrl?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  currency: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  basePrice: number;
  modifiers: SelectedModifier[];
  modifierTotal: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
  addedAt: string;
}

export interface AddToCartRequest {
  restaurantId: string;
  menuItemId: string;
  quantity: number;
  modifiers?: {
    modifierGroupId: string;
    modifierOptionId: string;
  }[];
  specialInstructions?: string;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
  modifiers?: {
    modifierGroupId: string;
    modifierOptionId: string;
  }[];
  specialInstructions?: string;
}

export interface RemoveCartItemRequest {
  cartItemId: string;
}

export interface ClearCartRequest {
  restaurantId: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  currency: string;
  estimatedDeliveryTime: number;
}

// Delivery address associated with cart
export interface CartDeliveryAddress {
  addressId: string;
  label: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
  deliveryInstructions?: string;
}

// Delivery time slot
export interface DeliveryTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  deliveryFee: number;
}

// Cart checkout state
export interface CheckoutState {
  cart: Cart | null;
  deliveryAddress: CartDeliveryAddress | null;
  paymentMethodId?: string;
  promoCode?: string;
  discount: number;
  tip: number;
  scheduledTime?: string;
  timeSlot?: DeliveryTimeSlot;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discountAmount: number;
  tipAmount: number;
  total: number;
  currency: string;
}

// Apply promo code
export interface ApplyPromoRequest {
  code: string;
  cartSubtotal: number;
  restaurantId: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_DELIVERY = 'FREE_DELIVERY',
}

export interface ApplyPromoResponse {
  valid: boolean;
  promoCode?: PromoCode;
  discountAmount: number;
  message?: string;
}
