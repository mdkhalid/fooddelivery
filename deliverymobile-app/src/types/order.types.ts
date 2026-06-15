export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  restaurant: RestaurantInfo;
  customer: CustomerInfo;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  deliveryFee: number;
  tip: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'wallet';
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  assignedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  distance: number;
  duration: number;
}

export type OrderStatus =
  | 'assigned'
  | 'accepted'
  | 'arrived_at_restaurant'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'cancelled';

export interface RestaurantInfo {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  image?: string;
  preparationTime?: number;
}

export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  proxyPhone?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
  specialInstructions?: string;
}

export interface DeliveryAddress {
  address: string;
  latitude: number;
  longitude: number;
  apartment?: string;
  floor?: string;
  deliveryInstructions?: string;
}
