import { Phone, MessageCircle, Star } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import type { OrderDriverInfo } from '@/types/order.types'

interface DriverInfoProps {
  driver: OrderDriverInfo
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-surface-200'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-surface-600">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function DriverInfo({ driver }: DriverInfoProps) {
  const fullName = `${driver.firstName} ${driver.lastName}`

  return (
    <div className="rounded-2xl border border-surface-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <Avatar src={driver.avatarUrl} name={fullName} size="lg" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-surface-900 truncate">{fullName}</h4>
          {driver.rating != null && <RatingStars rating={driver.rating} />}
        </div>
      </div>

      {driver.vehicleType && (
        <div className="mt-3 rounded-xl bg-surface-50 px-3 py-2 text-xs text-surface-600">
          <span className="font-medium">{driver.vehicleType}</span>
          {driver.vehiclePlateNumber && (
            <span className="ml-2 rounded bg-surface-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-surface-700">
              {driver.vehiclePlateNumber}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Phone className="h-4 w-4" />}
          className="flex-1"
          disabled={!driver.phone}
          onClick={() => driver.phone && window.open(`tel:${driver.phone}`)}
        >
          Call
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<MessageCircle className="h-4 w-4" />}
          className="flex-1"
        >
          Message
        </Button>
      </div>
    </div>
  )
}
