import { cn } from '@/utils/cn'
import { ORDER_STATUS_CONFIG } from '@/utils/constants'

interface OrderStatusBadgeProps {
  status: string
  className?: string
}

const PULSING_STATUSES = new Set([
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
])

const STATUS_DOT_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-purple-500',
  out_for_delivery: 'bg-indigo-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
}

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] ?? {
    label: status,
    color: 'bg-surface-100 text-surface-600',
  }
  const isPulsing = PULSING_STATUSES.has(status)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        config.color,
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {isPulsing && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              STATUS_DOT_COLORS[status] ?? 'bg-surface-400',
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            STATUS_DOT_COLORS[status] ?? 'bg-surface-400',
          )}
        />
      </span>
      {config.label}
    </span>
  )
}
