import { useState } from 'react'
import { DollarSign, TrendingUp, Wallet, ShoppingBag, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/format'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' },
]

const earningsStats = {
  today: { total: 420.50, commission: 63.08, net: 357.42, orders: 24 },
  week: { total: 2840.00, commission: 426.00, net: 2414.00, orders: 168 },
  month: { total: 12450.00, commission: 1867.50, net: 10582.50, orders: 742 },
}

const payoutHistory = [
  { id: '1', date: '2026-06-01', amount: 10582.50, status: 'processed' },
  { id: '2', date: '2026-05-01', amount: 9840.00, status: 'processed' },
  { id: '3', date: '2026-04-01', amount: 8920.00, status: 'processed' },
  { id: '4', date: '2026-03-01', amount: 7650.00, status: 'processed' },
  { id: '5', date: '2026-02-01', amount: 6200.00, status: 'processed' },
]

const payoutStatusVariant: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  processed: 'success',
  pending: 'warning',
  failed: 'error',
}

export default function ShopEarningsPage() {
  const [period, setPeriod] = useState('month')
  const [page, setPage] = useState(1)

  const stats = earningsStats[period as keyof typeof earningsStats] ?? earningsStats.month

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Earnings</h2>
          <p className="text-sm text-gray-500 mt-1">Track your revenue and payouts</p>
        </div>
        <Select
          options={periodOptions}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-44"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.total)}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Platform Commission</p>
              <p className="text-2xl font-bold text-red-600 mt-1">-{formatCurrency(stats.commission)}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-50">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Payout</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.net)}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Order Count</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.orders}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* First Payout Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">First payout pending</p>
            <p className="text-sm text-amber-600">Payouts are processed on the 1st of each month. Your first payout will be available after the end of your first billing cycle.</p>
          </div>
        </div>
      </Card>

      {/* Payout History */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Payout History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">{formatDate(payout.date)}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(payout.amount)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={payoutStatusVariant[payout.status]} dot>
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 py-4">
          <Pagination currentPage={page} totalPages={2} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  )
}
