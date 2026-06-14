import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import { Plus, Leaf, WheatOff } from 'lucide-react'
import type { MenuItem as MenuItemType } from '@/types/menu.types'

interface MenuItemProps {
  item: MenuItemType
  onSelect: (item: MenuItemType) => void
}

export default function MenuItem({ item, onSelect }: MenuItemProps) {
  const hasModifiers = item.modifierGroups.length > 0
  const displayPrice = item.discountedPrice ?? item.price
  const isDiscounted = item.discountedPrice != null && item.discountedPrice < item.price

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(item)
  }

  const hasVegan = item.tags.some((t) => t.toLowerCase() === 'vegan')
  const hasGlutenFree = item.tags.some((t) => t.toLowerCase() === 'gluten-free')

  return (
    <button
      onClick={() => onSelect(item)}
      disabled={!item.isAvailable}
      className={cn(
        'flex w-full gap-4 px-5 py-4 text-left transition-all',
        'hover:bg-surface-50/80 active:bg-surface-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-inset',
        !item.isAvailable && 'opacity-60 cursor-not-allowed'
      )}
    >
      {/* Image Thumbnail */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-900/60 rounded-xl">
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-surface-900 leading-tight truncate">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {hasVegan && (
              <Leaf className="h-3.5 w-3.5 text-green-500" />
            )}
            {hasGlutenFree && (
              <WheatOff className="h-3.5 w-3.5 text-amber-600" />
            )}
          </div>
        </div>

        {item.description && (
          <p className="mt-0.5 text-xs text-surface-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                'text-sm font-bold',
                isDiscounted ? 'text-green-600' : 'text-surface-900'
              )}
            >
              {formatCurrency(displayPrice)}
            </span>
            {isDiscounted && (
              <span className="text-xs text-surface-400 line-through">
                {formatCurrency(item.price)}
              </span>
            )}
          </div>

          {item.isAvailable && (
            <div
              onClick={handleAdd}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                'bg-brand-500 text-white shadow-sm',
                'hover:bg-brand-600 hover:shadow-md active:scale-90',
                hasModifiers && 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              )}
            >
              <Plus className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
