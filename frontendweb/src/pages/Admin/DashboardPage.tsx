import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign, ShoppingCart, Users, Car, TrendingUp, TrendingDown,
  Store, Wallet, Ticket, ArrowRight, Clock,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency, formatDate } from '@/utils/format'
import { adminService, type DashboardStats } from '@/services/admin.service'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import LoadingState from '@/components/ui/LoadingState'
import ErrorState from '@/components/ui/ErrorState'


const statCards = [
  { key: 'revenue', label: 'Total Revenue', icon: DollarSign, color: 'from-green-400 to-emerald-500', shadowColor: 'shadow-green-200/50' },
  { key: 'orders', label: 'Total Orders', icon: ShoppingCart, color: 'from-blue-400 to-indigo-500', shadowColor: 'shadow-blue-200/50' },
  { key: 'users', label: 'Active Users', icon: Users, color: 'from-purple-400 to-violet-500', shadowColor: 'shadow-purple-200/50' },
  { key: 'drivers', label: 'Active Drivers', icon: Car, color: 'from-orange-400 to-red-500', shadowColor: 'shadow-orange-200/50' },
] as const

const quickActions = [
  { label: 'Manage Restaurants', to: '/admin/vendors', icon: Store, color: 'bg-blue-50 text-blue-600' },
  { label: 'Manage Drivers', to: '/admin/drivers', icon: Car, color: 'bg-orange-50 text-orange-600' },
  { label: 'View Payouts', to: '/admin/payments', icon: Wallet, color: 'bg-green-50 text-green-600' },
  { label: 'Create Coupon', to: '/admin/promotions', icon: Ticket, color: 'bg-purple-50 text-purple-600' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  DELIVERED: 'success',
  OUT_FOR_DELIVERY: 'info',
  PREPARING: 'warning',
  CANCELLED: 'error',
  REFUNDED: 'error',
  PLACED: 'default',
  PAYMENT_PENDING: 'warning',
  PAYMENT_CONFIRMED: 'info',
  RESTAURANT_ACCEPTED: 'info',
  READY_FOR_PICKUP: 'info',
  PICKED_UP: 'info',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) return <LoadingState message="Loading dashboard..." />
  if (error) return <ErrorState message={error} onRetry={fetchStats} />
  if (!stats) return null

  const values: Record<string, number> = {
    revenue: stats.totalRevenue,
    orders: stats.totalOrders,
    users: stats.totalUsers,
    drivers: stats.activeDrivers,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your platform performance</p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchStats}>
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          const value = values[card.key]
          const change = card.key === 'revenue' ? 12.5 : card.key === 'orders' ? 8.2 : card.key === 'users' ? 5.7 : -2.1
          const isPositive = change >= 0
          return (
            <Card key={card.key} className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.key === 'revenue' ? formatCurrency(value ?? 0) : (value ?? 0).toLocaleString()}
                  </p>
                  <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', isPositive ? 'text-green-600' : 'text-red-500')}>
                    {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {Math.abs(change)}%
                    <span className="text-gray-400 font-normal">vs last month</span>
                  </div>
                </div>
                <div className={cn('p-2.5 rounded-xl bg-gradient-to-br text-white shadow-lg', card.color, card.shadowColor)}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-10 w-10 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-green-600 font-medium">Revenue Chart</p>
              <p className="text-xs text-green-400 mt-1">30-day trend</p>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Volume</h3>
          <div className="h-64 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-10 w-10 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-blue-600 font-medium">Order Volume Chart</p>
              <p className="text-xs text-blue-400 mt-1">Daily orders breakdown</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className={cn('p-2 rounded-lg', action.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                <ArrowRight className="h-4 w-4 text-gray-300 ml-auto group-hover:text-gray-500 transition-colors" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <Card padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Order #</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Restaurant</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Total</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders.slice(0, 10).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="px-5 py-3 text-gray-600">{order.restaurantName}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={statusVariant[order.status] || 'default'} dot>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
