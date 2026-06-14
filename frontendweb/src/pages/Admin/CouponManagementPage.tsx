import { useState, useEffect, useCallback } from 'react'
import {
  Ticket, Plus, Pencil, Trash2, XCircle, CheckCircle, Percent, DollarSign,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatDate, formatCurrency } from '@/utils/format'
import { adminService, type Coupon, type CreateCouponRequest } from '@/services/admin.service'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

const discountTypeOptions = [
  { value: 'PERCENTAGE', label: 'Percentage (%)' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount ($)' },
  { value: 'FREE_DELIVERY', label: 'Free Delivery' },
]

interface CouponFormData {
  code: string
  description: string
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY'
  discountValue: number
  minimumOrderAmount: number
  maximumDiscountAmount: number
  usageLimit: number
  expiresAt: string
  isActive: boolean
}

const defaultFormData: CouponFormData = {
  code: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: 0,
  minimumOrderAmount: 0,
  maximumDiscountAmount: 0,
  usageLimit: 0,
  expiresAt: '',
  isActive: true,
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
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

export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState<CouponFormData>(defaultFormData)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CouponFormData, string>>>({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Coupon | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await adminService.getCoupons({ page, limit: 15 })
      setCoupons(res.data)
      setTotalPages(res.meta.totalPages)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  const openCreateForm = () => {
    setEditingCoupon(null)
    setFormData(defaultFormData)
    setFormErrors({})
    setShowForm(true)
  }

  const openEditForm = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount || 0,
      maximumDiscountAmount: coupon.maximumDiscountAmount || 0,
      usageLimit: coupon.usageLimit || 0,
      expiresAt: (coupon.expiresAt ?? '').split('T')[0] ?? '',
      isActive: coupon.isActive,
    })
    setFormErrors({})
    setShowForm(true)
  }

  const validate = (): boolean => {
    const errors: Partial<Record<keyof CouponFormData, string>> = {}
    if (!formData.code.trim()) errors.code = 'Code is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (formData.discountType !== 'FREE_DELIVERY' && formData.discountValue <= 0) {
      errors.discountValue = 'Discount value must be greater than 0'
    }
    if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
      errors.discountValue = 'Percentage cannot exceed 100%'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      setSubmitLoading(true)
      const payload: CreateCouponRequest = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        minimumOrderAmount: formData.minimumOrderAmount || undefined,
        maximumDiscountAmount: formData.maximumDiscountAmount || undefined,
        usageLimit: formData.usageLimit || undefined,
        expiresAt: formData.expiresAt || undefined,
        isActive: formData.isActive,
      }

      if (editingCoupon) {
        await adminService.updateCoupon(editingCoupon.id, payload)
        toast.success('Coupon updated successfully')
      } else {
        await adminService.createCoupon(payload)
        toast.success('Coupon created successfully')
      }
      setShowForm(false)
      fetchCoupons()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save coupon')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await adminService.updateCoupon(coupon.id, { isActive: !coupon.isActive })
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
      )
      toast.success(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'}`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update coupon')
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    try {
      setDeleteLoading(true)
      await adminService.updateCoupon(deleteConfirm.id, { isActive: false })
      setCoupons((prev) => prev.filter((c) => c.id !== deleteConfirm.id))
      toast.success('Coupon deleted')
      setDeleteConfirm(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete coupon')
    } finally {
      setDeleteLoading(false)
    }
  }

  const updateField = <K extends keyof CouponFormData>(key: K, value: CouponFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (formErrors[key]) setFormErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage discount coupons</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreateForm}>
          Create Coupon
        </Button>
      </div>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCoupons} />
        ) : coupons.length === 0 ? (
          <EmptyState
            icon={<Ticket className="h-12 w-12" />}
            title="No coupons yet"
            description="Create your first coupon to offer discounts to customers"
            action={
              <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreateForm}>
                Create Coupon
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Code</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Value</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Min Order</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Usage</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Expiry</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-lg text-xs">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          {coupon.discountType === 'PERCENTAGE' ? (
                            <><Percent className="h-3.5 w-3.5" /> Percentage</>
                          ) : coupon.discountType === 'FIXED_AMOUNT' ? (
                            <><DollarSign className="h-3.5 w-3.5" /> Fixed</>
                          ) : (
                            'Free Delivery'
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {coupon.discountType === 'PERCENTAGE'
                          ? `${coupon.discountValue}%`
                          : coupon.discountType === 'FIXED_AMOUNT'
                          ? formatCurrency(coupon.discountValue)
                          : 'Free'
                        }
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {coupon.minimumOrderAmount ? formatCurrency(coupon.minimumOrderAmount) : '-'}
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={coupon.isActive ? 'success' : 'error'} dot>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditForm(coupon)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(coupon)}
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              coupon.isActive
                                ? 'hover:bg-yellow-50 text-gray-400 hover:text-yellow-600'
                                : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                            )}
                          >
                            {coupon.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(coupon)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Create/Edit Modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowForm(false)} disabled={submitLoading}>Cancel</Button>
            <Button loading={submitLoading} onClick={handleSubmit}>
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Coupon Code"
            placeholder="e.g. SUMMER20"
            value={formData.code}
            onChange={(e) => updateField('code', e.target.value)}
            error={formErrors.code}
            className="uppercase font-mono"
          />
          <Input
            label="Description"
            placeholder="e.g. 20% off summer sale"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            error={formErrors.description}
          />
          <Select
            label="Discount Type"
            options={discountTypeOptions}
            value={formData.discountType}
            onChange={(e) => updateField('discountType', e.target.value as any)}
          />
          {formData.discountType !== 'FREE_DELIVERY' && (
            <Input
              label={formData.discountType === 'PERCENTAGE' ? 'Percentage Off' : 'Amount Off'}
              type="number"
              min="0"
              max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
              step="0.01"
              value={formData.discountValue || ''}
              onChange={(e) => updateField('discountValue', parseFloat(e.target.value) || 0)}
              error={formErrors.discountValue}
              leftIcon={formData.discountType === 'FIXED_AMOUNT' ? <DollarSign className="h-4 w-4" /> : <Percent className="h-4 w-4" />}
            />
          )}
          <Input
            label="Minimum Order Amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0 for no minimum"
            value={formData.minimumOrderAmount || ''}
            onChange={(e) => updateField('minimumOrderAmount', parseFloat(e.target.value) || 0)}
            leftIcon={<DollarSign className="h-4 w-4" />}
          />
          {formData.discountType === 'PERCENTAGE' && (
            <Input
              label="Maximum Discount Amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0 for no limit"
              value={formData.maximumDiscountAmount || ''}
              onChange={(e) => updateField('maximumDiscountAmount', parseFloat(e.target.value) || 0)}
              leftIcon={<DollarSign className="h-4 w-4" />}
            />
          )}
          <Input
            label="Usage Limit"
            type="number"
            min="0"
            placeholder="0 for unlimited"
            value={formData.usageLimit || ''}
            onChange={(e) => updateField('usageLimit', parseInt(e.target.value) || 0)}
          />
          <Input
            label="Expiry Date"
            type="date"
            value={formData.expiresAt}
            onChange={(e) => updateField('expiresAt', e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateField('isActive', !formData.isActive)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.isActive ? 'bg-green-500' : 'bg-gray-200'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                  formData.isActive ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${deleteConfirm?.code}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleteLoading}
      />
    </div>
  )
}
