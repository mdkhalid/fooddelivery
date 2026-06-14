import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Package,
  CreditCard,
  Truck,
  Star,
  Tag,
  Settings,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import Pagination from '@/components/ui/Pagination'
import { useNotificationList, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Notification } from '@/types/notification.types'

const NOTIFICATION_ICONS: Record<string, { icon: typeof Package; color: string }> = {
  ORDER_PLACED: { icon: Package, color: 'text-blue-500 bg-blue-100' },
  ORDER_CONFIRMED: { icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
  ORDER_PREPARING: { icon: Package, color: 'text-orange-500 bg-orange-100' },
  ORDER_READY: { icon: Package, color: 'text-purple-500 bg-purple-100' },
  ORDER_PICKED_UP: { icon: Truck, color: 'text-indigo-500 bg-indigo-100' },
  ORDER_OUT_FOR_DELIVERY: { icon: Truck, color: 'text-indigo-500 bg-indigo-100' },
  ORDER_DELIVERED: { icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
  ORDER_CANCELLED: { icon: AlertCircle, color: 'text-red-500 bg-red-100' },
  ORDER_REFUNDED: { icon: CreditCard, color: 'text-green-500 bg-green-100' },
  PAYMENT_SUCCESS: { icon: CreditCard, color: 'text-green-500 bg-green-100' },
  PAYMENT_FAILED: { icon: AlertCircle, color: 'text-red-500 bg-red-100' },
  PAYMENT_REFUND: { icon: CreditCard, color: 'text-green-500 bg-green-100' },
  DELIVERY_ASSIGNED: { icon: Truck, color: 'text-indigo-500 bg-indigo-100' },
  DELIVERY_PICKED_UP: { icon: Truck, color: 'text-indigo-500 bg-indigo-100' },
  DELIVERY_DELIVERED: { icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
  DRIVER_RATED: { icon: Star, color: 'text-amber-500 bg-amber-100' },
  NEW_ORDER: { icon: Package, color: 'text-blue-500 bg-blue-100' },
  ORDER_ACCEPTED: { icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
  ORDER_REJECTED: { icon: AlertCircle, color: 'text-red-500 bg-red-100' },
  RESTAURANT_RATED: { icon: Star, color: 'text-amber-500 bg-amber-100' },
  PROMOTION: { icon: Tag, color: 'text-pink-500 bg-pink-100' },
  SPECIAL_OFFER: { icon: Tag, color: 'text-pink-500 bg-pink-100' },
  NEWSLETTER: { icon: Bell, color: 'text-blue-500 bg-blue-100' },
  ACCOUNT_VERIFIED: { icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
  PROFILE_UPDATED: { icon: Settings, color: 'text-surface-500 bg-surface-100' },
  PASSWORD_CHANGED: { icon: Settings, color: 'text-surface-500 bg-surface-100' },
  SYSTEM_MAINTENANCE: { icon: AlertCircle, color: 'text-amber-500 bg-amber-100' },
  SYSTEM_UPDATE: { icon: Bell, color: 'text-blue-500 bg-blue-100' },
}

function getNotificationRoute(notification: Notification): string | null {
  const type = notification.type
  if (type.startsWith('ORDER_') || type.startsWith('DELIVERY_')) {
    const orderId = notification.data?.orderId
    return orderId ? `/orders/${orderId}` : '/orders'
  }
  if (type.startsWith('PAYMENT_')) return '/invoices'
  if (type.startsWith('RESTAURANT_') || type === 'DRIVER_RATED') return '/orders'
  return null
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { data, isLoading } = useNotificationList(page, 20)
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const notifications = data?.data ?? []
  const meta = data?.meta

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      if (!notification.isRead) {
        markAsRead.mutate({ notificationId: notification.id })
      }
      const route = getNotificationRoute(notification)
      if (route) navigate(route)
    },
    [markAsRead, navigate],
  )

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead.mutate()
  }, [markAllAsRead])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-surface-900">Notifications</h1>
            <p className="mt-1 text-sm text-surface-500">Stay updated on your orders and account</p>
          </div>
          {notifications.length > 0 && notifications.some((n) => !n.isRead) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<CheckCheck className="h-4 w-4" />}
            >
              Mark All Read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-16 w-16" />}
            title="No notifications yet"
            description="When you get notifications, they'll appear here."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const iconConfig = NOTIFICATION_ICONS[notification.type] ?? {
                icon: Bell,
                color: 'text-surface-500 bg-surface-100',
              }
              const Icon = iconConfig.icon

              return (
                <Card
                  key={notification.id}
                  padding="md"
                  hover
                  clickable
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'transition-all',
                    !notification.isRead && 'border-l-4 border-l-brand-500 bg-brand-50/30',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'h-10 w-10 shrink-0 rounded-full flex items-center justify-center',
                        iconConfig.color,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-surface-900 truncate">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-surface-600 line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="mt-1 text-xs text-surface-400">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            className="mt-6"
          />
        )}
      </div>
    </div>
  )
}
