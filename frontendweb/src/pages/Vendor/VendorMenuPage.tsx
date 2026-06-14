import { useState } from 'react'
import {
  Plus, ChevronRight, ChevronDown, Pencil, Trash2, Copy,
  UtensilsCrossed, ArrowRight, Check,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import type { MenuCategory } from '@/types/menu.types'

const mockCategories: MenuCategory[] = [
  {
    id: 'cat-1',
    menuId: 'menu-1',
    name: 'Appetizers',
    displayOrder: 1,
    isActive: true,
    items: [
      { id: 'item-1', categoryId: 'cat-1', name: 'Spring Rolls', price: 8.99, currency: 'USD', isAvailable: true, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 1, createdAt: '', updatedAt: '' },
      { id: 'item-2', categoryId: 'cat-1', name: 'Garlic Bread', price: 5.99, currency: 'USD', isAvailable: true, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 2, createdAt: '', updatedAt: '' },
    ],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'cat-2',
    menuId: 'menu-1',
    name: 'Main Course',
    displayOrder: 2,
    isActive: true,
    items: [
      { id: 'item-3', categoryId: 'cat-2', name: 'Grilled Chicken', price: 16.99, currency: 'USD', isAvailable: true, isFeatured: true, tags: [], allergens: [], modifierGroups: [], displayOrder: 1, createdAt: '', updatedAt: '' },
      { id: 'item-4', categoryId: 'cat-2', name: 'Pasta Carbonara', price: 14.99, currency: 'USD', isAvailable: true, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 2, createdAt: '', updatedAt: '' },
      { id: 'item-5', categoryId: 'cat-2', name: 'Veggie Burger', price: 12.99, currency: 'USD', isAvailable: false, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 3, createdAt: '', updatedAt: '' },
    ],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'cat-3',
    menuId: 'menu-1',
    name: 'Desserts',
    displayOrder: 3,
    isActive: true,
    items: [
      { id: 'item-6', categoryId: 'cat-3', name: 'Chocolate Cake', price: 7.99, currency: 'USD', isAvailable: true, isFeatured: false, tags: [], allergens: [], modifierGroups: [], displayOrder: 1, createdAt: '', updatedAt: '' },
    ],
    createdAt: '',
    updatedAt: '',
  },
]

const mockBranches = [
  { id: 'b1', name: 'Downtown Main', hasOverrides: false },
  { id: 'b2', name: 'Westside Plaza', hasOverrides: true },
  { id: 'b3', name: 'Eastgate Mall', hasOverrides: false },
]

export default function VendorMenuPage() {
  const [categories] = useState<MenuCategory[]>(mockCategories)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id ?? '')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map((c) => c.id)))
  const [showPushModal, setShowPushModal] = useState(false)
  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set())
  const [showDiff, setShowDiff] = useState(false)

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  const toggleExpand = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId)
      else next.add(catId)
      return next
    })
  }

  const toggleBranch = (branchId: string) => {
    setSelectedBranches((prev) => {
      const next = new Set(prev)
      if (next.has(branchId)) next.delete(branchId)
      else next.add(branchId)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Shared Menu</h2>
          <p className="text-sm text-gray-500 mt-1">Manage menu items across all branches</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            leftIcon={<Copy className="w-4 h-4" />}
            onClick={() => setShowDiff(true)}
          >
            View Overrides
          </Button>
          <Button
            variant="primary"
            leftIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => setShowPushModal(true)}
          >
            Push to Branches
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Panel */}
        <div className="lg:col-span-1">
          <Card padding="none">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="p-2">
              {categories
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedCategoryId(category.id)
                        toggleExpand(category.id)
                      }}
                      className={cn(
                        'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        selectedCategoryId === category.id
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="w-4 h-4 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      )}
                      <span className="truncate">{category.name}</span>
                      <span className="ml-auto text-xs text-gray-400">{category.items.length}</span>
                    </button>
                  </div>
                ))}
              <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors mt-1">
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
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Add Item
                </Button>
              </div>
              <div className="divide-y divide-gray-50">
                {selectedCategory.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
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
                        {!item.isAvailable && (
                          <Badge variant="error" size="sm">Unavailable</Badge>
                        )}
                        {item.isFeatured && (
                          <Badge variant="brand" size="sm">Featured</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {selectedCategory.items.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-500">
                    No items in this category yet
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <EmptyState
              icon={<UtensilsCrossed className="h-12 w-12" />}
              title="Select a category"
              description="Choose a category from the left to view and manage items."
            />
          )}
        </div>
      </div>

      {/* Push to Branches Modal */}
      <Modal
        open={showPushModal}
        onClose={() => setShowPushModal(false)}
        title="Push Menu to Branches"
        description="Select branches to push the shared menu to."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowPushModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              disabled={selectedBranches.size === 0}
              onClick={() => setShowPushModal(false)}
            >
              Push to {selectedBranches.size} Branch{selectedBranches.size !== 1 ? 'es' : ''}
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          {mockBranches.map((branch) => (
            <label
              key={branch.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer',
                selectedBranches.has(branch.id)
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="checkbox"
                checked={selectedBranches.has(branch.id)}
                onChange={() => toggleBranch(branch.id)}
                className="sr-only"
              />
              <div className={cn(
                'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors',
                selectedBranches.has(branch.id)
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-gray-300'
              )}>
                {selectedBranches.has(branch.id) && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{branch.name}</p>
                {branch.hasOverrides && (
                  <p className="text-xs text-amber-600">Has branch-specific overrides</p>
                )}
              </div>
            </label>
          ))}
        </div>
      </Modal>

      {/* Diff View Modal */}
      <Modal
        open={showDiff}
        onClose={() => setShowDiff(false)}
        title="Branch Overrides"
        description="View items that differ from the shared menu per branch."
        size="lg"
      >
        <div className="space-y-4">
          {mockBranches.filter((b) => b.hasOverrides).map((branch) => (
            <div key={branch.id} className="border border-gray-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">{branch.name}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Spring Rolls — price override: $9.99 (shared: $8.99)
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Veggie Burger — marked as available (shared: unavailable)
                </p>
              </div>
            </div>
          ))}
          {mockBranches.filter((b) => b.hasOverrides).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No branch overrides found</p>
          )}
        </div>
      </Modal>
    </div>
  )
}
