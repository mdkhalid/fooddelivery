import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RestaurantCard from './RestaurantCard'
import type { Restaurant } from '@/types/restaurant.types'

interface FeaturedRowProps {
  title: string
  restaurants: Restaurant[]
}

export default function FeaturedRow({ title, restaurants }: FeaturedRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowLeft(el.scrollLeft > 10)
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
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
  }, [checkScroll, restaurants])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = 300
    el.scrollBy({ left: direction === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' })
  }

  if (restaurants.length === 0) return null

  return (
    <section className="relative">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-surface-900 sm:text-2xl">{title}</h2>
        <div className="hidden sm:flex items-center gap-2">
          {showLeft && (
            <button
              onClick={() => scroll('left')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-200 bg-white text-surface-500 shadow-sm hover:border-brand-300 hover:text-brand-500 hover:shadow-card transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {showRight && (
            <button
              onClick={() => scroll('right')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-200 bg-white text-surface-500 shadow-sm hover:border-brand-300 hover:text-brand-500 hover:shadow-card transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
      >
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="w-[280px] shrink-0 sm:w-[300px] scroll-snap-start"
          >
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>
    </section>
  )
}
