import { Address } from './restaurant.types';
import { MenuItem } from './menu.types';

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  driver?: OrderDriver;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'wallet' | 'card' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: OrderItemModifier[];
  subtotal: number;
  image?: string;
}

export interface OrderItemModifier {
  id: string;
  name: string;
  price: number;
}

export interface OrderDriver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  location?: {
    latitude: number;
    longitude: number;
    bearing?: number;
  };
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
    modifiers: { modifierId: string }[];
  }[];
  deliveryAddressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  scheduledTime?: string;
  notes?: string;
}

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  driverLocation?: {
    latitude: number;
    longitude: number;
    bearing?: number;
  };
  estimatedArrival: string;
  lastUpdated: string;
}
