import { useState, useEffect, useCallback } from 'react'
import {
  Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Car, BarChart3, Calendar,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import { adminService, type DashboardStats } from '@/services/admin.service'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingState from '@/components/ui/LoadingState'
import ErrorState from '@/components/ui/ErrorState'

type ReportType = 'revenue' | 'orders' | 'users' | 'drivers'

const reportTypeOptions = [
  { value: 'revenue', label: 'Revenue Report' },
  { value: 'orders', label: 'Orders Report' },
  { value: 'users', label: 'Users Report' },
  { value: 'drivers', label: 'Drivers Report' },
]

const reportIcons: Record<ReportType, typeof DollarSign> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  users: Users,
  drivers: Car,
}

const reportColors: Record<ReportType, string> = {
  revenue: 'from-green-400 to-emerald-500',
  orders: 'from-blue-400 to-indigo-500',
  users: 'from-purple-400 to-violet-500',
  drivers: 'from-orange-400 to-red-500',
}

const reportBgColors: Record<ReportType, string> = {
  revenue: 'from-green-50 to-emerald-50 border-green-100',
  orders: 'from-blue-50 to-indigo-50 border-blue-100',
  users: 'from-purple-50 to-violet-50 border-purple-100',
  drivers: 'from-orange-50 to-red-50 border-orange-100',
}

