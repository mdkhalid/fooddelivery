import { MenuItem, Modifier } from './menu.types';

export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  quantity: number;
  modifiers: CartItemModifier[];
  subtotal: number;
}

export interface CartItemModifier {
  modifierId: string;
  name: string;
  price: number;
}

export interface Cart {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
}

export interface AddToCartRequest {
  menuItem: MenuItem;
  quantity: number;
  modifiers: Modifier[];
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string;
  subtotal: number;
}
