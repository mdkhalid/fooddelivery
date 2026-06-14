import { useState, useCallback } from 'react'
import { cn } from '@/utils/cn'
import { useAddAddress } from '@/hooks/useAddresses'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { MapPin, Plus, Home, Building2, Briefcase, CheckCircle } from 'lucide-react'
import type { Address } from '@/types/user.types'

interface DeliveryAddressSelectorProps {
  selectedAddress: Address | null
  addresses: Address[]
}

const labelIcons: Record<string, typeof Home> = {
  Home: Home,
  Work: Briefcase,
  Office: Briefcase,
}

function getAddressIcon(label: string) {
  const key = Object.keys(labelIcons).find((k) =>
    label.toLowerCase().includes(k.toLowerCase())
  )
  return key ? labelIcons[key] : Building2
}

export default function DeliveryAddressSelector({
  selectedAddress,
  addresses,
}: DeliveryAddressSelectorProps) {
  const [showModal, setShowModal] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const { mutateAsync: addAddress, isPending: isAdding } = useAddAddress()

  const [newAddress, setNewAddress] = useState({
    label: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const handleSaveAddress = useCallback(async () => {
    if (!newAddress.label || !newAddress.streetAddress || !newAddress.city) return
    try {
      await addAddress({
        ...newAddress,
        latitude: 0,
        longitude: 0,
      })
      setShowAddForm(false)
      setNewAddress({ label: '', streetAddress: '', city: '', state: '', zipCode: '', country: '' })
    } catch {
    }
  }, [newAddress, addAddress])

  if (!selectedAddress && addresses.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-surface-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-100">
            <MapPin className="h-5 w-5 text-surface-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-surface-900">Add a delivery address</p>
            <p className="text-xs text-surface-500">We need your address to deliver your order</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowModal(true)}>
            Add
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl bg-white border border-surface-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-surface-900">Delivery Address</h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            Change
          </button>
        </div>

        {selectedAddress && (
          <div className="flex items-start gap-3 rounded-xl bg-surface-50 p-3">
            {(() => {
              const Icon = getAddressIcon(selectedAddress.label)
              return (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100">
                  {Icon && <Icon className="h-4 w-4 text-brand-600" />}
                </div>
              )
            })()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900">
                {selectedAddress.label}
              </p>
              <p className="text-xs text-surface-600 mt-0.5 truncate">
                {selectedAddress.streetAddress}
              </p>
              <p className="text-xs text-surface-500">
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
              </p>
            </div>
            {selectedAddress.isDefault && (
              <span className="inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                Default
              </span>
            )}
          </div>
        )}
      </div>

      {/* Address Selection Modal */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setShowAddForm(false)
        }}
        title="Select Address"
        size="md"
      >
        {!showAddForm ? (
          <div className="space-y-3">
            {addresses.map((address) => (
              <button
                key={address.id}
                onClick={() => setShowModal(false)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all',
                  selectedAddress?.id === address.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                )}
              >
                {(() => {
                  const Icon = getAddressIcon(address.label)
                  return (
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                        selectedAddress?.id === address.id
                          ? 'bg-brand-100'
                          : 'bg-surface-100'
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            'h-5 w-5',
                            selectedAddress?.id === address.id
                              ? 'text-brand-600'
                              : 'text-surface-500'
                          )}
                        />
                      )}
                    </div>
                  )
                })()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900">{address.label}</p>
                  <p className="text-xs text-surface-600 truncate">
                    {address.streetAddress}, {address.city}, {address.state}
                  </p>
                </div>
                {selectedAddress?.id === address.id && (
                  <CheckCircle className="h-5 w-5 text-brand-500 shrink-0" />
                )}
              </button>
            ))}

            <button
              onClick={() => setShowAddForm(true)}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-surface-200 p-4 text-left transition-all hover:border-brand-300 hover:bg-brand-50/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-100">
                <Plus className="h-5 w-5 text-surface-500" />
              </div>
              <span className="text-sm font-medium text-surface-700">
                Add new address
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Label"
              placeholder="e.g. Home, Work"
              value={newAddress.label}
              onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
            />
            <Input
              label="Street Address"
              placeholder="123 Main Street"
              value={newAddress.streetAddress}
              onChange={(e) => setNewAddress((p) => ({ ...p, streetAddress: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                placeholder="New York"
                value={newAddress.city}
                onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
              />
              <Input
                label="State"
                placeholder="NY"
                value={newAddress.state}
                onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="ZIP Code"
                placeholder="10001"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress((p) => ({ ...p, zipCode: e.target.value }))}
              />
              <Input
                label="Country"
                placeholder="US"
                value={newAddress.country}
                onChange={(e) => setNewAddress((p) => ({ ...p, country: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveAddress}
                loading={isAdding}
                disabled={!newAddress.label || !newAddress.streetAddress || !newAddress.city}
                className="flex-1"
              >
                Save Address
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
