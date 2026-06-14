import { useState, useMemo, useCallback, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import QuantitySelector from '@/components/ui/QuantitySelector'
import type { MenuItem, ModifierGroup, SelectedModifier } from '@/types/menu.types'
import type { Restaurant } from '@/types/restaurant.types'

interface ModifierSelectorProps {
  item: MenuItem | null
  open: boolean
  onClose: () => void
  restaurant: Restaurant
}

export default function ModifierSelector({
  item,
  open,
  onClose,
  restaurant,
}: ModifierSelectorProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (open && item) {
      setQuantity(1)
      const initial: Record<string, string[]> = {}
      item.modifierGroups.forEach((group) => {
        initial[group.id] = []
      })
      setSelections(initial)
    }
  }, [open, item])

  const handleToggleOption = useCallback(
    (groupId: string, optionId: string, group: ModifierGroup) => {
      setSelections((prev) => {
        const current = prev[groupId] || []
        if (group.type === 'SINGLE') {
          return { ...prev, [groupId]: [optionId] }
        }
        if (current.includes(optionId)) {
          return { ...prev, [groupId]: current.filter((id) => id !== optionId) }
        }
        if (current.length < group.maxSelections) {
          return { ...prev, [groupId]: [...current, optionId] }
        }
        return prev
      })
    },
    []
  )

  const selectedModifiers = useMemo<SelectedModifier[]>(() => {
    if (!item) return []
    const mods: SelectedModifier[] = []
    for (const group of item.modifierGroups) {
      const optionIds = selections[group.id] || []
      for (const optionId of optionIds) {
        const option = group.options.find((o) => o.id === optionId)
        if (option) {
          mods.push({
            modifierGroupId: group.id,
            modifierOptionId: option.id,
            name: group.name,
            optionName: option.name,
            price: option.price,
          })
        }
      }
    }
    return mods
  }, [item, selections])

  const modifierTotal = useMemo(
    () => selectedModifiers.reduce((sum, m) => sum + m.price, 0),
    [selectedModifiers]
  )

  const unitPrice = useMemo(() => {
    if (!item) return 0
    return (item.discountedPrice ?? item.price) + modifierTotal
  }, [item, modifierTotal])

  const totalPrice = unitPrice * quantity

  const isValid = useMemo(() => {
    if (!item) return false
    return item.modifierGroups
      .filter((g) => g.isRequired)
      .every((g) => {
        const sel = selections[g.id] || []
        return sel.length >= g.minSelections
      })
  }, [item, selections])

  const handleAddToCart = useCallback(async () => {
    if (!item || !isValid) return
    setIsAdding(true)
    try {
      await addToCart({
        id: `local-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        basePrice: item.discountedPrice ?? item.price,
        modifiers: selectedModifiers,
        modifierTotal,
        quantity,
        unitPrice,
        subtotal: totalPrice,
        addedAt: new Date().toISOString(),
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          logoUrl: restaurant.logoUrl,
        },
      })
      onClose()
    } catch {
    } finally {
      setIsAdding(false)
    }
  }, [item, isValid, selectedModifiers, modifierTotal, quantity, unitPrice, totalPrice, addToCart, restaurant, onClose])

  if (!item) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      className="max-h-[85vh] flex flex-col"
    >
      <div className="flex-1 overflow-y-auto -mx-6 -mt-6 px-6 pt-0">
        {/* Item Header */}
        <div className="sticky top-0 z-10 bg-white pt-6 pb-4 border-b border-surface-100">
          <div className="flex gap-4">
            {item.imageUrl ? (
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-20 w-20 shrink-0 rounded-xl bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center">
                <span className="text-3xl">🍽️</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-surface-900">{item.name}</h3>
              {item.description && (
                <p className="mt-0.5 text-sm text-surface-500 line-clamp-2">
                  {item.description}
                </p>
              )}
              <p className="mt-1 text-lg font-bold text-brand-600">
                {formatCurrency(item.discountedPrice ?? item.price)}
              </p>
            </div>
          </div>
        </div>

        {/* Modifier Groups */}
        <div className="py-4 space-y-6">
          {item.modifierGroups
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((group) => {
              const selected = selections[group.id] || []
              const isSingle = group.type === 'SINGLE'

              return (
                <div key={group.id}>
                  {/* Group Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-surface-900">
                        {group.name}
                      </h4>
                      {group.isRequired && (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                          Required
                        </span>
                      )}
                      {!group.isRequired && (
                        <span className="inline-flex items-center rounded-full bg-surface-100 px-2 py-0.5 text-[10px] font-bold text-surface-500 uppercase tracking-wider">
                          Optional
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-surface-500">
                      {isSingle ? 'Choose 1' : `Up to ${group.maxSelections}`}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {group.options
                      .filter((opt) => opt.isAvailable)
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((option) => {
                        const isSelected = selected.includes(option.id)

                        return (
                          <button
                            key={option.id}
                            onClick={() => handleToggleOption(group.id, option.id, group)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all',
                              isSelected
                                ? 'border-brand-500 bg-brand-50 shadow-sm'
                                : 'border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50'
                            )}
                          >
                            {/* Radio / Checkbox */}
                            <div
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                                isSelected
                                  ? 'border-brand-500 bg-brand-500'
                                  : 'border-surface-300'
                              )}
                            >
                              {isSelected && (
                                <div
                                  className={cn(
                                    'h-2 w-2 rounded-full bg-white',
                                    !isSingle && 'rounded-sm'
                                  )}
                                />
                              )}
                            </div>

                            {/* Option Name */}
                            <span className="flex-1 text-sm font-medium text-surface-800">
                              {option.name}
                            </span>

                            {/* Price Adjustment */}
                            {option.price > 0 && (
                              <span className="text-sm font-semibold text-surface-600">
                                +{formatCurrency(option.price)}
                              </span>
                            )}
                            {option.price === 0 && (
                              <span className="text-xs text-surface-400">Free</span>
                            )}
                          </button>
                        )
                      })}
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-surface-100 bg-white pt-4 pb-2 -mx-6 px-6">
        <div className="flex items-center gap-4">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={10}
          />
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            disabled={!isValid || isAdding}
            loading={isAdding}
          >
            Add to Cart — {formatCurrency(totalPrice)}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
