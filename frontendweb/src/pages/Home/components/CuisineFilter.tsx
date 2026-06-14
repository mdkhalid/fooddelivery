import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

const CUISINES = [
  { id: 'all', label: 'All', emoji: '🍽️' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'sushi', label: 'Sushi', emoji: '🍣' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'chinese', label: 'Chinese', emoji: '🥡' },
  { id: 'indian', label: 'Indian', emoji: '🍛' },
  { id: 'mexican', label: 'Mexican', emoji: '🌮' },
  { id: 'thai', label: 'Thai', emoji: '🍜' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'japanese', label: 'Japanese', emoji: '🍱' },
  { id: 'korean', label: 'Korean', emoji: '🥘' },
  { id: 'vietnamese', label: 'Vietnamese', emoji: '🍲' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'healthy', label: 'Healthy', emoji: '🥗' },
]

interface CuisineFilterProps {
  selected: string
  onSelect: (cuisine: string) => void
}

export default function CuisineFilter({ selected, onSelect }: CuisineFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftArrow(el.scrollLeft > 10)
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth - 100
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur-sm border border-surface-100 text-surface-600 hover:bg-white hover:text-surface-900 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CUISINES.map((cuisine) => {
          const isActive = selected === cuisine.id
          return (
            <button
              key={cuisine.id}
              onClick={() => onSelect(cuisine.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-brand text-white shadow-glow-brand'
                  : 'bg-white text-surface-600 border border-surface-200 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50/50 shadow-card',
              )}
            >
              <span className="text-lg leading-none">{cuisine.emoji}</span>
              <span>{cuisine.label}</span>
            </button>
          )
        })}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur-sm border border-surface-100 text-surface-600 hover:bg-white hover:text-surface-900 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
