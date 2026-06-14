// Order Types

export enum OrderStatus {
  PLACED = 'PLACED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  RESTAURANT_ACCEPTED = 'RESTAURANT_ACCEPTED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  PICKED_UP = 'PICKED_UP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogoUrl?: string;
  restaurantAddress: OrderAddress;
  restaurantCoordinates: OrderCoordinates;
  status: OrderStatus;
  items: OrderItem[];
  deliveryAddress: OrderAddress;
  deliveryCoordinates: OrderCoordinates;
  driverId?: string;
  driverInfo?: OrderDriverInfo;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  currency: string;
  paymentMethodId?: string;
  paymentStatus: OrderPaymentStatus;
  specialInstructions?: string;
  scheduledTime?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  cancellationReason?: string;
  refundAmount?: number;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  basePrice: number;
  modifiers: OrderItemModifier[];
  modifierTotal: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface OrderItemModifier {
  modifierGroupId: string;
  modifierGroupName: string;
  modifierOptionId: string;
  modifierOptionName: string;
  price: number;
}

export interface OrderAddress {
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  contactName?: string;
  contactPhone?: string;
  deliveryInstructions?: string;
}

export interface OrderCoordinates {
  latitude: number;
  longitude: number;
}

export interface OrderDriverInfo {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  vehicleType?: string;
  vehiclePlateNumber?: string;
  rating?: number;
}

export enum OrderPaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export interface OrderTimelineEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Request types
export interface PlaceOrderRequest {
  restaurantId: string;
  deliveryAddressId: string;
  items: {
    menuItemId: string;
    quantity: number;
    modifiers?: {
      modifierGroupId: string;
      modifierOptionId: string;
    }[];
    specialInstructions?: string;
  }[];
  paymentMethodId?: string;
  specialInstructions?: string;
  promoCode?: string;
  tip?: number;
  scheduledTime?: string;
}

export interface PlaceOrderResponse {
  orderId: string;
  orderNumber: string;
  total: number;
  paymentUrl?: string;
  status: OrderStatus;
}

export interface CancelOrderRequest {
  reason: string;
  cancellationReason?: string;
}

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  driverLocation?: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    timestamp: string;
  };
  estimatedArrival?: string;
  timeline: OrderTimelineEvent[];
}

export interface OrderListParams {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  restaurantName: string;
  status: OrderStatus;
  total: number;
  currency: string;
  itemCount: number;
  createdAt: string;
}

// Reorder request
export interface ReorderRequest {
  originalOrderId: string;
  deliveryAddressId?: string;
  paymentMethodId?: string;
}

export interface ReorderResponse {
  orderId: string;
  orderNumber: string;
  total: number;
  status: OrderStatus;
  itemsAdded: number;
  itemsSkipped: number;
  unavailableItems: string[];
}
