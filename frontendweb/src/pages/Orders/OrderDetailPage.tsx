import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  ChefHat,
  Package,
  Truck,
  Check,
  X,
  RotateCcw,
  Navigation,
  AlertCircle,
} from 'lucide-react'
import { useOrderDetail, useCancelOrder, useReorder } from '@/hooks/useOrders'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import OrderStatusBadge from './components/OrderStatusBadge'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { OrderStatus } from '@/types/order.types'

const TIMELINE_ICONS: Record<string, typeof Clock> = {
  [OrderStatus.PLACED]: Clock,
  [OrderStatus.PAYMENT_CONFIRMED]: CheckCircle,
  [OrderStatus.RESTAURANT_ACCEPTED]: CheckCircle,
  [OrderStatus.PREPARING]: ChefHat,
  [OrderStatus.READY_FOR_PICKUP]: Package,
  [OrderStatus.OUT_FOR_DELIVERY]: Truck,
  [OrderStatus.DELIVERED]: Check,
  [OrderStatus.CANCELLED]: X,
}

const CANCELLABLE_STATUSES = new Set([
  OrderStatus.PLACED,
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.PAYMENT_CONFIRMED,
  OrderStatus.RESTAURANT_ACCEPTED,
])

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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const { data: order, isLoading, error } = useOrderDetail(id!)
  const cancelOrder = useCancelOrder()
  const reorder = useReorder()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-surface-200" />
          <Card padding="lg" className="space-y-4">
            <SkeletonText lines={2} />
            <Skeleton variant="rect" className="h-40" />
            <SkeletonText lines={4} />
          </Card>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Button variant="ghost" leftIcon={<ArrowLeft />} onClick={() => navigate(-1)} className="mb-6">
            Back
          </Button>
          <Card padding="lg">
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle className="h-12 w-12 text-surface-300" />
              <p className="text-sm text-surface-600">Order not found or failed to load.</p>
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const canCancel = CANCELLABLE_STATUSES.has(order.status)
  const isActive = ACTIVE_STATUSES.has(order.status)

  const handleCancel = () => {
    cancelOrder.mutate(
      { orderId: order.id, reason: cancelReason || 'Cancelled by user' },
      {
        onSuccess: () => {
          setShowCancelDialog(false)
          setCancelReason('')
        },
      },
    )
  }

  const handleReorder = () => {
    reorder.mutate({ originalOrderId: order.id })
  }

  const completedStatuses = order.timeline
    .filter((e) => e.status !== order.status)
    .map((e) => e.status)

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Button variant="ghost" leftIcon={<ArrowLeft />} onClick={() => navigate(-1)} className="mb-6">
          Back
        </Button>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-surface-900">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-surface-500">{formatDateTime(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Status Timeline */}
        <Card padding="lg" className="mb-6">
          <h2 className="mb-4 text-sm font-semibold text-surface-900">Order Progress</h2>
          <div className="relative">
            {order.timeline.map((event, index) => {
              const Icon = TIMELINE_ICONS[event.status] ?? Clock
              const isCompleted = completedStatuses.includes(event.status) || index < order.timeline.length - 1
              const isCurrent = event.status === order.status

              return (
                <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < order.timeline.length - 1 && (
                    <div
                      className={`absolute left-[15px] top-8 h-full w-0.5 ${
                        isCompleted ? 'bg-brand-400' : 'bg-surface-200'
                      }`}
                    />
                  )}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isCurrent
                        ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                        : isCompleted
                          ? 'bg-brand-100 text-brand-600'
                          : 'bg-surface-100 text-surface-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-brand-600' : isCompleted ? 'text-surface-900' : 'text-surface-400'
                      }`}
                    >
                      {event.description}
                    </p>
                    <p className="text-xs text-surface-400">{formatDateTime(event.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Items */}
        <Card padding="lg" className="mb-6">
          <h2 className="mb-4 text-sm font-semibold text-surface-900">Items</h2>
          <div className="divide-y divide-surface-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-100">
                  <ImageWithFallback
                    src={item.imageUrl ?? ''}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">{item.name}</p>
                  {item.modifiers.length > 0 && (
                    <p className="text-xs text-surface-400 truncate">
                      {item.modifiers.map((m) => m.modifierOptionName).join(', ')}
                    </p>
                  )}
                  <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-surface-900">
                  {formatCurrency(item.subtotal, order.currency)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Address */}
        <Card padding="lg" className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-surface-900">Delivery Address</h2>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-surface-400" />
            <div>
              <p className="text-sm text-surface-700">{order.deliveryAddress.streetAddress}</p>
              {order.deliveryAddress.streetAddress2 && (
                <p className="text-sm text-surface-500">{order.deliveryAddress.streetAddress2}</p>
              )}
              <p className="text-sm text-surface-500">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                {order.deliveryAddress.zipCode}
              </p>
            </div>
          </div>
        </Card>

        {/* Payment & Total */}
        <Card padding="lg" className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-surface-900">Payment</h2>
          <div className="flex items-center gap-2 text-sm text-surface-600">
            <CreditCard className="h-4 w-4" />
            <span className="capitalize">{order.paymentStatus.toLowerCase().replace('_', ' ')}</span>
          </div>

          <div className="mt-4 space-y-2 border-t border-surface-100 pt-4">
            <div className="flex justify-between text-sm text-surface-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal, order.currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-surface-600">
              <span>Delivery Fee</span>
              <span>{formatCurrency(order.deliveryFee, order.currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-surface-600">
              <span>Tax</span>
              <span>{formatCurrency(order.tax, order.currency)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount, order.currency)}</span>
              </div>
            )}
            {order.tip > 0 && (
              <div className="flex justify-between text-sm text-surface-600">
                <span>Tip</span>
                <span>{formatCurrency(order.tip, order.currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-surface-100 pt-2 text-base font-bold text-surface-900">
              <span>Total</span>
              <span>{formatCurrency(order.total, order.currency)}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {isActive && (
            <Link to={`/orders/${order.id}/tracking`} className="flex-1">
              <Button fullWidth leftIcon={<Navigation />}>
                Track Order
              </Button>
            </Link>
          )}
          {canCancel && (
            <Button
              variant="danger"
              className="flex-1"
              leftIcon={<X />}
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel Order
            </Button>
          )}
          {!isActive && order.status !== OrderStatus.CANCELLED && (
            <Button className="flex-1" leftIcon={<RotateCcw />} onClick={handleReorder} loading={reorder.isPending}>
              Reorder
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel="Cancel Order"
        destructive
        loading={cancelOrder.isPending}
      />
    </div>
  )
}
