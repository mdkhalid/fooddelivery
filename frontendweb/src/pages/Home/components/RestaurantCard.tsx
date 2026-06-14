import { Link } from 'react-router-dom'
import { Star, Clock, Heart, Bike } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import Badge from '@/components/ui/Badge'
import { useFavorites } from '@/hooks/useFavorites'
import type { Restaurant } from '@/types/restaurant.types'

interface RestaurantCardProps {
  restaurant: Restaurant
  className?: string
}

export default function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(restaurant.id)
  const isOpen = restaurant.isActive

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className={cn(
        'group block overflow-hidden rounded-2xl border border-surface-100 bg-white shadow-card',
        'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageWithFallback
          src={restaurant.coverImageUrl || ''}
          alt={restaurant.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          wrapperClassName="h-full w-full"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3">
          <Badge
            variant={isOpen ? 'success' : 'error'}
            size="sm"
            dot
          >
            {isOpen ? 'Open' : 'Closed'}
          </Badge>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(restaurant.id)
          }}
          className={cn(
            'absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200',
            favorited
              ? 'bg-brand-500 text-white shadow-glow-brand'
              : 'bg-white/80 text-surface-400 hover:bg-white hover:text-brand-500',
          )}
        >
          <Heart
            className={cn('h-4 w-4', favorited && 'fill-current')}
          />
        </button>

        {restaurant.estimatedDeliveryTime > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-surface-700 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-brand-500" />
            {restaurant.estimatedDeliveryTime} min
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-surface-900 truncate group-hover:text-brand-600 transition-colors">
            {restaurant.name}
          </h3>
          {restaurant.rating.average > 0 && (
            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-brand-50 px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-surface-700">
                {restaurant.rating.average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {restaurant.tags.length > 0 && (
          <p className="mt-1.5 text-sm text-surface-400 truncate">
            {restaurant.tags.slice(0, 3).join(' · ')}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3 border-t border-surface-100 pt-3">
          <span className="flex items-center gap-1 text-xs text-surface-500">
            <Bike className="h-3.5 w-3.5" />
            {restaurant.deliveryFee === 0 ? (
              <span className="font-medium text-success">Free delivery</span>
            ) : (
              formatCurrency(restaurant.deliveryFee)
            )}
          </span>
          {restaurant.minimumOrderAmount > 0 && (
            <span className="text-xs text-surface-400">
              Min {formatCurrency(restaurant.minimumOrderAmount)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
