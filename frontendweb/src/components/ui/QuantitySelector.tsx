import { cn } from '@/utils/cn'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  className?: string
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1)
  }

  const handleIncrement = () => {
    if (value < max) onChange(value + 1)
  }

  const canDecrement = value > min && !disabled
  const canIncrement = value < max && !disabled

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-surface-200 bg-white',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={!canDecrement}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-l-xl text-surface-600 transition-colors',
          'hover:bg-surface-50 active:bg-surface-100',
          'disabled:text-surface-300 disabled:cursor-not-allowed',
        )}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      <span className="flex h-9 w-10 items-center justify-center border-x border-surface-200 text-sm font-semibold text-surface-900 tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={!canIncrement}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-r-xl text-surface-600 transition-colors',
          'hover:bg-surface-50 active:bg-surface-100',
          'disabled:text-surface-300 disabled:cursor-not-allowed',
        )}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  )
}
