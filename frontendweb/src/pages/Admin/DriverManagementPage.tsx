import { useState, useEffect, useCallback } from 'react'
import {
  Car, Star, CheckCircle, XCircle, Eye, Bike, Truck,
} from 'lucide-react'
import { formatCurrency, formatPhoneNumber } from '@/utils/format'
import { adminService, type AdminDriverListParams } from '@/services/admin.service'
import type { Driver } from '@/types/driver.types'
import { DriverStatus } from '@/types/user.types'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import Avatar from '@/components/ui/Avatar'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: DriverStatus.PENDING_APPROVAL, label: 'Pending Approval' },
  { value: DriverStatus.APPROVED, label: 'Approved' },
  { value: DriverStatus.ACTIVE, label: 'Active' },
  { value: DriverStatus.INACTIVE, label: 'Inactive' },
  { value: DriverStatus.SUSPENDED, label: 'Suspended' },
]

const vehicleOptions = [
  { value: '', label: 'All Vehicles' },
  { value: 'BICYCLE', label: 'Bicycle' },
  { value: 'MOTORCYCLE', label: 'Motorcycle' },
  { value: 'CAR', label: 'Car' },
  { value: 'VAN', label: 'Van' },
  { value: 'TRUCK', label: 'Truck' },
]

const driverStatusBadge: Record<string, { variant: 'success' | 'error' | 'warning' | 'info' | 'default'; label: string }> = {
  PENDING_APPROVAL: { variant: 'warning', label: 'Pending' },
  APPROVED: { variant: 'info', label: 'Approved' },
  ACTIVE: { variant: 'success', label: 'Active' },
  INACTIVE: { variant: 'default', label: 'Inactive' },
  SUSPENDED: { variant: 'error', label: 'Suspended' },
}

const vehicleIcons: Record<string, typeof Car> = {
  BICYCLE: Bike,
  MOTORCYCLE: Car,
  CAR: Car,
  VAN: Truck,
  TRUCK: Truck,
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
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

export default function DriverManagementPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: AdminDriverListParams = { page, limit: 15 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await adminService.getDrivers(params)
      setDrivers(res.data)
      setTotalPages(res.meta.totalPages)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load drivers')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers])

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleApproval = async (driver: Driver, approved: boolean) => {
    try {
      setActionLoading(true)
      await adminService.updateDriverApproval(driver.id, approved)
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driver.id
            ? { ...d, driverStatus: approved ? DriverStatus.APPROVED : DriverStatus.SUSPENDED }
            : d
        )
      )
      setSelectedDriver((prev) =>
        prev && prev.id === driver.id
          ? { ...prev, driverStatus: approved ? DriverStatus.APPROVED : DriverStatus.SUSPENDED }
          : prev
      )
      toast.success(`Driver ${approved ? 'approved' : 'suspended'} successfully`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update driver')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage delivery drivers</p>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder="Search drivers..."
            value={search}
            onChange={handleSearch}
            className="sm:w-72"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          />
          <Select
            options={vehicleOptions}
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDrivers} />
        ) : drivers.length === 0 ? (
          <EmptyState
            icon={<Car className="h-12 w-12" />}
            title="No drivers found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Driver</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Vehicle</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Rating</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Deliveries</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {drivers
                    .filter((d) => !vehicleFilter || d.vehicleType === vehicleFilter)
                    .map((driver) => {
                    const st = driverStatusBadge[driver.driverStatus] ?? { variant: 'default' as const, label: driver.driverStatus }
                    const VehicleIcon = vehicleIcons[driver.vehicleType || ''] || Car
                    return (
                      <tr
                        key={driver.id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedDriver(driver)}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar src={driver.avatarUrl} name={`${driver.firstName} ${driver.lastName}`} size="sm" />
                            <div>
                              <span className="font-medium text-gray-900 block">{driver.firstName} {driver.lastName}</span>
                              <span className="text-xs text-gray-400">{driver.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{driver.phone ? formatPhoneNumber(driver.phone) : '-'}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <VehicleIcon className="h-4 w-4 text-gray-400" />
                            <span className="capitalize">{(driver.vehicleType || 'N/A').toLowerCase()}</span>
                            {driver.vehiclePlateNumber && (
                              <span className="text-xs text-gray-400 ml-1">({driver.vehiclePlateNumber})</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={st.variant} dot>{st.label}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1 text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{driver.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-900">{driver.totalDeliveries}</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedDriver(driver)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {driver.driverStatus === DriverStatus.PENDING_APPROVAL && (
                              <>
                                <button
                                  onClick={() => handleApproval(driver, true)}
                                  className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleApproval(driver, false)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
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

      {/* Driver Detail Modal */}
      <Modal
        open={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        title="Driver Details"
        size="md"
        footer={
          selectedDriver && (
            <>
              <Button variant="ghost" onClick={() => setSelectedDriver(null)}>Close</Button>
              {selectedDriver.driverStatus === DriverStatus.PENDING_APPROVAL && (
                <Button
                  variant="success"
                  loading={actionLoading}
                  onClick={() => {
                    handleApproval(selectedDriver, true)
                    setSelectedDriver(null)
                  }}
                >
                  Approve Driver
                </Button>
              )}
            </>
          )
        }
      >
        {selectedDriver && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar src={selectedDriver.avatarUrl} name={`${selectedDriver.firstName} ${selectedDriver.lastName}`} size="lg" />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedDriver.firstName} {selectedDriver.lastName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={driverStatusBadge[selectedDriver.driverStatus]?.variant || 'default'} dot>
                    {driverStatusBadge[selectedDriver.driverStatus]?.label || selectedDriver.driverStatus}
                  </Badge>
                  <Badge variant={selectedDriver.isAvailable ? 'success' : 'default'}>
                    {selectedDriver.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedDriver.totalDeliveries}</p>
                <p className="text-xs text-gray-500">Total Deliveries</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-2xl font-bold text-amber-600">{selectedDriver.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedDriver.totalEarnings)}</p>
                <p className="text-xs text-gray-500">Total Earnings</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-lg font-bold text-gray-900 capitalize">{(selectedDriver.vehicleType || 'N/A').toLowerCase()}</p>
                <p className="text-xs text-gray-500">{selectedDriver.vehiclePlateNumber || 'No plate'}</p>
              </div>
            </div>
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400 w-20">Phone:</span>
                {selectedDriver.phone ? formatPhoneNumber(selectedDriver.phone) : 'Not provided'}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400 w-20">Email:</span>
                {selectedDriver.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400 w-20">License:</span>
                {selectedDriver.licenseNumber || 'Not provided'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
