import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../stores/cartStore';
import { cartService } from '../services';
import { MenuItem, Modifier } from '../types/menu.types';
import { useAuthStore } from '../stores/authStore';

export const useCart = () => {
  const { cart, addItem: storeAddItem, updateItemQuantity: storeUpdateQuantity, removeItem: storeRemoveItem, clearCart: storeClearCart, applyCoupon: storeApplyCoupon, removeCoupon: storeRemoveCoupon, getItemCount, getCartTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: serverCart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
    staleTime: 0,
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: { menuItem: MenuItem; quantity: number; modifiers: Modifier[] }) =>
      cartService.addToCart({
        menuItem: data.menuItem,
        quantity: data.quantity,
        modifiers: data.modifiers,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      // Fallback to local cart if offline
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: (data: { itemId: string; quantity: number }) =>
      cartService.updateCartItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      storeClearCart();
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: (data: { code: string; subtotal: number }) =>
      cartService.applyCoupon(data),
    onSuccess: (data, variables) => {
      storeApplyCoupon(variables.code, data.discount);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess: () => {
      storeRemoveCoupon();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const addItem = (menuItem: MenuItem, quantity: number, modifiers: Modifier[]) => {
    storeAddItem(menuItem, quantity, modifiers);
    if (isAuthenticated) {
      addToCartMutation.mutate({ menuItem, quantity, modifiers });
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    storeUpdateQuantity(itemId, quantity);
    if (isAuthenticated) {
      updateQuantityMutation.mutate({ itemId, quantity });
    }
  };

  const removeItem = (itemId: string) => {
    storeRemoveItem(itemId);
    if (isAuthenticated) {
      removeItemMutation.mutate(itemId);
    }
  };

  const clearCart = () => {
    if (isAuthenticated) {
      clearCartMutation.mutate();
    } else {
      storeClearCart();
    }
  };

  const activeCart = isAuthenticated ? serverCart || cart : cart;

  return {
    cart: activeCart,
    itemCount: getItemCount(),
    cartTotal: getCartTotal(),
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon: (code: string) => {
      applyCouponMutation.mutate({ code, subtotal: activeCart.subtotal });
    },
    removeCoupon: () => removeCouponMutation.mutate(),
    isLoading,
    isAdding: addToCartMutation.isPending,
  };
};
