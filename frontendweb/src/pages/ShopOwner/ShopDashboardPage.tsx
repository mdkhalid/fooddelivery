import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag, DollarSign, Clock, Star, UtensilsCrossed,
  Wallet, Power, CheckCircle, Circle, ArrowRight, Sparkles,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'

const todayStats = [
  { label: 'Orders Received', value: '24', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Revenue', value: '$1,280', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Pending Orders', value: '5', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Rating', value: '4.7', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
]

const recentOrders = [
  { id: '1', customer: 'Alice J.', items: '2x Grilled Chicken, 1x Fries', total: 24.98, time: '5 min ago', status: 'new' as const },
  { id: '2', customer: 'Bob S.', items: '1x Pasta, 1x Garlic Bread', total: 19.98, time: '12 min ago', status: 'new' as const },
  { id: '3', customer: 'Carol W.', items: '3x Spring Rolls', total: 26.97, time: '25 min ago', status: 'preparing' as const },
  { id: '4', customer: 'David L.', items: '1x Veggie Burger', total: 12.99, time: '40 min ago', status: 'preparing' as const },
  { id: '5', customer: 'Emma D.', items: '1x Chocolate Cake', total: 7.99, time: '1 hr ago', status: 'completed' as const },
]

const onboardingSteps = [
  { label: 'Add menu items', done: true },
  { label: 'Set operating hours', done: true },
  { label: 'Set delivery zone', done: false },
  { label: 'Go live!', done: false },
]

export default function ShopDashboardPage() {
  const navigate = useNavigate()
  const completedSteps = onboardingSteps.filter((s) => s.done).length
  const isOnboardingComplete = completedSteps === onboardingSteps.length

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl font-bold">Welcome back, Tasty Bites!</h2>
        </div>
        <p className="text-white/80">Here's what's happening with your restaurant today.</p>
      </div>

      {/* Onboarding Checklist */}
      {!isOnboardingComplete && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-orange-50">
              <Sparkles className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Complete Your Setup</h3>
              <p className="text-sm text-gray-500">{completedSteps}/{onboardingSteps.length} steps completed</p>
            </div>
          </div>
          <div className="space-y-2">
            {onboardingSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                )}
                <span className={cn('text-sm', step.done ? 'text-gray-500 line-through' : 'text-gray-900 font-medium')}>
                  {step.label}
                </span>
                {!step.done && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => {
                      if (step.label.includes('hours')) navigate('/shop/settings')
                      else if (step.label.includes('zone')) navigate('/shop/settings')
                      else if (step.label.includes('menu')) navigate('/shop/menu')
                    }}
                  >
                    Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                style={{ width: `${(completedSteps / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Today's Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {todayStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bg)}>
                  <Icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover clickable onClick={() => navigate('/shop/menu')} className="flex flex-col items-center gap-3 py-6">
          <div className="p-3 rounded-xl bg-purple-50">
            <UtensilsCrossed className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Manage Menu</span>
        </Card>
        <Card hover clickable onClick={() => navigate('/shop/orders')} className="flex flex-col items-center gap-3 py-6">
          <div className="p-3 rounded-xl bg-blue-50">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">View Orders</span>
        </Card>
        <Card hover clickable onClick={() => navigate('/shop/earnings')} className="flex flex-col items-center gap-3 py-6">
          <div className="p-3 rounded-xl bg-green-50">
            <Wallet className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">View Earnings</span>
        </Card>
        <Card hover clickable onClick={() => navigate('/shop/settings')} className="flex flex-col items-center gap-3 py-6">
          <div className="p-3 rounded-xl bg-amber-50">
            <Power className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Open / Closed</span>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card padding="none">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/shop/orders')}
          >
            View All
          </Button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
              <Avatar name={order.customer} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 text-sm">{order.customer}</p>
                  <Badge
                    variant={order.status === 'new' ? 'error' : order.status === 'preparing' ? 'warning' : 'success'}
                    size="sm"
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{order.items}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium text-gray-900 text-sm">{formatCurrency(order.total)}</p>
                <p className="text-xs text-gray-400">{order.time}</p>
              </div>
              {order.status === 'new' && (
                <div className="flex gap-1">
                  <Button variant="success" size="sm">Accept</Button>
                  <Button variant="danger" size="sm">Reject</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
