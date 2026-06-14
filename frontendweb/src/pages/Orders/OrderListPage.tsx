import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useOrderList } from '@/hooks/useOrders'
import Tabs from '@/components/ui/Tabs'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { SkeletonOrder } from '@/components/ui/Skeleton'
import OrderCard from './components/OrderCard'
import { OrderStatus } from '@/types/order.types'

const ACTIVE_STATUSES = [
  OrderStatus.PLACED,
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.PAYMENT_CONFIRMED,
  OrderStatus.RESTAURANT_ACCEPTED,
  OrderStatus.PREPARING,
  OrderStatus.READY_FOR_PICKUP,
  OrderStatus.PICKED_UP,
  OrderStatus.OUT_FOR_DELIVERY,
]

const PAST_STATUSES = [
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
]

const TABS = [
  { key: 'active', label: 'Active Orders' },
  { key: 'past', label: 'Past Orders' },
]

export default function OrderListPage() {
  const [activeTab, setActiveTab] = useState('active')

  const statuses = activeTab === 'active' ? ACTIVE_STATUSES : PAST_STATUSES

  const { data, isLoading } = useOrderList({
    status: statuses[0],
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const orders = data?.data ?? []

  const filteredOrders = orders.filter((order) => statuses.includes(order.status))

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold text-surface-900">My Orders</h1>

        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonOrder key={i} />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-16 w-16" />}
            title="No orders yet"
            description="Browse restaurants and place your first order!"
            action={
              <Link to="/">
                <Button>Browse Restaurants</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
