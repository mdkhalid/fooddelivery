import { create } from 'zustand';
import { Order } from '../types/order.types';

interface OrderState {
  activeOrder: Order | null;
  availableOrders: Order[];
  isOnline: boolean;
  setActiveOrder: (order: Order | null) => void;
  setAvailableOrders: (orders: Order[]) => void;
  setIsOnline: (online: boolean) => void;
  addAvailableOrder: (order: Order) => void;
  removeAvailableOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  activeOrder: null,
  availableOrders: [],
  isOnline: false,

  setActiveOrder: (order) => set({ activeOrder: order }),
  setAvailableOrders: (orders) => set({ availableOrders: orders }),
  setIsOnline: (online) => set({ isOnline: online }),
  addAvailableOrder: (order) =>
    set((state) => ({ availableOrders: [...state.availableOrders, order] })),
  removeAvailableOrder: (orderId) =>
    set((state) => ({ availableOrders: state.availableOrders.filter((o) => o.id !== orderId) })),
}));
