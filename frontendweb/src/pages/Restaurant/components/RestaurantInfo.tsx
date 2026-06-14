import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import Badge from '@/components/ui/Badge'
import {
  Star,
  Clock,
  Truck,
  Info,
  Heart,
} from 'lucide-react'
import { DayOfWeek, type Restaurant } from '@/types/restaurant.types'

interface RestaurantInfoProps {
  restaurant: Restaurant
  isOpenNow: boolean
  isFavorited: boolean
  onToggleFavorite: () => void
}

function getTodayHours(restaurant: Restaurant): { open: string; close: string; isClosed: boolean } | null {
  const dayNames: DayOfWeek[] = [
    DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY,
  ]
  const today = dayNames[new Date().getDay()]
  const hours = restaurant.operatingHours.find((h) => h.dayOfWeek === today)
  if (!hours) return null
  return { open: hours.openTime, close: hours.closeTime, isClosed: hours.isClosed }
}

function formatTime12(time: string): string {
  const [h = 0, m = 0] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`
}

export default function RestaurantInfo({
  restaurant,
  isOpenNow,
  isFavorited,
  onToggleFavorite,
}: RestaurantInfoProps) {
  const todayHours = getTodayHours(restaurant)

  const hoursText = (() => {
    if (!todayHours) return null
    if (todayHours.isClosed) return 'Closed today'
    if (isOpenNow) return `Closes at ${formatTime12(todayHours.close)}`
    return `Opens at ${formatTime12(todayHours.open)}`
  })()

  return (
    <div className="py-5 space-y-4">
      {/* Name and Rating */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-surface-900 truncate">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-surface-900">
                {restaurant.rating.average.toFixed(1)}
              </span>
              <span className="text-sm text-surface-500">
                ({restaurant.rating.totalReviews.toLocaleString()} reviews)
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onToggleFavorite}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all active:scale-90',
            isFavorited
              ? 'border-red-200 bg-red-50'
              : 'border-surface-200 bg-white hover:border-surface-300'
          )}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              isFavorited ? 'fill-red-500 text-red-500' : 'text-surface-400'
            )}
          />
        </button>
      </div>

      {/* Cuisine Tags */}
      {restaurant.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {restaurant.tags.map((tag) => (
            <Badge key={tag} variant="default" size="md">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Delivery Info Row */}
      <div className="flex items-center gap-4 text-sm text-surface-600">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-surface-400" />
          <span className="font-medium">{restaurant.estimatedDeliveryTime} min</span>
        </div>
        <div className="h-4 w-px bg-surface-200" />
        <div className="flex items-center gap-1.5">
          <Truck className="h-4 w-4 text-surface-400" />
          <span className="font-medium">
            {restaurant.deliveryFee === 0
              ? 'Free delivery'
              : `${formatCurrency(restaurant.deliveryFee)} delivery`}
          </span>
        </div>
        <div className="h-4 w-px bg-surface-200" />
        <div className="flex items-center gap-1.5">
          <Info className="h-4 w-4 text-surface-400" />
          <span className="font-medium">
            {formatCurrency(restaurant.minimumOrderAmount)} min order
          </span>
        </div>
      </div>

      {/* Today's Hours */}
      {hoursText && (
        <div className="flex items-center gap-2 rounded-xl bg-surface-50 px-3 py-2">
          <Clock className="h-4 w-4 text-surface-400 shrink-0" />
          <span
            className={cn(
              'text-sm font-medium',
              isOpenNow ? 'text-green-600' : 'text-surface-600'
            )}
          >
            {hoursText}
          </span>
        </div>
      )}
    </div>
  )
}
