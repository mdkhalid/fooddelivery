import { formatCurrency } from '@/utils/format'
import type { PromoCode } from '@/types/cart.types'

interface CartSummaryProps {
  subtotal: number
  deliveryFee: number
  tax: number
  discount: number
  coupon: PromoCode | null
  total: number
}

export default function CartSummary({
  subtotal,
  deliveryFee,
  tax,
  discount,
  coupon,
  total,
}: CartSummaryProps) {
  return (
    <div className="rounded-2xl bg-white border border-surface-100 p-5 space-y-3">
      <h3 className="text-sm font-bold text-surface-900 mb-3">Order Summary</h3>

      <div className="space-y-2.5 text-sm">
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
