import { formatCurrency } from '@/utils/format'
import type { CartItem } from '@/types/cart.types'
import type { PromoCode } from '@/types/cart.types'

interface OrderSummaryProps {
  items: CartItem[]
  restaurantName?: string
  subtotal: number
  deliveryFee: number
  tax: number
  discount: number
  coupon: PromoCode | null
  total: number
}

export default function OrderSummary({
  items,
  restaurantName,
  subtotal,
  deliveryFee,
  tax,
  discount,
  coupon,
  total,
}: OrderSummaryProps) {
  return (
    <div className="rounded-2xl bg-white border border-surface-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-surface-900">Order Summary</h3>
        {restaurantName && (
          <span className="text-xs text-surface-500">{restaurantName}</span>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            {/* Thumbnail */}
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-100">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200">
                  <span className="text-sm">🍽️</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-surface-900 truncate">
                  {item.name}
                </p>
                <span className="text-xs font-semibold text-surface-900 shrink-0 tabular-nums">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
              {item.modifiers.length > 0 && (
                <p className="text-xs text-surface-500 truncate mt-0.5">
                  {item.modifiers.map((m) => m.optionName).join(', ')}
                </p>
              )}
              <p className="text-xs text-surface-400 mt-0.5">
                Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-surface-100 pt-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-surface-600">Subtotal</span>
          <span className="font-medium text-surface-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-surface-600">Delivery fee</span>
          <span className="font-medium text-surface-900">
            {deliveryFee === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(deliveryFee)
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-surface-600">Tax</span>
          <span className="font-medium text-surface-900">{formatCurrency(tax)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span className="flex items-center gap-1.5">
              Discount
              {coupon && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                  {coupon.code}
                </span>
              )}
            </span>
            <span className="font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="border-t border-surface-100 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-surface-900">Total</span>
            <span className="text-lg font-bold text-surface-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
