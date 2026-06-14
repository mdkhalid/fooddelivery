import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { MenuCategory } from '@/types/menu.types'

interface CategoryEditorProps {
  open: boolean
  onClose: () => void
  category: MenuCategory
  onSave: (name: string) => void
}

export default function CategoryEditor({ open, onClose, category, onSave }: CategoryEditorProps) {
  const [name, setName] = useState(category.name)
  const hasItems = category.items.length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Category"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => onSave(name)}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Appetizers"
        />
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{category.items.length} item{category.items.length !== 1 ? 's' : ''} in this category</span>
        </div>
        {hasItems && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              This category contains items. Deleting it will remove all associated items.
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
