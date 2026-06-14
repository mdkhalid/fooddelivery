import { Clock, Calendar, X, Pencil } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import Countdown from '@/components/ui/Countdown'
import { formatDateTime } from '@/utils/format'

interface UpcomingOrderCardProps {
  order: {
    id: string
    restaurantName: string
    restaurantImage: string
    scheduledTime: string
    items: string[]
    status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED'
    countdown: number
  }
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'success' | 'error' | 'info' | 'default' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  PREPARING: { label: 'Preparing', variant: 'success' },
  DELIVERED: { label: 'Delivered', variant: 'default' },
  CANCELLED: { label: 'Cancelled', variant: 'error' },
}

const CAN_CANCEL = new Set(['PENDING', 'CONFIRMED'])

export default function UpcomingOrderCard({ order }: UpcomingOrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status] ?? {
    label: order.status,
    variant: 'default' as const,
  }
  const canCancel = CAN_CANCEL.has(order.status)

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex gap-4 p-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-100">
          <ImageWithFallback
            src={order.restaurantImage}
            alt={order.restaurantName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-surface-900">
              {order.restaurantName}
            </h3>
            <Badge variant={statusConfig.variant} size="sm" dot>
              {statusConfig.label}
            </Badge>
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-xs text-surface-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateTime(order.scheduledTime)}</span>
          </div>

          {order.countdown > 0 && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <div className="mt-2 flex items-center gap-2 text-xs text-surface-500">
              <Clock className="h-3.5 w-3.5 text-brand-500" />
              <span>In </span>
              <Countdown totalSeconds={order.countdown} format="hh:mm:ss" className="text-xs font-semibold" />
            </div>
          )}

          <p className="mt-2 text-xs text-surface-400 truncate">
            {order.items.join(' · ')}
          </p>
        </div>
      </div>

      {(canCancel || order.status === 'PENDING' || order.status === 'CONFIRMED') && (
        <div className="flex border-t border-surface-100">
          {canCancel && (
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
          {canCancel && <div className="h-8 w-px self-center bg-surface-100" />}
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
          >
            <Pencil className="h-4 w-4" />
            Edit Time
          </button>
        </div>
      )}
    </Card>
  )
}
