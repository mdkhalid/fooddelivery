import { useState } from 'react'
import { Plus, MapPin } from 'lucide-react'
import { useAddressList, useAddAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useAddresses'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { SkeletonCard } from '@/components/ui/Skeleton'
import AddressCard from './components/AddressCard'
import { toastSuccess, toastError } from '@/components/ui'
import type { Address, CreateAddressRequest } from '@/types/user.types'

const MAX_ADDRESSES = 20

export default function AddressBookPage() {
  const { data: addresses = [], isLoading } = useAddressList()
  const addAddress = useAddAddress()
  const updateAddress = useUpdateAddress()
  const deleteAddress = useDeleteAddress()

  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null)

  const [label, setLabel] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [streetAddress2, setStreetAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const resetForm = () => {
    setLabel('')
    setStreetAddress('')
    setStreetAddress2('')
    setCity('')
    setState('')
    setZipCode('')
    setDeliveryInstructions('')
    setIsDefault(false)
    setEditingAddress(null)
  }

  const openAddForm = () => {
    if (addresses.length >= MAX_ADDRESSES) {
      toastError(`Maximum of ${MAX_ADDRESSES} addresses reached`)
      return
    }
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (address: Address) => {
    setEditingAddress(address)
    setLabel(address.label)
    setStreetAddress(address.streetAddress)
    setStreetAddress2(address.streetAddress2 ?? '')
    setCity(address.city)
    setState(address.state)
    setZipCode(address.zipCode)
    setDeliveryInstructions(address.deliveryInstructions ?? '')
    setIsDefault(address.isDefault)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!label.trim() || !streetAddress.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      toastError('Please fill in all required fields')
      return
    }

    const payload: CreateAddressRequest = {
      label: label.trim(),
      streetAddress: streetAddress.trim(),
      streetAddress2: streetAddress2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: 'US',
      latitude: 0,
      longitude: 0,
      isDefault,
      deliveryInstructions: deliveryInstructions.trim() || undefined,
    }

    try {
      if (editingAddress) {
        await updateAddress.mutateAsync({ id: editingAddress.id, ...payload })
        toastSuccess('Address updated')
      } else {
        await addAddress.mutateAsync(payload)
        toastSuccess('Address added')
      }
      setShowForm(false)
      resetForm()
    } catch {
      toastError(editingAddress ? 'Failed to update address' : 'Failed to add address')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteAddress.mutateAsync(deleteTarget.id)
      toastSuccess('Address deleted')
      setDeleteTarget(null)
    } catch {
      toastError('Failed to delete address')
    }
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-surface-900">Address Book</h1>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAddForm}>
            Add Address
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <EmptyState
            icon={<MapPin className="h-16 w-16" />}
            title="No saved addresses"
            description="Add a delivery address to make checkout faster."
            action={
              <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAddForm}>
                Add Address
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                id={address.id}
                label={address.label}
                streetAddress={address.streetAddress}
                streetAddress2={address.streetAddress2}
                city={address.city}
                state={address.state}
                zipCode={address.zipCode}
                isDefault={address.isDefault}
                onEdit={() => openEditForm(address)}
                onDelete={() => setDeleteTarget(address)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false)
          resetForm()
        }}
        title={editingAddress ? 'Edit Address' : 'Add Address'}
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={addAddress.isPending || updateAddress.isPending}>
              {editingAddress ? 'Save Changes' : 'Add Address'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Label *"
            placeholder="e.g. Home, Work"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Input
            label="Street Address *"
            placeholder="123 Main St"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
          />
          <Input
            label="Apt / Suite / Unit"
            placeholder="Apt 4B (optional)"
            value={streetAddress2}
            onChange={(e) => setStreetAddress2(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="State *"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <Input
            label="ZIP Code *"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <Input
            label="Delivery Instructions"
            placeholder="e.g. Leave at door, ring bell"
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-surface-700">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-400"
            />
            Set as default address
          </label>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Address"
        message={
          deleteTarget?.isDefault
            ? 'This is your default address and cannot be deleted. Please set another address as default first.'
            : `Are you sure you want to delete "${deleteTarget?.label}"?`
        }
        confirmLabel="Delete"
        destructive
        loading={deleteAddress.isPending}
      />
    </div>
  )
}
