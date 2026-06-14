import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/utils/cn'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { ModifierGroup, ModifierOption, ModifierGroupType } from '@/types/menu.types'

interface ModifierGroupEditorProps {
  group: ModifierGroup
  onChange: (group: ModifierGroup) => void
  onRemove: () => void
}

const selectionRuleOptions = [
  { value: 'SINGLE', label: 'Single Select (pick one)' },
  { value: 'MULTIPLE', label: 'Multi Select (pick many)' },
]

export default function ModifierGroupEditor({ group, onChange, onRemove }: ModifierGroupEditorProps) {
  const [expanded, setExpanded] = useState(true)

  const addOption = () => {
    const newOption: ModifierOption = {
      id: `opt-${Date.now()}`,
      modifierGroupId: group.id,
      name: '',
      price: 0,
      isAvailable: true,
      displayOrder: group.options.length,
      createdAt: '',
      updatedAt: '',
    }
    onChange({ ...group, options: [...group.options, newOption] })
  }

  const updateOption = (index: number, updates: Partial<ModifierOption>) => {
    const newOptions = [...group.options]
    const existing = newOptions[index]
    if (!existing) return
    newOptions[index] = { ...existing, ...updates }
    onChange({ ...group, options: newOptions })
  }

  const removeOption = (index: number) => {
    onChange({ ...group, options: group.options.filter((_, i) => i !== index) })
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-gray-50">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 text-left"
        >
          <p className="text-sm font-medium text-gray-700">
            {group.name || 'Untitled Group'}
          </p>
          <p className="text-xs text-gray-400">{group.options.length} options</p>
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-3 space-y-3 border-t border-gray-100">
          <Input
            label="Group Name"
            value={group.name}
            onChange={(e) => onChange({ ...group, name: e.target.value })}
            placeholder="e.g. Size, Toppings"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Selection Rule</label>
            <div className="flex gap-2">
              {selectionRuleOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const type = opt.value as ModifierGroupType
                    onChange({
                      ...group,
                      type,
                      minSelections: type === 'SINGLE' ? 1 : 0,
                      maxSelections: type === 'SINGLE' ? 1 : group.options.length || 10,
                    })
                  }}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                    group.type === opt.value
                      ? 'border-orange-300 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Options</label>
            {group.options.map((option, i) => (
              <div key={option.id} className="flex items-center gap-2">
                <GripVertical className="w-3 h-3 text-gray-300 shrink-0 cursor-grab" />
                <Input
                  value={option.name}
                  onChange={(e) => updateOption(i, { name: e.target.value })}
                  placeholder="Option name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={option.price || ''}
                  onChange={(e) => updateOption(i, { price: parseFloat(e.target.value) || 0 })}
                  placeholder="$0.00"
                  className="w-24"
                />
                <button
                  onClick={() => removeOption(i)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={addOption}
            >
              Add Option
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
