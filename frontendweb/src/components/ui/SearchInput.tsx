import { useState, useEffect, useRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import Spinner from './Spinner'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  debounceMs?: number
  loading?: boolean
  onSearch?: (value: string) => void
  onChange?: (value: string) => void
}

export default function SearchInput({
  debounceMs = 300,
  loading = false,
  onSearch,
  onChange,
  className,
  value: controlledValue,
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const inputRef = useRef<HTMLInputElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue)
    }
  }, [controlledValue])

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onChange?.(newValue)

    if (onSearch) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onSearch(newValue)
      }, debounceMs)
    }
  }

  const handleClear = () => {
    handleChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          'w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-10 pr-10 text-sm text-surface-900 placeholder:text-surface-400',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400',
          className,
        )}
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {loading ? (
          <Spinner size="sm" />
        ) : (
          value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-surface-400 hover:text-surface-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )
        )}
      </div>
    </div>
  )
}
