import { useState, useCallback } from 'react'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Tag, X, CheckCircle, AlertCircle } from 'lucide-react'

export default function CouponInput() {
  const { coupon, discount, applyCoupon, removeCoupon, isApplyingCoupon, applyCouponError } =
    useCart()

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApply = useCallback(async () => {
    if (!code.trim()) return
    setError(null)
    try {
      await applyCoupon(code.trim().toUpperCase())
      setCode('')
    } catch (err: any) {
      setError(err?.message ?? 'Invalid coupon code')
    }
  }, [code, applyCoupon])

  const handleRemove = useCallback(() => {
    removeCoupon()
    setCode('')
    setError(null)
  }, [removeCoupon])

  if (coupon) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-green-800">{coupon.code}</span>
              <span className="inline-flex items-center rounded-full bg-green-200 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                Applied
              </span>
            </div>
            <p className="text-xs text-green-600 mt-0.5">
              You save {formatCurrency(discount)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-green-600 hover:bg-green-100 transition-colors"
            aria-label="Remove coupon"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white border border-surface-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4 text-surface-500" />
        <h3 className="text-sm font-bold text-surface-900">Have a coupon?</h3>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError(null)
            }}
            placeholder="Enter code"
            className="uppercase tracking-wider text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
        </div>
        <Button
          variant="secondary"
          onClick={handleApply}
          disabled={!code.trim() || isApplyingCoupon}
          loading={isApplyingCoupon}
        >
          Apply
        </Button>
      </div>

      {(error || applyCouponError) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error ?? 'Invalid coupon code. Please try again.'}</span>
        </div>
      )}
    </div>
  )
}
