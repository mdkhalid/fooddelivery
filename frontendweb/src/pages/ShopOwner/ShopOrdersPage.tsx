import { useState, useEffect, useCallback } from 'react'
import { ShoppingBag, CheckCircle, XCircle, Package } from 'lucide-react'
import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import EmptyState from '@/components/ui/EmptyState'
import OrderCard from './components/OrderCard'

interface ShopOrder {
  id: string
  orderNumber: string
  customerName: string
  items: { name: string; quantity: number; modifiers?: string }[]
  total: number
  deliveryAddress: string
  status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  createdAt: string
  elapsedMinutes: number
}

const mockOrders: ShopOrder[] = [
  {
    id: '1', orderNumber: 'ORD-2001', customerName: 'Alice Johnson',
    items: [{ name: 'Grilled Chicken', quantity: 2 }, { name: 'Fries', quantity: 1 }],
    total: 24.98, deliveryAddress: '123 Main St, Apt 4B', status: 'new',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), elapsedMinutes: 5,
  },
  {
    id: '2', orderNumber: 'ORD-2002', customerName: 'Bob Smith',
    items: [{ name: 'Pasta Carbonara', quantity: 1, modifiers: 'Extra cheese' }, { name: 'Garlic Bread', quantity: 1 }],
    total: 19.98, deliveryAddress: '456 West Ave', status: 'new',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(), elapsedMinutes: 12,
  },
  {
    id: '3', orderNumber: 'ORD-2003', customerName: 'Carol White',
    items: [{ name: 'Spring Rolls', quantity: 3 }],
    total: 26.97, deliveryAddress: '789 East Blvd', status: 'preparing',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), elapsedMinutes: 25,
  },
  {
    id: '4', orderNumber: 'ORD-2004', customerName: 'David Lee',
    items: [{ name: 'Veggie Burger', quantity: 1 }, { name: 'Onion Rings', quantity: 1 }],
    total: 18.98, deliveryAddress: '321 College Rd', status: 'ready',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(), elapsedMinutes: 40,
  },
  {
    id: '5', orderNumber: 'ORD-2005', customerName: 'Emma Davis',
    items: [{ name: 'Chocolate Cake', quantity: 2 }],
    total: 15.98, deliveryAddress: '654 Park Ln', status: 'completed',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(), elapsedMinutes: 120,
  },
  {
    id: '6', orderNumber: 'ORD-2006', customerName: 'Frank Brown',
    items: [{ name: 'Spring Rolls', quantity: 1 }],
    total: 8.99, deliveryAddress: '987 Oak Dr', status: 'cancelled',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(), elapsedMinutes: 180,
  },
]

const statusTabs = [
  { key: 'new', label: 'New', count: 2 },
  { key: 'preparing', label: 'Preparing', count: 1 },
  { key: 'ready', label: 'Ready', count: 1 },
  { key: 'completed', label: 'Completed', count: 1 },
  { key: 'cancelled', label: 'Cancelled', count: 1 },
]

const tabEmptyMessages: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  new: {
    title: 'No new orders',
    description: 'When customers place orders, they will appear here.',
    icon: <ShoppingBag className="h-12 w-12" />,
  },
  preparing: {
    title: 'No orders being prepared',
    description: 'Accepted orders will show up here.',
    icon: <Package className="h-12 w-12" />,
  },
  ready: {
    title: 'No orders ready for pickup',
    description: 'Orders ready for driver pickup will appear here.',
    icon: <CheckCircle className="h-12 w-12" />,
  },
  completed: {
    title: 'No completed orders yet',
    description: 'Completed orders will appear here.',
    icon: <CheckCircle className="h-12 w-12" />,
  },
  cancelled: {
    title: 'No cancelled orders',
    description: 'Cancelled orders will appear here.',
    icon: <XCircle className="h-12 w-12" />,
  },
}

export default function ShopOrdersPage() {
  const [activeTab, setActiveTab] = useState('new')
  const [orders, setOrders] = useState<ShopOrder[]>(mockOrders)

  // Polling simulation for new orders
  useEffect(() => {
    const interval = setInterval(() => {
      // In production, this would fetch new orders from the API
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleAccept = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'preparing' } : o))
  }, [])

  const handleReject = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o))
  }, [])

  const handleMarkReady = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'ready' } : o))
  }, [])

  const filteredOrders = orders.filter((o) => o.status === activeTab)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500 mt-1">Manage incoming and ongoing orders</p>
      </div>

      <Tabs tabs={statusTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <EmptyState
              icon={tabEmptyMessages[activeTab]?.icon ?? <ShoppingBag className="h-12 w-12" />}
              title={tabEmptyMessages[activeTab]?.title ?? 'No orders'}
              description={tabEmptyMessages[activeTab]?.description ?? ''}
            />
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              onReject={handleReject}
              onMarkReady={handleMarkReady}
            />
          ))
        )}
      </div>
    </div>
  )
}
