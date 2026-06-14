import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { useOrderTracking } from '@/hooks/useOrderTracking'
import { useOrderDetail } from '@/hooks/useOrders'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import TrackingMap from './components/TrackingMap'
import DriverInfo from './components/DriverInfo'
import OrderStatusBadge from './components/OrderStatusBadge'
import { formatDateTime } from '@/utils/format'
import { OrderStatus } from '@/types/order.types'

const SEARCHING_STATUSES = new Set([
  OrderStatus.PAYMENT_CONFIRMED,
  OrderStatus.RESTAURANT_ACCEPTED,
  OrderStatus.PREPARING,
  OrderStatus.READY_FOR_PICKUP,
])

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    tracking,
    currentStatus,
    eta,
    isLoading: isTrackingLoading,
    error: trackingError,
    reconnect,
  } = useOrderTracking(id!)

  const { data: order, isLoading: isOrderLoading } = useOrderDetail(id!)

  const isLoading = isTrackingLoading || isOrderLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-surface-200" />
          <Skeleton variant="rect" className="mb-6 h-[250px] md:h-[400px]" />
          <SkeletonText lines={3} />
        </div>
      </div>
    )
  }

  if (trackingError || !tracking || !order) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Button variant="ghost" leftIcon={<ArrowLeft />} onClick={() => navigate(-1)} className="mb-6">
            Back
          </Button>
          <Card padding="lg">
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle className="h-12 w-12 text-surface-300" />
              <p className="text-sm text-surface-600">Failed to load tracking info.</p>
              <Button variant="secondary" leftIcon={<RefreshCw />} onClick={reconnect}>
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const status = currentStatus ?? tracking.status
  const isSearching = SEARCHING_STATUSES.has(status) && !order.driverInfo

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
            <p className="mt-1 text-sm text-surface-500">{order.restaurantName}</p>
          </div>
          <OrderStatusBadge status={status} />
        </div>

        {/* ETA Display */}
        {eta && (
          <Card padding="md" className="mb-6 bg-brand-50/50 border-brand-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100">
                <Clock className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-brand-600 font-medium">Estimated Arrival</p>
                <p className="text-lg font-bold text-brand-700">{eta}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Map */}
        <div className="mb-6">
          <TrackingMap />
        </div>

        {/* Finding driver animation */}
        {isSearching && (
          <Card padding="lg" className="mb-6">
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="relative">
                <Spinner className="h-12 w-12 text-brand-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-brand-500 animate-ping" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-surface-900">Finding a driver...</p>
                <p className="mt-1 text-xs text-surface-500">
                  We're matching you with the best driver nearby
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Driver Info */}
        {order.driverInfo && (
          <div className="mb-6">
            <DriverInfo driver={order.driverInfo} />
          </div>
        )}

        {/* Status Timeline */}
        <Card padding="lg" className="mb-6">
          <h2 className="mb-4 text-sm font-semibold text-surface-900">Order Updates</h2>
          <div className="relative">
            {tracking.timeline.map((event: { id: string; status: string; description: string; timestamp: string }, index: number) => {
              const isCurrent = event.status === status
              const isCompleted = index < tracking.timeline.length - 1

              return (
                <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < tracking.timeline.length - 1 && (
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
                    <div className="h-2 w-2 rounded-full bg-current" />
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
      </div>
    </div>
  )
}