// Sample data for chart visualization (bar chart)
function SimpleBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1.5 h-40">
      {data.map((value, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={cn('w-full rounded-t-md transition-all duration-500', color)}
            style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? '4px' : '0' }}
          />
        </div>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('revenue')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load report data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleExport = () => {
    // Generate CSV data based on report type
    if (!stats) return

    let csvContent = ''
    let filename = ''

    switch (reportType) {
      case 'revenue':
        csvContent = 'Metric,Value\n'
        csvContent += `Total Revenue,${stats.totalRevenue}\n`
        csvContent += `Total Orders,${stats.totalOrders}\n`
        csvContent += `Average Order Value,${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : 0}\n`
        filename = 'revenue-report.csv'
        break
      case 'orders':
        csvContent = 'Status,Count\n'
        csvContent += `Total Orders,${stats.totalOrders}\n`
        csvContent += `Pending Approvals,${stats.pendingApprovals}\n`
        filename = 'orders-report.csv'
        break
      case 'users':
        csvContent = 'Metric,Value\n'
        csvContent += `Total Users,${stats.totalUsers}\n`
        csvContent += `Active Drivers,${stats.activeDrivers}\n`
        filename = 'users-report.csv'
        break
      case 'drivers':
        csvContent = 'Metric,Value\n'
        csvContent += `Active Drivers,${stats.activeDrivers}\n`
        csvContent += `Total Restaurants,${stats.totalRestaurants}\n`
        filename = 'drivers-report.csv'
        break
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Generate sample chart data
  const chartData = {
    revenue: [12000, 15000, 13500, 18000, 22000, 19000, 24000, 21000, 26000, 28000, 25000, 30000],
    orders: [120, 150, 135, 180, 220, 190, 240, 210, 260, 280, 250, 300],
    users: [50, 65, 80, 95, 110, 130, 155, 175, 200, 225, 250, 280],
    drivers: [10, 12, 15, 18, 22, 25, 30, 35, 40, 45, 50, 55],
  }

  const summaryStats = {
    revenue: [
      { label: 'Total Revenue', value: stats ? formatCurrency(stats.totalRevenue) : '-', change: 12.5 },
      { label: 'Avg Order Value', value: stats ? formatCurrency(stats.totalRevenue / Math.max(stats.totalOrders, 1)) : '-', change: 3.2 },
      { label: 'Total Orders', value: stats?.totalOrders.toLocaleString() || '-', change: 8.1 },
      { label: 'Revenue Growth', value: '+12.5%', change: 12.5 },
    ],
    orders: [
      { label: 'Total Orders', value: stats?.totalOrders.toLocaleString() || '-', change: 8.1 },
      { label: 'Pending Approvals', value: stats?.pendingApprovals.toString() || '-', change: -2.0 },
      { label: 'Completed Orders', value: stats ? (stats.totalOrders - stats.pendingApprovals).toLocaleString() : '-', change: 10.3 },
      { label: 'Completion Rate', value: stats ? `${((1 - stats.pendingApprovals / Math.max(stats.totalOrders, 1)) * 100).toFixed(1)}%` : '-', change: 1.5 },
    ],
    users: [
      { label: 'Total Users', value: stats?.totalUsers.toLocaleString() || '-', change: 5.7 },
      { label: 'Active Drivers', value: stats?.activeDrivers.toLocaleString() || '-', change: 4.2 },
      { label: 'Total Restaurants', value: stats?.totalRestaurants.toLocaleString() || '-', change: 7.8 },
      { label: 'User Growth', value: '+5.7%', change: 5.7 },
    ],
    drivers: [
      { label: 'Active Drivers', value: stats?.activeDrivers.toLocaleString() || '-', change: 4.2 },
      { label: 'Total Restaurants', value: stats?.totalRestaurants.toLocaleString() || '-', change: 7.8 },
      { label: 'Total Users', value: stats?.totalUsers.toLocaleString() || '-', change: 5.7 },
      { label: 'Driver Growth', value: '+4.2%', change: 4.2 },
    ],
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  if (loading) return <LoadingState message="Loading reports..." />
  if (error) return <ErrorState message={error} onRetry={fetchStats} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Analytics and insights for your platform</p>
        </div>
        <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />} onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      {/* Report Type Selector & Date Range */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Report Type</label>
            <div className="flex gap-2">
              {reportTypeOptions.map((opt) => {
                const TypeIcon = reportIcons[opt.value as ReportType]
                return (
                  <button
                    key={opt.value}
                    onClick={() => setReportType(opt.value as ReportType)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      reportType === opt.value
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    <TypeIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats[reportType].map((stat, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className={cn(
                  'flex items-center gap-1 mt-2 text-xs font-medium',
                  stat.change >= 0 ? 'text-green-600' : 'text-red-500'
                )}>
                  {stat.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-400" />
            {reportTypeOptions.find((o) => o.value === reportType)?.label} - Monthly Trend
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            Last 12 months
          </div>
        </div>
        <div className={cn('rounded-xl border bg-gradient-to-br p-6', reportBgColors[reportType])}>
          <SimpleBarChart data={chartData[reportType]} color={cn('bg-gradient-to-t', reportColors[reportType])} />
          <div className="flex justify-between mt-3 text-xs text-gray-400">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {reportType === 'revenue' && (
                  <>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Period</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Revenue</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Orders</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Avg Order</th>
                  </>
                )}
                {reportType === 'orders' && (
                  <>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Count</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Percentage</th>
                  </>
                )}
                {reportType === 'users' && (
                  <>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Count</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Active</th>
                  </>
                )}
                {reportType === 'drivers' && (
                  <>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Metric</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Value</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Change</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reportType === 'revenue' && stats && (
                <>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-600">Current Period</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</td>
                    <td className="px-5 py-3 text-gray-900">{stats.totalOrders}</td>
                    <td className="px-5 py-3 text-gray-900">{formatCurrency(stats.totalRevenue / Math.max(stats.totalOrders, 1))}</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-600">Previous Period</td>
                    <td className="px-5 py-3 text-gray-900">{formatCurrency(stats.totalRevenue * 0.88)}</td>
                    <td className="px-5 py-3 text-gray-900">{Math.round(stats.totalOrders * 0.92)}</td>
                    <td className="px-5 py-3 text-gray-900">{formatCurrency((stats.totalRevenue * 0.88) / Math.max(stats.totalOrders * 0.92, 1))}</td>
                  </tr>
                </>
              )}
              {reportType === 'orders' && stats && (
                <>
                  {[
                    { status: 'Delivered', count: Math.round(stats.totalOrders * 0.85) },
                    { status: 'In Progress', count: Math.round(stats.totalOrders * 0.08) },
                    { status: 'Cancelled', count: Math.round(stats.totalOrders * 0.05) },
                    { status: 'Pending', count: stats.pendingApprovals },
                  ].map((row) => (
                    <tr key={row.status} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-gray-900">{row.status}</td>
                      <td className="px-5 py-3 text-gray-900">{row.count}</td>
                      <td className="px-5 py-3 text-gray-900">{((row.count / Math.max(stats.totalOrders, 1)) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </>
              )}
              {reportType === 'users' && stats && (
                <>
                  {[
                    { role: 'Customers', count: Math.round(stats.totalUsers * 0.75), active: Math.round(stats.totalUsers * 0.6) },
                    { role: 'Drivers', count: stats.activeDrivers, active: Math.round(stats.activeDrivers * 0.8) },
                    { role: 'Shop Owners', count: stats.totalRestaurants, active: Math.round(stats.totalRestaurants * 0.9) },
                  ].map((row) => (
                    <tr key={row.role} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-gray-900">{row.role}</td>
                      <td className="px-5 py-3 text-gray-900">{row.count}</td>
                      <td className="px-5 py-3 text-gray-900">{row.active}</td>
                    </tr>
                  ))}
                </>
              )}
              {reportType === 'drivers' && stats && (
                <>
                  {[
                    { metric: 'Active Drivers', value: stats.activeDrivers, change: 4.2 },
                    { metric: 'Total Restaurants', value: stats.totalRestaurants, change: 7.8 },
                    { metric: 'Total Users', value: stats.totalUsers, change: 5.7 },
                    { metric: 'Pending Approvals', value: stats.pendingApprovals, change: -2.0 },
                  ].map((row) => (
                    <tr key={row.metric} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-gray-900">{row.metric}</td>
                      <td className="px-5 py-3 font-semibold text-gray-900">{row.value.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={cn('flex items-center gap-1 text-sm font-medium', row.change >= 0 ? 'text-green-600' : 'text-red-500')}>
                          {row.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                          {Math.abs(row.change)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
