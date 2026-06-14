import { useState, useEffect, useCallback } from 'react'
import {
  Store, Star, ShoppingBag, Check, Eye, Ban, Clock,
} from 'lucide-react'
import { formatDate, formatRating } from '@/utils/format'
import { adminService, type AdminRestaurantListParams } from '@/services/admin.service'
import type { Restaurant } from '@/types/restaurant.types'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending Approval' },
]

const statusBadge: Record<string, { variant: 'success' | 'error' | 'warning'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'error', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-12 w-12 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default function RestaurantManagementPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; restaurant: Restaurant } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: AdminRestaurantListParams = { page, limit: 15 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter as 'active' | 'inactive' | 'pending'
      const res = await adminService.getRestaurants(params)
      setRestaurants(res.data)
      setTotalPages(res.meta.totalPages)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleApproval = async () => {
    if (!confirmAction) return
    try {
      setActionLoading(true)
      await adminService.updateRestaurantApproval(
        confirmAction.restaurant.id,
        confirmAction.type === 'approve'
      )
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === confirmAction.restaurant.id
            ? { ...r, isActive: confirmAction.type === 'approve' }
            : r
        )
      )
      toast.success(`Restaurant ${confirmAction.type === 'approve' ? 'approved' : 'rejected'} successfully`)
      setConfirmAction(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update restaurant')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and approve restaurant listings</p>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder="Search restaurants..."
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
      </Card>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchRestaurants} />
        ) : restaurants.length === 0 ? (
          <EmptyState
            icon={<Store className="h-12 w-12" />}
            title="No restaurants found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Restaurant</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Owner</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Rating</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Created</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {restaurants.map((restaurant) => {
                    const st = statusBadge[restaurant.isActive ? 'active' : 'pending'] ?? { variant: 'warning' as const, label: 'Pending' }
                    return (
                      <tr
                        key={restaurant.id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedRestaurant(restaurant)}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                              <ImageWithFallback
                                src={restaurant.logoUrl ?? ''}
                                alt={restaurant.name}
                                className="h-full w-full object-cover"
                                fallbackSrc=""
                              />
                            </div>
                            <span className="font-medium text-gray-900">{restaurant.name}</span>
                          </div>
                        </td>
                          <td className="px-5 py-3 text-gray-600">{(restaurant.vendorId ?? '').slice(0, 8)}...</td>
                        <td className="px-5 py-3">
                          <Badge variant={st.variant} dot>{st.label}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1 text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{formatRating(restaurant.rating.average)}</span>
                            <span className="text-gray-400 text-xs">({restaurant.rating.totalReviews})</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-500">{formatDate(restaurant.createdAt)}</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedRestaurant(restaurant)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {!restaurant.isActive && (
                              <button
                                onClick={() => setConfirmAction({ type: 'approve', restaurant })}
                                className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setConfirmAction({ type: 'reject', restaurant })}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 px-5 py-3">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>

      {/* Restaurant Detail Modal */}
      <Modal
        open={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        title="Restaurant Details"
        size="lg"
        footer={
          selectedRestaurant && (
            <>
              <Button variant="ghost" onClick={() => setSelectedRestaurant(null)}>Close</Button>
              {!selectedRestaurant.isActive && (
                <Button
                  variant="success"
                  loading={actionLoading}
                  onClick={() => {
                    setConfirmAction({ type: 'approve', restaurant: selectedRestaurant })
                    setSelectedRestaurant(null)
                  }}
                >
                  Approve
                </Button>
              )}
            </>
          )
        }
      >
        {selectedRestaurant && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <ImageWithFallback
                  src={selectedRestaurant.logoUrl ?? ''}
                  alt={selectedRestaurant.name}
                  className="h-full w-full object-cover"
                  fallbackSrc=""
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{selectedRestaurant.name}</h3>
                <p className="text-sm text-gray-500">{selectedRestaurant.address?.streetAddress ?? ''}, {selectedRestaurant.address?.city ?? ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400 mx-auto mb-1" />
                <p className="font-semibold text-gray-900">{formatRating(selectedRestaurant.rating.average)}</p>
                <p className="text-xs text-gray-500">{selectedRestaurant.rating.totalReviews} reviews</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <p className="font-semibold text-gray-900">{selectedRestaurant.estimatedDeliveryTime} min</p>
                <p className="text-xs text-gray-500">Delivery time</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <ShoppingBag className="h-5 w-5 text-green-400 mx-auto mb-1" />
                <p className="font-semibold text-gray-900">${selectedRestaurant.minimumOrderAmount}</p>
                <p className="text-xs text-gray-500">Min order</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <Store className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <p className="font-semibold text-gray-900">${selectedRestaurant.deliveryFee}</p>
                <p className="text-xs text-gray-500">Delivery fee</p>
              </div>
            </div>
            {selectedRestaurant.description && (
              <p className="text-sm text-gray-600 pt-2">{selectedRestaurant.description}</p>
            )}
          </div>
        )}
      </Modal>

      {/* Approval Confirmation */}
      <Modal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.type === 'approve' ? 'Approve Restaurant' : 'Reject Restaurant'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmAction(null)} disabled={actionLoading}>Cancel</Button>
            <Button
              variant={confirmAction?.type === 'approve' ? 'success' : 'danger'}
              loading={actionLoading}
              onClick={handleApproval}
            >
              {confirmAction?.type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {confirmAction?.type === 'approve'
            ? `Are you sure you want to approve "${confirmAction.restaurant.name}"? This will make the restaurant visible to customers.`
            : `Are you sure you want to reject "${confirmAction?.restaurant.name}"? The restaurant owner will be notified.`
          }
        </p>
      </Modal>
    </div>
  )
}
