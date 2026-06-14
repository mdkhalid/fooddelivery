import { useState } from 'react'
import {
  ShoppingBag, Eye,
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/utils/format'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import EmptyState from '@/components/ui/EmptyState'
import Tabs from '@/components/ui/Tabs'
import { OrderStatus } from '@/types/order.types'

interface OrderRow {
  id: string
  orderNumber: string
  branchName: string
  customerName: string
  items: string
  itemCount: number
  total: number
  status: OrderStatus
  createdAt: string
}

const mockOrders: OrderRow[] = [
  { id: '1', orderNumber: 'ORD-1001', branchName: 'Downtown Main', customerName: 'Alice Johnson', items: 'Grilled Chicken, Spring Rolls', itemCount: 3, total: 28.98, status: OrderStatus.DELIVERED, createdAt: '2026-06-15T10:30:00Z' },
  { id: '2', orderNumber: 'ORD-1002', branchName: 'Westside Plaza', customerName: 'Bob Smith', items: 'Pasta Carbonara, Garlic Bread', itemCount: 2, total: 20.98, status: OrderStatus.PREPARING, createdAt: '2026-06-15T11:15:00Z' },
  { id: '3', orderNumber: 'ORD-1003', branchName: 'Downtown Main', customerName: 'Carol White', items: 'Chocolate Cake x2', itemCount: 2, total: 15.98, status: OrderStatus.PLACED, createdAt: '2026-06-15T11:45:00Z' },
  { id: '4', orderNumber: 'ORD-1004', branchName: 'University District', customerName: 'David Lee', items: 'Grilled Chicken, Veggie Burger', itemCount: 2, total: 29.98, status: OrderStatus.READY_FOR_PICKUP, createdAt: '2026-06-15T12:00:00Z' },
  { id: '5', orderNumber: 'ORD-1005', branchName: 'Downtown Main', customerName: 'Emma Davis', items: 'Spring Rolls x3', itemCount: 3, total: 26.97, status: OrderStatus.CANCELLED, createdAt: '2026-06-15T12:30:00Z' },
  { id: '6', orderNumber: 'ORD-1006', branchName: 'Westside Plaza', customerName: 'Frank Brown', items: 'Pasta Carbonara', itemCount: 1, total: 14.99, status: OrderStatus.DELIVERED, createdAt: '2026-06-15T09:00:00Z' },
  { id: '7', orderNumber: 'ORD-1007', branchName: 'University District', customerName: 'Grace Kim', items: 'Garlic Bread, Chocolate Cake', itemCount: 2, total: 13.98, status: OrderStatus.PREPARING, createdAt: '2026-06-15T13:00:00Z' },
]

const branchOptions = [
  { value: '', label: 'All Branches' },
  { value: 'Downtown Main', label: 'Downtown Main' },
  { value: 'Westside Plaza', label: 'Westside Plaza' },
  { value: 'University District', label: 'University District' },
  { value: 'Eastgate Mall', label: 'Eastgate Mall' },
]

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active', count: 3 },
  { key: 'completed', label: 'Completed', count: 2 },
  { key: 'cancelled', label: 'Cancelled', count: 1 },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  [OrderStatus.PLACED]: 'info',
  [OrderStatus.PREPARING]: 'warning',
  [OrderStatus.READY_FOR_PICKUP]: 'success',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'error',
  [OrderStatus.OUT_FOR_DELIVERY]: 'info',
}

function getStatusLabel(status: OrderStatus): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function VendorOrdersPage() {
  const [branchFilter, setBranchFilter] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(1)

  const filteredOrders = mockOrders.filter((order) => {
    if (branchFilter && order.branchName !== branchFilter) return false
    if (activeTab === 'active') {
      return [OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP, OrderStatus.OUT_FOR_DELIVERY].includes(order.status)
    }
    if (activeTab === 'completed') return order.status === OrderStatus.DELIVERED
    if (activeTab === 'cancelled') return order.status === OrderStatus.CANCELLED
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">View orders across all branches</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <Select
            options={branchOptions}
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            placeholder="Filter by branch"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs tabs={statusTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" />}
          title="No orders found"
          description="No orders match the current filters."
        />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Order #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Branch</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-gray-600">{order.branchName}</td>
                    <td className="py-3 px-4 text-gray-600">{order.customerName}</td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell max-w-[200px] truncate">
                      {order.items} ({order.itemCount})
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[order.status] ?? 'default'} dot>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden lg:table-cell">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 py-4">
            <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
          </div>
        </Card>
      )}
    </div>
  )
}
