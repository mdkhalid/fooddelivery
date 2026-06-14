import { Link } from 'react-router-dom'
import { ChevronRight, RotateCcw, Navigation } from 'lucide-react'
import Card from '@/components/ui/Card'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import OrderStatusBadge from './OrderStatusBadge'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatus } from '@/types/order.types'
import type { Order } from '@/types/order.types'

interface OrderCardProps {
  order: Order
}

const ACTIVE_STATUSES = new Set([
  OrderStatus.PLACED,
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.PAYMENT_CONFIRMED,
  OrderStatus.RESTAURANT_ACCEPTED,
  OrderStatus.PREPARING,
  OrderStatus.READY_FOR_PICKUP,
  OrderStatus.PICKED_UP,
  OrderStatus.OUT_FOR_DELIVERY,
])

export default function OrderCard({ order }: OrderCardProps) {
  const isActive = ACTIVE_STATUSES.has(order.status)
  const displayItems = order.items.slice(0, 2)
  const remainingCount = order.items.length - 2

  return (
    <Card hover clickable padding="none" className="overflow-hidden">
      <Link to={`/orders/${order.id}`} className="block">
        <div className="flex gap-4 p-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-100">
            <ImageWithFallback
              src={order.restaurantLogoUrl ?? ''}
              alt={order.restaurantName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-sm font-semibold text-surface-900">
                {order.restaurantName}
              </h3>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-1 text-xs text-surface-500">
              {displayItems.map((item) => item.name).join(', ')}
              {remainingCount > 0 && (
                <span className="text-surface-400"> and {remainingCount} more</span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-surface-900">
                {formatCurrency(order.total, order.currency)}
              </span>
              <span className="text-xs text-surface-400">{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex border-t border-surface-100">
        {isActive ? (
          <Link
            to={`/orders/${order.id}/tracking`}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
          >
            <Navigation className="h-4 w-4" />
            Track Order
          </Link>
        ) : order.status !== OrderStatus.CANCELLED ? (
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reorder
          </button>
        ) : null}
        <div className="h-8 w-px self-center bg-surface-100" />
        <Link
          to={`/orders/${order.id}`}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50"
        >
          Details
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  )
}
