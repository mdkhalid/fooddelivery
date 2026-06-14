import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '@/stores/cartStore';
import { cartService } from '@/services/cart.service';
import type { CartItem } from '@/types/cart.types';

export function useCart() {
  const {
    items,
    restaurant,
    coupon,
    discount,
    subtotal,
    deliveryFee,
    tax,
    total,
    itemCount,
    addItem: storeAddItem,
    removeItem: storeRemoveItem,
    updateItemQuantity: storeUpdateItemQuantity,
    applyCoupon: storeApplyCoupon,
    removeCoupon: storeRemoveCoupon,
    clearCart: storeClearCart,
  } = useCartStore();

  const addToCartMutation = useMutation({
    mutationFn: (item: CartItem & { restaurant: { id: string; name: string; slug: string; logoUrl?: string } }) =>
      cartService.addToCart(
        item.menuItemId,
        item.quantity,
        item.modifiers.map((m) => ({
          modifierGroupId: m.modifierGroupId,
          modifierOptionId: m.modifierOptionId,
        })),
        item.specialInstructions,
        item.restaurant.id,
      ),
    onSuccess: (_, variables) => {
      const item: CartItem = {
        id: `local-${Date.now()}`,
        menuItemId: variables.menuItemId,
        name: variables.name ?? '',
        description: variables.description,
        imageUrl: variables.imageUrl,
        basePrice: variables.basePrice ?? 0,
        modifiers: variables.modifiers ?? [],
        modifierTotal: variables.modifierTotal ?? 0,
        quantity: variables.quantity,
        unitPrice: variables.unitPrice ?? 0,
        subtotal: (variables.unitPrice ?? 0) * variables.quantity,
        specialInstructions: variables.specialInstructions,
        addedAt: new Date().toISOString(),
      };
      storeAddItem(item, { id: variables.restaurant.id, name: variables.restaurant.name, slug: variables.restaurant.slug, logoUrl: variables.restaurant.logoUrl });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (cartItemId: string) => cartService.removeCartItem(cartItemId),
    onSuccess: (_, cartItemId) => {
      storeRemoveItem(cartItemId);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      cartService.updateCartItem(cartItemId, quantity),
    onSuccess: (_, { cartItemId, quantity }) => {
      storeUpdateItemQuantity(cartItemId, quantity);
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: (code: string) =>
      cartService.applyCoupon(code),
    onSuccess: (data) => {
      if (data.valid && data.promoCode) {
        storeApplyCoupon(data.promoCode, data.discountAmount);
      }
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      storeRemoveCoupon();
    },
  });

  const addToCart = useCallback(
    (item: CartItem & { restaurant: { id: string; name: string; slug: string; logoUrl?: string } }) =>
      addToCartMutation.mutateAsync(item),
    [addToCartMutation]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => removeFromCartMutation.mutateAsync(cartItemId),
    [removeFromCartMutation]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) =>
      updateQuantityMutation.mutateAsync({ cartItemId, quantity }),
    [updateQuantityMutation]
  );

  const applyCoupon = useCallback(
    (code: string) => applyCouponMutation.mutateAsync(code),
    [applyCouponMutation]
  );

  const removeCoupon = useCallback(
    () => removeCouponMutation.mutateAsync(),
    [removeCouponMutation]
  );

  const cartCount = itemCount;
  const cartTotal = total;

  return {
    items,
    restaurant,
    coupon,
    discount,
    subtotal,
    deliveryFee,
    tax,
    total,
    itemCount,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart: storeClearCart,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isApplyingCoupon: applyCouponMutation.isPending,
    addToCartError: addToCartMutation.error,
    applyCouponError: applyCouponMutation.error,
  };
}
