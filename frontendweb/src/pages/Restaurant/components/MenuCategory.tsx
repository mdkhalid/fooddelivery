import { useState, useCallback } from 'react'
import { cn } from '@/utils/cn'
import MenuItem from './MenuItem'
import { ChevronDown } from 'lucide-react'
import type { MenuCategory as MenuCategoryType, MenuItem as MenuItemType } from '@/types/menu.types'

interface MenuCategoryProps {
  category: MenuCategoryType
  onItemSelect: (item: MenuItemType) => void
}

export default function MenuCategory({ category, onItemSelect }: MenuCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const items = category.items.filter((item) => item.isAvailable || !item.isAvailable)
  const itemCount = items.length

  const toggle = useCallback(() => setIsExpanded((prev) => !prev), [])

  return (
    <div className="rounded-2xl bg-white border border-surface-100 overflow-hidden">
      {/* Category Header */}
      <button
        onClick={toggle}
        className={cn(
          'flex w-full items-center justify-between px-5 py-4 text-left transition-colors',
          'hover:bg-surface-50 active:bg-surface-100'
        )}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-surface-900">{category.name}</h2>
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-full bg-surface-100 px-2 text-xs font-semibold text-surface-600">
            {itemCount}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-surface-400 transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Category Description */}
      {category.description && isExpanded && (
        <div className="px-5 pb-2 -mt-1">
          <p className="text-sm text-surface-500">{category.description}</p>
        </div>
      )}

      {/* Items */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isExpanded
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="divide-y divide-surface-50">
            {items.map((item) => (
              <MenuItem key={item.id} item={item} onSelect={onItemSelect} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
