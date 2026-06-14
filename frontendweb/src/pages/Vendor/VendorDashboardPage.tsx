import { useNavigate } from 'react-router-dom'
import {
  DollarSign, ShoppingBag, GitBranch, Star, Plus, UtensilsCrossed,
  ArrowRight, BarChart3,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency, formatRating } from '@/utils/format'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const stats = [
  {
    label: 'Total Revenue',
    value: '$12,450',
    change: '+12.5%',
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'Total Orders',
    value: '328',
    change: '+8.2%',
    icon: ShoppingBag,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Active Branches',
    value: '5',
    change: '+1',
    icon: GitBranch,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Average Rating',
    value: '4.6',
    change: '+0.2',
    icon: Star,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

const branchPerformance = [
  { name: 'Downtown Main', todayOrders: 45, todayRevenue: 1250, rating: 4.8, status: 'open' },
  { name: 'Westside Plaza', todayOrders: 32, todayRevenue: 890, rating: 4.5, status: 'open' },
  { name: 'Eastgate Mall', todayOrders: 28, todayRevenue: 760, rating: 4.3, status: 'closed' },
  { name: 'University District', todayOrders: 38, todayRevenue: 1020, rating: 4.7, status: 'open' },
  { name: 'Airport Terminal', todayOrders: 15, todayRevenue: 430, rating: 4.1, status: 'closed' },
]

export default function VendorDashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">{stat.change}</p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bg)}>
                  <Icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <p className="text-sm text-gray-500">Last 7 days performance</p>
          </div>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-48 flex items-end gap-2 px-2">
          {[65, 45, 80, 55, 70, 90, 75].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-orange-500 to-red-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-red-500"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-400">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Branch Performance Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Branch Performance</h3>
            <p className="text-sm text-gray-500">Today's overview across all branches</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/vendor/branches')}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Branch</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {branchPerformance.map((branch) => (
                <tr key={branch.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{branch.name}</td>
                  <td className="py-3 px-4 text-gray-600">{branch.todayOrders}</td>
                  <td className="py-3 px-4 text-gray-600">{formatCurrency(branch.todayRevenue)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-gray-700">{formatRating(branch.rating)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={branch.status === 'open' ? 'success' : 'default'} dot>
                      {branch.status === 'open' ? 'Open' : 'Closed'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          hover
          clickable
          onClick={() => navigate('/vendor/branches')}
          className="flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-blue-50">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Add Branch</p>
            <p className="text-xs text-gray-500">Open a new location</p>
          </div>
        </Card>
        <Card
          hover
          clickable
          onClick={() => navigate('/vendor/menu')}
          className="flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-purple-50">
            <UtensilsCrossed className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Manage Menu</p>
            <p className="text-xs text-gray-500">Edit shared menu items</p>
          </div>
        </Card>
        <Card
          hover
          clickable
          onClick={() => navigate('/vendor/orders')}
          className="flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-green-50">
            <ShoppingBag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">View Orders</p>
            <p className="text-xs text-gray-500">All orders across branches</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
