import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, Plus, Clock } from 'lucide-react'
import Tabs from '@/components/ui/Tabs'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import UpcomingOrderCard from './components/UpcomingOrderCard'

const MOCK_UPCOMING = [
  {
    id: 'po-1',
    restaurantName: 'Pizza Palace',
    restaurantImage: '/images/pizza.jpg',
    scheduledTime: new Date(Date.now() + 3600000 * 2).toISOString(),
    items: ['Margherita Pizza', 'Garlic Bread'],
    status: 'CONFIRMED' as const,
    countdown: 7200,
  },
  {
    id: 'po-2',
    restaurantName: 'Sushi World',
    restaurantImage: '/images/sushi.jpg',
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    items: ['Dragon Roll', 'Miso Soup', 'Edamame'],
    status: 'PENDING' as const,
    countdown: 86400,
  },
]

const MOCK_PAST = [
  {
    id: 'po-3',
    restaurantName: 'Burger Joint',
    restaurantImage: '/images/burger.jpg',
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    items: ['Classic Burger', 'Fries'],
    status: 'DELIVERED' as const,
    countdown: 0,
  },
]

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
]

export default function ScheduledOrdersPage() {
  const [activeTab, setActiveTab] = useState('upcoming')

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-surface-900">Scheduled Orders</h1>
            <p className="mt-1 text-sm text-surface-500">Manage your upcoming pre-orders</p>
          </div>
          <Link to="/restaurants">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              Schedule Order
            </Button>
          </Link>
        </div>

        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {activeTab === 'upcoming' ? (
          MOCK_UPCOMING.length === 0 ? (
            <EmptyState
              icon={<CalendarClock className="h-16 w-16" />}
              title="No scheduled orders"
              description="Schedule an order in advance and it will appear here."
              action={
                <Link to="/restaurants">
                  <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                    Browse Restaurants
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {MOCK_UPCOMING.map((order) => (
                <UpcomingOrderCard key={order.id} order={order} />
              ))}
            </div>
          )
        ) : MOCK_PAST.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-16 w-16" />}
            title="No past scheduled orders"
            description="Your completed scheduled orders will appear here."
          />
        ) : (
          <div className="space-y-4">
            {MOCK_PAST.map((order) => (
              <UpcomingOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
