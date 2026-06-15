import { create } from 'zustand';
import { Cart, CartItem, CartItemModifier } from '../types/cart.types';
import { MenuItem, Modifier } from '../types/menu.types';
import { mmkvStorage, StorageKeys } from '../utils/storage';

interface CartState {
  cart: Cart;
  addItem: (item: MenuItem, quantity: number, modifiers: Modifier[]) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  loadStoredCart: () => void;
}

const emptyCart: Cart = {
  restaurantId: null,
  restaurantName: null,
  items: [],
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  discount: 0,
  total: 0,
};

const calculateCartTotals = (items: CartItem[], deliveryFee: number, discount: number): Cart => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + deliveryFee + tax - discount;
  return {
    restaurantId: items[0]?.restaurantId || null,
    restaurantName: items[0]?.restaurantName || null,
    items,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total: Math.max(0, total),
  };
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: emptyCart,

  addItem: (menuItem, quantity, modifiers) => {
    const { cart } = get();
    
    if (cart.restaurantId && cart.restaurantId !== menuItem.restaurantId) {
      // Different restaurant - clear cart first
      set({ cart: emptyCart });
    }

    const modifiersTotal = modifiers.reduce((sum, mod) => sum + mod.price, 0);
    const itemPrice = menuItem.price + modifiersTotal;
    const subtotal = itemPrice * quantity;

    const cartModifiers: CartItemModifier[] = modifiers.map((mod) => ({
      modifierId: mod.id,
      name: mod.name,
      price: mod.price,
    }));

    const newItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItemId: menuItem.id,
      restaurantId: menuItem.restaurantId,
      restaurantName: cart.restaurantName || '',
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      image: menuItem.image,
      quantity,
      modifiers: cartModifiers,
      subtotal,
    };

    const updatedItems = [...cart.items, newItem];
    const newCart = calculateCartTotals(updatedItems, cart.deliveryFee, cart.discount);
    
    set({ cart: newCart });
    mmkvStorage.setObject(StorageKeys.CART_DATA, newCart);
  },

  updateItemQuantity: (itemId, quantity) => {
    const { cart } = get();
    
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const updatedItems = cart.items.map((item) => {
      if (item.id === itemId) {
        const newSubtotal = item.price * quantity + item.modifiers.reduce((sum, mod) => sum + mod.price, 0) * quantity;
        return { ...item, quantity, subtotal: newSubtotal };
      }
      return item;
    });

    const newCart = calculateCartTotals(updatedItems, cart.deliveryFee, cart.discount);
    set({ cart: newCart });
    mmkvStorage.setObject(StorageKeys.CART_DATA, newCart);
  },

  removeItem: (itemId) => {
    const { cart } = get();
    const updatedItems = cart.items.filter((item) => item.id !== itemId);
    const newCart = calculateCartTotals(updatedItems, cart.deliveryFee, cart.discount);
    set({ cart: newCart });
    mmkvStorage.setObject(StorageKeys.CART_DATA, newCart);
  },

  clearCart: () => {
    set({ cart: emptyCart });
    mmkvStorage.delete(StorageKeys.CART_DATA);
  },

  applyCoupon: (code, discount) => {
    const { cart } = get();
    const newCart = { ...cart, discount };
    const total = newCart.subtotal + newCart.deliveryFee + newCart.tax - newCart.discount;
    newCart.total = Math.max(0, total);
    set({ cart: newCart });
    mmkvStorage.setObject(StorageKeys.CART_DATA, newCart);
  },

  removeCoupon: () => {
    const { cart } = get();
    const newCart = { ...cart, discount: 0 };
    newCart.total = newCart.subtotal + newCart.deliveryFee + newCart.tax;
    set({ cart: newCart });
    mmkvStorage.setObject(StorageKeys.CART_DATA, newCart);
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart.total;
  },

  getItemCount: () => {
    const { cart } = get();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  loadStoredCart: () => {
    try {
      const storedCart = mmkvStorage.getObject<Cart>(StorageKeys.CART_DATA);
      if (storedCart) {
        set({ cart: storedCart });
      }
    } catch (error) {
      console.error('Failed to load stored cart:', error);
    }
  },
}));
