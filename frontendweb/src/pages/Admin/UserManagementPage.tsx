import { useState, useEffect, useCallback } from 'react'
import {
  Users, Eye, Ban, CheckCircle, Mail, Phone, Calendar,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatDate, formatPhoneNumber } from '@/utils/format'
import { adminService, type AdminUserListParams } from '@/services/admin.service'
import type { User } from '@/types/user.types'
import { UserRole } from '@/types/auth.types'
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

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: UserRole.CUSTOMER, label: 'Customer' },
  { value: UserRole.DELIVERY_DRIVER, label: 'Delivery Driver' },
  { value: UserRole.SHOP_OWNER, label: 'Shop Owner' },
  { value: UserRole.VENDOR_ADMIN, label: 'Vendor Admin' },
  { value: UserRole.SYSTEM_ADMIN, label: 'System Admin' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const roleBadgeVariant: Record<string, 'brand' | 'info' | 'success' | 'warning' | 'default'> = {
  CUSTOMER: 'default',
  DELIVERY_DRIVER: 'info',
  SHOP_OWNER: 'success',
  VENDOR_ADMIN: 'warning',
  SYSTEM_ADMIN: 'brand',
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-48 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: AdminUserListParams = { page, limit: 15 }
      if (search) params.search = search
      if (roleFilter) params.role = roleFilter
      if (statusFilter) params.status = statusFilter as 'active' | 'inactive'
      const res = await adminService.getUsers(params)
      setUsers(res.data)
      setTotalPages(res.meta.totalPages)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleStatusToggle = async (user: User) => {
    try {
      setActionLoading(true)
      const newStatus = user.isActive ? 'inactive' : 'active'
      await adminService.updateUserStatus(user.id, newStatus)
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: newStatus === 'active' } : u))
      )
      setSelectedUser((prev) =>
        prev && prev.id === user.id ? { ...prev, isActive: newStatus === 'active' } : prev
      )
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update user')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all platform users</p>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearch}
            className="sm:w-72"
          />
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
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
          <ErrorState message={error} onRetry={fetchUsers} />
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No users found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">User</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Joined</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatarUrl} name={`${user.firstName} ${user.lastName}`} size="sm" />
                          <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{user.email}</td>
                      <td className="px-5 py-3 text-gray-600">{user.phone ? formatPhoneNumber(user.phone) : '-'}</td>
                      <td className="px-5 py-3">
                        <Badge variant={roleBadgeVariant[user.role] || 'default'}>
                          {user.role.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={user.isActive ? 'success' : 'error'} dot>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              user.isActive
                                ? 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                                : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                            )}
                          >
                            {user.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </button>
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

      {/* User Detail Modal */}
      <Modal
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
        size="md"
        footer={
          selectedUser && (
            <>
              <Button variant="ghost" onClick={() => setSelectedUser(null)}>Close</Button>
              <Button
                variant={selectedUser.isActive ? 'danger' : 'success'}
                loading={actionLoading}
                onClick={() => handleStatusToggle(selectedUser)}
              >
                {selectedUser.isActive ? 'Suspend User' : 'Activate User'}
              </Button>
            </>
          )
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar src={selectedUser.avatarUrl} name={`${selectedUser.firstName} ${selectedUser.lastName}`} size="lg" />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <Badge variant={roleBadgeVariant[selectedUser.role] || 'default'}>
                  {selectedUser.role.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                {selectedUser.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                {selectedUser.phone ? formatPhoneNumber(selectedUser.phone) : 'Not provided'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                Joined {formatDate(selectedUser.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={cn(
                  'inline-flex items-center gap-1.5 font-medium rounded-full px-2.5 py-1 text-xs',
                  selectedUser.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                )}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', selectedUser.isActive ? 'bg-green-500' : 'bg-red-500')} />
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </span>
                {selectedUser.isVerified && (
                  <Badge variant="success" size="sm">Verified</Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
