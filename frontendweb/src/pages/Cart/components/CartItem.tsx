import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import QuantitySelector from '@/components/ui/QuantitySelector'
import { Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '@/types/cart.types'

interface CartItemProps {
  item: CartItemType
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
  isUpdating: boolean
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  isUpdating,
}: CartItemProps) {
  const modifierSummary = item.modifiers
    .map((m) => m.optionName)
    .join(', ')

  return (
    <div
      className={cn(
        'flex gap-4 rounded-2xl bg-white border border-surface-100 p-4 transition-all',
        isUpdating && 'opacity-60 pointer-events-none'
      )}
    >
      {/* Image */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200">
            <span className="text-xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-surface-900 truncate">
              {item.name}
            </h3>
            {modifierSummary && (
              <p className="mt-0.5 text-xs text-surface-500 truncate">
                {modifierSummary}
              </p>
            )}
          </div>
          <button
            onClick={onRemove}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-surface-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <QuantitySelector
            value={item.quantity}
            onChange={onQuantityChange}
            min={1}
            max={20}
          />
          <span className="text-sm font-bold text-surface-900">
            {formatCurrency(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
