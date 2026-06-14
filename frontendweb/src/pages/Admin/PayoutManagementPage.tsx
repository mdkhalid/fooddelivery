import { useState, useEffect, useCallback } from 'react'
import {
  Wallet, CheckCircle, Clock, DollarSign,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/utils/format'
import { adminService, type Payout } from '@/services/admin.service'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'

const statusFilterOptions = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSED', label: 'Processed' },
  { value: 'FAILED', label: 'Failed' },
]

const payoutStatusBadge: Record<string, { variant: 'success' | 'error' | 'warning' | 'info' | 'default'; label: string }> = {
  PENDING: { variant: 'warning', label: 'Pending' },
  PROCESSED: { variant: 'success', label: 'Processed' },
  FAILED: { variant: 'error', label: 'Failed' },
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
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

export default function PayoutManagementPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [confirmPayout, setConfirmPayout] = useState<Payout | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: { page: number; limit: number; status?: string } = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      const res = await adminService.getPayouts(params)
      setPayouts(res.data)
      setTotalPages(res.meta.totalPages)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load payouts')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchPayouts()
  }, [fetchPayouts])

  const handleProcessPayout = async () => {
    if (!confirmPayout) return
    try {
      setActionLoading(true)
      await adminService.processPayout(confirmPayout.id)
      setPayouts((prev) =>
        prev.map((p) =>
          p.id === confirmPayout.id
            ? { ...p, status: 'PROCESSED' as const, processedAt: new Date().toISOString() }
            : p
        )
      )
      toast.success('Payout processed successfully')
      setConfirmPayout(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to process payout')
    } finally {
      setActionLoading(false)
    }
  }

  // Compute summary stats
  const pendingPayouts = payouts.filter((p) => p.status === 'PENDING')
  const processedPayouts = payouts.filter((p) => p.status === 'PROCESSED')
  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.amount, 0)
  const totalProcessed = processedPayouts.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
        <p className="text-sm text-gray-500 mt-1">Process and manage driver payouts</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-gray-400 mt-1">{pendingPayouts.length} requests</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Processed This Period</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalProcessed)}</p>
              <p className="text-xs text-gray-400 mt-1">{processedPayouts.length} completed</p>
            </div>
            <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{payouts.length}</p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          />
        </div>
      </Card>

      {/* Pending Payouts Highlight */}
      {!loading && pendingPayouts.length > 0 && statusFilter === '' && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Pending Payout Requests ({pendingPayouts.length})
          </h3>
          <div className="space-y-2">
            {pendingPayouts.slice(0, 5).map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payout.driverName}</p>
                    <p className="text-xs text-gray-500">Requested {formatDate(payout.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{formatCurrency(payout.amount)}</span>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => setConfirmPayout(payout)}
                  >
                    Process
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchPayouts} />
        ) : payouts.length === 0 ? (
          <EmptyState
            icon={<Wallet className="h-12 w-12" />}
            title="No payouts found"
            description={statusFilter ? 'No payouts match the selected filter' : 'No payout requests yet'}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Driver</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Amount</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Period</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Requested</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Processed</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payouts.map((payout) => {
                    const st = payoutStatusBadge[payout.status] ?? { variant: 'warning' as const, label: 'Pending' }
                    return (
                      <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-semibold">
                              {payout.driverName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{payout.driverName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-900">{formatCurrency(payout.amount)}</td>
                        <td className="px-5 py-3 text-gray-600">{payout.period}</td>
                        <td className="px-5 py-3 text-gray-500">{formatDate(payout.createdAt)}</td>
                        <td className="px-5 py-3 text-gray-500">{payout.processedAt ? formatDate(payout.processedAt) : '-'}</td>
                        <td className="px-5 py-3">
                          <Badge variant={st.variant} dot>{st.label}</Badge>
                        </td>
                        <td className="px-5 py-3 text-right">
                          {payout.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => setConfirmPayout(payout)}
                            >
                              Process
                            </Button>
                          )}
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

      {/* Process Confirmation Modal */}
      <Modal
        open={!!confirmPayout}
        onClose={() => setConfirmPayout(null)}
        title="Process Payout"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmPayout(null)} disabled={actionLoading}>Cancel</Button>
            <Button variant="success" loading={actionLoading} onClick={handleProcessPayout}>
              Confirm Payment
            </Button>
          </>
        }
      >
        {confirmPayout && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Processing payout for</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{confirmPayout.driverName}</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(confirmPayout.amount)}</p>
              <p className="text-sm text-gray-400 mt-2">Period: {confirmPayout.period}</p>
            </div>
            <p className="text-sm text-gray-500 text-center">
              This will mark the payout as processed and transfer funds to the driver.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
