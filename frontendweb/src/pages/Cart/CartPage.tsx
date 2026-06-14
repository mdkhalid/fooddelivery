import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import { useAddressList } from '@/hooks/useAddresses'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import CartItem from './components/CartItem'
import CartSummary from './components/CartSummary'
import CouponInput from './components/CouponInput'
import DeliveryAddressSelector from './components/DeliveryAddressSelector'
import { ShoppingCart, ArrowLeft, Store } from 'lucide-react'

export default function CartPage() {
  const navigate = useNavigate()
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
    removeFromCart,
    updateQuantity,
    clearCart,
    isRemovingFromCart,
    isUpdatingQuantity,
  } = useCart()

  const { data: addresses } = useAddressList()
  const defaultAddress = addresses?.find((a) => a.isDefault) ?? addresses?.[0] ?? null

  const isEmpty = items.length === 0

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-100 transition-colors active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 text-surface-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-surface-900">Your Cart</h1>
            {restaurant && (
              <p className="text-xs text-surface-500">from {restaurant.name}</p>
            )}
          </div>
          {!isEmpty && (
            <button
              onClick={clearCart}
              className="ml-auto text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16" />}
          title="Your cart is empty"
          description="Looks like you haven't added any items yet. Browse restaurants and discover something delicious!"
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              Browse Restaurants
            </Button>
          }
        />
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-4">
              {/* Restaurant Info */}
              {restaurant && (
                <div className="flex items-center gap-3 rounded-2xl bg-white border border-surface-100 p-4">
                  {restaurant.logoUrl ? (
                    <img
                      src={restaurant.logoUrl}
                      alt={restaurant.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
                      <Store className="h-5 w-5 text-brand-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 truncate">
                      {restaurant.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    View menu
                  </Button>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                    onRemove={() => removeFromCart(item.id)}
                    isUpdating={isUpdatingQuantity || isRemovingFromCart}
                  />
                ))}
              </div>

              {/* Delivery Address */}
              <DeliveryAddressSelector
                selectedAddress={defaultAddress}
                addresses={addresses ?? []}
              />
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-2 space-y-4">
              {/* Coupon */}
              <CouponInput />

              {/* Summary */}
              <CartSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                tax={tax}
                discount={discount}
                coupon={coupon}
                total={total}
              />

              {/* Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/checkout')}
                disabled={!defaultAddress}
                className="shadow-glow-brand"
              >
                Proceed to Checkout — {formatCurrency(total)}
              </Button>

              {!defaultAddress && (
                <p className="text-xs text-center text-red-500">
                  Please add a delivery address to continue
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
