import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, DiscountType, PromoCode } from '@/types/cart.types';

interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

interface CartState {
  items: CartItem[];
  restaurant: RestaurantInfo | null;
  coupon: PromoCode | null;
  discount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  itemCount: number;
}

interface CartActions {
  addItem: (item: CartItem, restaurant: RestaurantInfo) => boolean;
  removeItem: (cartItemId: string) => void;
  updateItemQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: PromoCode, discount: number) => void;
  removeCoupon: () => void;
  setRestaurant: (restaurant: RestaurantInfo | null) => void;
  recalculateTotals: () => void;
}

const calculateTotals = (
  items: CartItem[],
  coupon: PromoCode | null,
  currentDiscount: number
): Omit<CartState, 'items' | 'restaurant' | 'coupon' | 'discount'> => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = subtotal > 0 ? (coupon?.discountType === DiscountType.FREE_DELIVERY ? 0 : 2.99) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax - currentDiscount;

  return {
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.max(0, Math.round(total * 100) / 100),
  };
};

const initialState: CartState = {
  items: [],
  restaurant: null,
  coupon: null,
  discount: 0,
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (item, restaurant) => {
        const state = get();

        if (state.restaurant && state.restaurant.id !== restaurant.id) {
          return false;
        }

        const existingIndex = state.items.findIndex(
          (i) => i.menuItemId === item.menuItemId && JSON.stringify(i.modifiers) === JSON.stringify(item.modifiers)
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = state.items.map((i, idx) =>
            idx === existingIndex
              ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.unitPrice }
              : i
          );
        } else {
          newItems = [...state.items, { ...item, addedAt: new Date().toISOString() }];
        }

        const totals = calculateTotals(newItems, state.coupon, state.discount);
        set({ items: newItems, restaurant, ...totals });
        return true;
      },

      removeItem: (cartItemId) => {
        const state = get();
        const newItems = state.items.filter((i) => i.id !== cartItemId);
        const totals = calculateTotals(newItems, state.coupon, state.discount);

        if (newItems.length === 0) {
          set({ ...initialState });
        } else {
          set({ items: newItems, ...totals });
        }
      },

      updateItemQuantity: (cartItemId, quantity) => {
        const state = get();
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        const newItems = state.items.map((i) =>
          i.id === cartItemId ? { ...i, quantity, subtotal: quantity * i.unitPrice } : i
        );
        const totals = calculateTotals(newItems, state.coupon, state.discount);
        set({ items: newItems, ...totals });
      },

      clearCart: () => set({ ...initialState }),

      applyCoupon: (coupon, discount) => {
        const state = get();
        const totals = calculateTotals(state.items, coupon, discount);
        set({ coupon, discount, ...totals });
      },

      removeCoupon: () => {
        const state = get();
        const totals = calculateTotals(state.items, null, 0);
        set({ coupon: null, discount: 0, ...totals });
      },

      setRestaurant: (restaurant) => set({ restaurant }),

      recalculateTotals: () => {
        const state = get();
        const totals = calculateTotals(state.items, state.coupon, state.discount);
        set(totals);
      },
    }),
    {
      name: 'fooddelivery-cart',
      partialize: (state) => ({
        items: state.items,
        restaurant: state.restaurant,
        coupon: state.coupon,
        discount: state.discount,
        subtotal: state.subtotal,
        deliveryFee: state.deliveryFee,
        tax: state.tax,
        total: state.total,
        itemCount: state.itemCount,
      }),
    }
  )
);
