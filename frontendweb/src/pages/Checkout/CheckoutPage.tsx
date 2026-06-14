import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import { useAddressList } from '@/hooks/useAddresses'
import { usePlaceOrder } from '@/hooks/useOrders'
import { useWalletInfo } from '@/hooks/useWallet'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import OrderSummary from './components/OrderSummary'
import PaymentMethodSelector from './components/PaymentMethodSelector'
import AddressForm from './components/AddressForm'
import { ArrowLeft, ShoppingCart, AlertCircle, MapPin } from 'lucide-react'

export default function CheckoutPage() {
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
    clearCart,
  } = useCart()

  const { data: addresses, isLoading: isLoadingAddresses } = useAddressList()
  const { data: wallet } = useWalletInfo()
  const placeOrderMutation = usePlaceOrder()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null)
  const [useWalletBalance, setUseWalletBalance] = useState(false)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)

  const defaultAddress = addresses?.find((a) => a.isDefault) ?? addresses?.[0] ?? null
  const selectedAddress =
    addresses?.find((a) => a.id === selectedAddressId) ?? defaultAddress

  const isEmpty = items.length === 0

  const canPlaceOrder = useMemo(() => {
    return items.length > 0 && selectedAddress && !placeOrderMutation.isPending
  }, [items.length, selectedAddress, placeOrderMutation.isPending])

  const handlePlaceOrder = useCallback(async () => {
    if (!canPlaceOrder || !selectedAddress || !restaurant) return

    try {
      const result = await placeOrderMutation.mutateAsync({
        restaurantId: restaurant.id,
        deliveryAddressId: selectedAddress.id,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          modifiers: item.modifiers.map((m) => ({
            modifierGroupId: m.modifierGroupId,
            modifierOptionId: m.modifierOptionId,
          })),
          specialInstructions: item.specialInstructions,
        })),
        paymentMethodId: selectedPaymentMethodId ?? undefined,
        specialInstructions: specialInstructions || undefined,
        promoCode: coupon?.code,
      })

      clearCart()
      navigate(`/orders/${result.orderId}/tracking`)
    } catch {
    }
  }, [
    canPlaceOrder,
    selectedAddress,
    restaurant,
    items,
    selectedPaymentMethodId,
    specialInstructions,
    coupon,
    placeOrderMutation,
    clearCart,
    navigate,
  ])

  if (isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-surface-50">
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16" />}
          title="Your cart is empty"
          description="Add some items before checking out."
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              Browse Restaurants
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/cart')}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-100 transition-colors active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 text-surface-700" />
          </button>
          <h1 className="text-lg font-bold text-surface-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Delivery Address */}
            <section className="rounded-2xl bg-white border border-surface-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-500" />
                  Delivery Address
                </h2>
                {addresses && addresses.length > 0 && (
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    {showAddressForm ? 'Cancel' : 'Change'}
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <AddressForm
                  onAddressSaved={(address) => {
                    setSelectedAddressId(address.id)
                    setShowAddressForm(false)
                  }}
                  onCancel={() => setShowAddressForm(false)}
                />
              ) : selectedAddress ? (
                <div className="flex items-start gap-3 rounded-xl bg-surface-50 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100">
                    <MapPin className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900">
                      {selectedAddress.label}
                    </p>
                    <p className="text-xs text-surface-600 mt-0.5">
                      {selectedAddress.streetAddress}
                    </p>
                    <p className="text-xs text-surface-500">
                      {selectedAddress.city}, {selectedAddress.state}{' '}
                      {selectedAddress.zipCode}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-surface-200 p-4 text-left transition-all hover:border-brand-300 hover:bg-brand-50/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-100">
                    <MapPin className="h-5 w-5 text-surface-400" />
                  </div>
                  <span className="text-sm font-medium text-surface-600">
                    Add delivery address
                  </span>
                </button>
              )}
            </section>

            {/* Payment Method */}
            <PaymentMethodSelector
              selectedMethodId={selectedPaymentMethodId}
              onSelect={setSelectedPaymentMethodId}
              useWallet={useWalletBalance}
              onToggleWallet={setUseWalletBalance}
              walletBalance={wallet?.balance ?? 0}
              orderTotal={total}
            />

            {/* Special Instructions */}
            <section className="rounded-2xl bg-white border border-surface-100 p-5">
              <h2 className="text-sm font-bold text-surface-900 mb-3">
                Special Instructions
              </h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests for your order? (optional)"
                rows={3}
                className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 resize-none"
              />
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-2 space-y-4">
            <OrderSummary
              items={items}
              restaurantName={restaurant?.name}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              discount={discount}
              coupon={coupon}
              total={total}
            />

            {/* Place Order Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder}
              loading={placeOrderMutation.isPending}
              className="shadow-glow-brand"
            >
              {placeOrderMutation.isPending ? (
                'Placing Order...'
              ) : (
                <>
                  Place Order — {formatCurrency(total)}
                </>
              )}
            </Button>

            {placeOrderMutation.isError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Failed to place order. Please try again.</span>
              </div>
            )}

            {!selectedAddress && (
              <p className="text-xs text-center text-red-500">
                Please add a delivery address to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
