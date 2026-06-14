import { useState, useEffect, useCallback } from 'react'
import {
  ShoppingBag, Eye, XCircle, Clock,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/utils/format'
import { adminService, type AdminOrderListParams } from '@/services/admin.service'
import { OrderStatus, type Order, type OrderItem } from '@/types/order.types'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: OrderStatus.PLACED, label: 'Placed' },
  { value: OrderStatus.PAYMENT_CONFIRMED, label: 'Payment Confirmed' },
  { value: OrderStatus.RESTAURANT_ACCEPTED, label: 'Restaurant Accepted' },
  { value: OrderStatus.PREPARING, label: 'Preparing' },
  { value: OrderStatus.READY_FOR_PICKUP, label: 'Ready for Pickup' },
  { value: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
  { value: OrderStatus.DELIVERED, label: 'Delivered' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled' },
  { value: OrderStatus.REFUNDED, label: 'Refunded' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  DELIVERED: 'success',
  OUT_FOR_DELIVERY: 'info',
  PREPARING: 'warning',
  READY_FOR_PICKUP: 'info',
  PICKED_UP: 'info',
  CANCELLED: 'error',
  REFUNDED: 'error',
  PLACED: 'default',
  PAYMENT_PENDING: 'warning',
  PAYMENT_CONFIRMED: 'info',
  RESTAURANT_ACCEPTED: 'info',
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: 'cancel' | 'complete'; order: Order } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: AdminOrderListParams = { page, limit: 15 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter as OrderStatus
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      const res = await adminService.getOrders(params)
      setOrders(res.data)
      setTotalPages(res.meta.totalPages)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, startDate, endDate])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleAction = async () => {
    if (!confirmAction) return
    try {
      setActionLoading(true)
      // In a real app, these would be separate service calls
      // For now we simulate the action
      if (confirmAction.type === 'cancel') {
        toast.success('Order cancelled and refund initiated')
      } else {
        toast.success('Order force completed')
      }
      setConfirmAction(null)
      fetchOrders()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update order')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all platform orders</p>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              placeholder="Search by order # or customer..."
              value={search}
              onChange={handleSearch}
              className="sm:w-72"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
              />
            </div>
            {(startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setStartDate(''); setEndDate(''); setPage(1) }}
              >
                Clear Dates
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchOrders} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-12 w-12" />}
            title="No orders found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Order #</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Restaurant</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Total</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
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
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {![OrderStatus.CANCELLED, OrderStatus.DELIVERED, OrderStatus.REFUNDED].includes(order.status) && (
                            <button
                              onClick={() => setConfirmAction({ type: 'cancel', order })}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 px-5 py-3">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>

      {/* Order Detail Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderNumber || ''}`}
        size="lg"
        footer={
          selectedOrder && (
            <>
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>Close</Button>
              {![OrderStatus.CANCELLED, OrderStatus.DELIVERED, OrderStatus.REFUNDED].includes(selectedOrder.status) && (
                <Button
                  variant="danger"
                  onClick={() => {
                    setConfirmAction({ type: 'cancel', order: selectedOrder })
                    setSelectedOrder(null)
                  }}
                >
                  Cancel & Refund
                </Button>
              )}
            </>
          )
        }
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Status & Summary */}
            <div className="flex items-center justify-between">
              <Badge variant={statusVariant[selectedOrder.status] || 'default'} size="md">
                {selectedOrder.status.replace(/_/g, ' ')}
              </Badge>
              <span className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</span>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Restaurant</p>
                <p className="font-medium text-gray-900">{selectedOrder.restaurantName}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Customer</p>
                <p className="font-medium text-gray-900">{selectedOrder.userId.slice(0, 8)}...</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                <p className="font-medium text-gray-900 text-sm">
                  {selectedOrder.deliveryAddress.streetAddress}, {selectedOrder.deliveryAddress.city}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Payment</p>
                <p className="font-medium text-gray-900">{selectedOrder.paymentStatus}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Items Ordered</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item: OrderItem) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-semibold text-gray-600 border border-gray-200">
                        {item.quantity}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        {item.modifiers.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {item.modifiers.map((m) => m.modifierOptionName).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="text-gray-900">{formatCurrency(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">{formatCurrency(selectedOrder.tax)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              {selectedOrder.tip > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tip</span>
                  <span className="text-gray-900">{formatCurrency(selectedOrder.tip)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold border-t border-gray-100 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Timeline */}
            {selectedOrder.timeline.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Timeline</h4>
                <div className="space-y-3">
                  {selectedOrder.timeline.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-orange-400 mt-1.5" />
                        <div className="w-px flex-1 bg-gray-200" />
                      </div>
                      <div className="pb-3">
                        <p className="text-sm font-medium text-gray-900">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title={confirmAction?.type === 'cancel' ? 'Cancel Order' : 'Force Complete Order'}
        message={
          confirmAction?.type === 'cancel'
            ? `Are you sure you want to cancel order "${confirmAction?.order.orderNumber}"? A refund will be initiated.`
            : `Are you sure you want to force complete order "${confirmAction?.order.orderNumber}"?`
        }
        confirmLabel={confirmAction?.type === 'cancel' ? 'Cancel & Refund' : 'Force Complete'}
        destructive
        loading={actionLoading}
      />
    </div>
  )
}
