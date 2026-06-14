import { useState } from 'react'
import {
  Plus, ChevronUp, ChevronDown, Pencil, Trash2, GripVertical,
  UtensilsCrossed, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import MenuItemEditor from './components/MenuItemEditor'
import CategoryEditor from './components/CategoryEditor'
import type { MenuCategory, MenuItem } from '@/types/menu.types'

const mockCategories: MenuCategory[] = [
  {
    id: 'cat-1', menuId: 'menu-1', name: 'Appetizers', displayOrder: 1, isActive: true,
    items: [
      { id: 'item-1', categoryId: 'cat-1', name: 'Spring Rolls', price: 8.99, currency: 'USD', isAvailable: true, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 1, createdAt: '', updatedAt: '' },
      { id: 'item-2', categoryId: 'cat-1', name: 'Garlic Bread', price: 5.99, currency: 'USD', isAvailable: true, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 2, createdAt: '', updatedAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'cat-2', menuId: 'menu-1', name: 'Main Course', displayOrder: 2, isActive: true,
    items: [
      { id: 'item-3', categoryId: 'cat-2', name: 'Grilled Chicken', price: 16.99, currency: 'USD', isAvailable: true, isFeatured: true, tags: [], allergens: [], modifierGroups: [], displayOrder: 1, createdAt: '', updatedAt: '' },
      { id: 'item-4', categoryId: 'cat-2', name: 'Pasta Carbonara', price: 14.99, currency: 'USD', isAvailable: true, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 2, createdAt: '', updatedAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'cat-3', menuId: 'menu-1', name: 'Desserts', displayOrder: 3, isActive: true,
    items: [
      { id: 'item-6', categoryId: 'cat-3', name: 'Chocolate Cake', price: 7.99, currency: 'USD', isAvailable: true, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 1, createdAt: '', updatedAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
]

export default function ShopMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(mockCategories)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id ?? '')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showItemEditor, setShowItemEditor] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => a.displayOrder - b.displayOrder)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sorted.length) return
    const newSorted = [...sorted]
    const temp = newSorted[index]
    const target = newSorted[targetIndex]
    if (!temp || !target) return
    newSorted[index] = target
    newSorted[targetIndex] = temp
    newSorted.forEach((c, i) => (c.displayOrder = i + 1))
    setCategories(newSorted)
  }

  const toggleItemAvailability = (itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) =>
          item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
        ),
      }))
    )
  }

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId))
    setShowDeleteConfirm(null)
    if (selectedCategoryId === catId) {
      setSelectedCategoryId(categories.find((c) => c.id !== catId)?.id ?? '')
    }
  }

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Menu Management</h2>
        <p className="text-sm text-gray-500 mt-1">Organize your menu items and categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Panel */}
        <div className="lg:col-span-1">
          <Card padding="none">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <p className="text-xs text-gray-500 mt-1">Drag to reorder (use arrows)</p>
            </div>
            <div className="p-2 space-y-1">
              {sortedCategories.map((category, index) => (
                <div
                  key={category.id}
                  className={cn(
                    'group flex items-center gap-2 px-2 py-2 rounded-lg transition-colors',
                    selectedCategoryId === category.id
                      ? 'bg-orange-50 border border-orange-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  )}
                >
                  <GripVertical className="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
                  <button
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className={cn(
                      'text-sm font-medium truncate',
                      selectedCategoryId === category.id ? 'text-orange-700' : 'text-gray-700'
                    )}>
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-400">{category.items.length} items</p>
                  </button>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveCategory(index, 'up') }}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveCategory(index, 'down') }}
                      disabled={index === sortedCategories.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingCategory(category.id) }}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(category.id) }}
                      className="p-1 rounded hover:bg-red-50 text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors mt-1">
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </Card>
        </div>

        {/* Items Panel */}
        <div className="lg:col-span-3">
          {selectedCategory ? (
            <Card padding="none">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedCategory.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCategory.items.length} items</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => { setEditingItem(null); setShowItemEditor(true) }}
                >
                  Add Item
                </Button>
              </div>
              <div className="divide-y divide-gray-50">
                {selectedCategory.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UtensilsCrossed className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        {item.isFeatured && <Badge variant="brand" size="sm">Featured</Badge>}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{formatCurrency(item.price)}</p>
                    </div>
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors',
                        item.isAvailable
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      )}
                    >
                      {item.isAvailable ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingItem(item); setShowItemEditor(true) }}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {selectedCategory.items.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-500 mb-3">No items in this category yet</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => { setEditingItem(null); setShowItemEditor(true) }}
                    >
                      Add First Item
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <EmptyState
              icon={<UtensilsCrossed className="h-12 w-12" />}
              title="Select a category"
              description="Choose a category from the left to manage items."
            />
          )}
        </div>
      </div>

      {/* Category Editor */}
      {editingCategory && (
        <CategoryEditor
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={categories.find((c) => c.id === editingCategory)!}
          onSave={(name) => {
            setCategories((prev) => prev.map((c) => c.id === editingCategory ? { ...c, name } : c))
            setEditingCategory(null)
          }}
        />
      )}

      {/* Menu Item Editor */}
      <MenuItemEditor
        open={showItemEditor}
        onClose={() => setShowItemEditor(false)}
        item={editingItem}
        onSave={() => {
          setShowItemEditor(false)
          setEditingItem(null)
        }}
      />

      {/* Delete Category Confirm */}
      <ConfirmDialog
        open={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && deleteCategory(showDeleteConfirm)}
        title="Delete Category"
        message={(() => {
          const cat = categories.find((c) => c.id === showDeleteConfirm)
          if (cat && cat.items.length > 0) {
            return `This category has ${cat.items.length} item${cat.items.length !== 1 ? 's' : ''}. Deleting it will also remove all items. Are you sure?`
          }
          return 'Are you sure you want to delete this category?'
        })()}
        confirmLabel="Delete"
        destructive
      />
    </div>
  )
}
