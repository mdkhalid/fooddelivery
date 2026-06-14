import { useState } from 'react'
import { Trash2, Plus, X } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ModifierGroupEditor from './ModifierGroupEditor'
import type { MenuItem, ModifierGroup, SpiceLevel } from '@/types/menu.types'

interface MenuItemEditorProps {
  open: boolean
  onClose: () => void
  item: MenuItem | null
  onSave: (item: Partial<MenuItem>) => void
}

const spiceOptions = [
  { value: 'NONE', label: 'None' },
  { value: 'MILD', label: 'Mild' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HOT', label: 'Hot' },
  { value: 'EXTRA_HOT', label: 'Extra Hot' },
]

export default function MenuItemEditor({ open, onClose, item, onSave }: MenuItemEditorProps) {
  const [form, setForm] = useState({
    name: item?.name ?? '',
    description: item?.description ?? '',
    price: item?.price?.toString() ?? '',
    spiceLevel: item?.spiceLevel ?? 'NONE',
    tags: item?.tags ?? [],
    allergens: item?.allergens ?? [],
    isAvailable: item?.isAvailable ?? true,
  })
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(item?.modifierGroups ?? [])
  const [tagInput, setTagInput] = useState('')
  const [allergenInput, setAllergenInput] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = () => {
    onSave({
      ...item,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      spiceLevel: form.spiceLevel as SpiceLevel,
      tags: form.tags,
      allergens: form.allergens,
      isAvailable: form.isAvailable,
      modifierGroups,
    })
  }

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const addAllergen = () => {
    if (allergenInput.trim() && !form.allergens.includes(allergenInput.trim())) {
      setForm({ ...form, allergens: [...form.allergens, allergenInput.trim()] })
      setAllergenInput('')
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={item ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
        footer={
          <>
            {item && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setShowDeleteConfirm(true)}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!form.name || !form.price}>
              {item ? 'Save Changes' : 'Add Item'}
            </Button>
          </>
        }
      >
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          {/* Basic Info */}
          <div className="space-y-4">
            <Input
              label="Item Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Grilled Chicken"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all"
                placeholder="Brief description of the item"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price *"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
              <Select
                label="Spice Level"
                options={spiceOptions}
                value={form.spiceLevel}
                onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })}
              />
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Dietary Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  {tag}
                  <button onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag (e.g. vegan, gluten-free)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button variant="secondary" size="sm" onClick={addTag}>Add</Button>
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Allergens</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.allergens.map((a) => (
                <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                  {a}
                  <button onClick={() => setForm({ ...form, allergens: form.allergens.filter((t) => t !== a) })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={allergenInput}
                onChange={(e) => setAllergenInput(e.target.value)}
                placeholder="Add allergen (e.g. nuts, dairy)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
              />
              <Button variant="secondary" size="sm" onClick={addAllergen}>Add</Button>
            </div>
          </div>

          {/* Modifier Groups */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Modifier Groups</label>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Plus className="w-3 h-3" />}
                onClick={() => setModifierGroups([...modifierGroups, {
                  id: `new-${Date.now()}`, menuItemId: '', name: '', type: 'SINGLE' as any,
                  minSelections: 0, maxSelections: 1, isRequired: false, displayOrder: modifierGroups.length,
                  options: [], createdAt: '', updatedAt: '',
                }])}
              >
                Add Group
              </Button>
            </div>
            <div className="space-y-3">
              {modifierGroups.map((group, i) => (
                <ModifierGroupEditor
                  key={group.id}
                  group={group}
                  onChange={(updated) => {
                    const newGroups = [...modifierGroups]
                    newGroups[i] = updated
                    setModifierGroups(newGroups)
                  }}
                  onRemove={() => setModifierGroups(modifierGroups.filter((_, idx) => idx !== i))}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => { setShowDeleteConfirm(false); onClose() }}
        title="Delete Menu Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />
    </>
  )
}
