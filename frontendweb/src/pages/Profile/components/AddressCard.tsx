import { Home, Briefcase, MapPin, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import Badge from '@/components/ui/Badge'

interface AddressCardProps {
  id: string
  label: string
  streetAddress: string
  streetAddress2?: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
  isSelected?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const LABEL_ICONS: Record<string, typeof Home> = {
  home: Home,
  work: Briefcase,
}

export default function AddressCard({
  id,
  label,
  streetAddress,
  streetAddress2,
  city,
  state,
  zipCode,
  isDefault,
  isSelected = false,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const Icon = LABEL_ICONS[label.toLowerCase()] ?? MapPin

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-all duration-200',
        isSelected
          ? 'border-brand-400 bg-brand-50/50 shadow-glow-brand'
          : 'border-surface-100 bg-white hover:border-surface-200',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            isSelected ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-surface-500',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-surface-900">{label}</span>
            {isDefault && (
              <Badge variant="success" size="sm">
                Default
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-surface-600">{streetAddress}</p>
          {streetAddress2 && (
            <p className="text-sm text-surface-500">{streetAddress2}</p>
          )}
          <p className="text-sm text-surface-500">
            {city}, {state} {zipCode}
          </p>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(id)}
            className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            disabled={isDefault}
            className={cn(
              'rounded-lg p-2 transition-colors',
              isDefault
                ? 'cursor-not-allowed text-surface-200'
                : 'text-surface-400 hover:bg-red-50 hover:text-red-500',
            )}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
