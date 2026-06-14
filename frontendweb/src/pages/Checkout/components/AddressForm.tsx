import { useState, useCallback } from 'react'
import { cn } from '@/utils/cn'
import { useAddAddress } from '@/hooks/useAddresses'
import { useGeolocation } from '@/hooks/useGeolocation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import { MapPin, Navigation, AlertCircle } from 'lucide-react'
import type { Address } from '@/types/user.types'

interface AddressFormProps {
  onAddressSaved: (address: Address) => void
  onCancel: () => void
}

export default function AddressForm({ onAddressSaved, onCancel }: AddressFormProps) {
  const { mutateAsync: addAddress, isPending } = useAddAddress()
  const { getCurrentLocation, isLoading: isLocating, error: locationError } =
    useGeolocation()

  const [form, setForm] = useState({
    label: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    deliveryInstructions: '',
  })
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  const updateField = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleUseLocation = useCallback(async () => {
    try {
      const location = await getCurrentLocation()
      setCoords(location)
    } catch {
    }
  }, [getCurrentLocation])

  const handleSave = useCallback(async () => {
    if (!form.label || !form.streetAddress || !form.city) return

    try {
      const address = await addAddress({
        ...form,
        latitude: coords?.lat ?? 0,
        longitude: coords?.lng ?? 0,
      })
      onAddressSaved(address)
    } catch {
    }
  }, [form, coords, addAddress, onAddressSaved])

  const isValid = form.label && form.streetAddress && form.city

  return (
    <div className="space-y-4">
      {/* Use Current Location */}
      <button
        onClick={handleUseLocation}
        disabled={isLocating}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left transition-all',
          coords
            ? 'border-green-300 bg-green-50'
            : 'border-surface-200 hover:border-brand-300 hover:bg-brand-50/50',
          isLocating && 'pointer-events-none opacity-60'
        )}
      >
        {isLocating ? (
          <Spinner size="sm" />
        ) : (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              coords ? 'bg-green-100' : 'bg-surface-100'
            )}
          >
            <Navigation
              className={cn(
                'h-5 w-5',
                coords ? 'text-green-600' : 'text-surface-500'
              )}
            />
          </div>
        )}
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium',
              coords ? 'text-green-800' : 'text-surface-700'
            )}
          >
            {coords ? 'Location captured' : 'Use current location'}
          </p>
          {coords && (
            <p className="text-xs text-green-600 mt-0.5">
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </p>
          )}
        </div>
      </button>

      {locationError && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{locationError.message}</span>
        </div>
      )}

      {/* Address Label */}
      <Input
        label="Label"
        placeholder="e.g. Home, Work, Mom's house"
        value={form.label}
        onChange={(e) => updateField('label', e.target.value)}
      />

      {/* Street Address */}
      <Input
        label="Street Address"
        placeholder="123 Main Street, Apt 4B"
        value={form.streetAddress}
        onChange={(e) => updateField('streetAddress', e.target.value)}
        leftIcon={<MapPin className="h-4 w-4" />}
      />

      {/* Street Address 2 */}
      <Input
        label="Apartment, Suite, etc. (optional)"
        placeholder="Apt 4B"
        value={form.streetAddress2}
        onChange={(e) => updateField('streetAddress2', e.target.value)}
      />

      {/* City & State */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="City"
          placeholder="New York"
          value={form.city}
          onChange={(e) => updateField('city', e.target.value)}
        />
        <Input
          label="State"
          placeholder="NY"
          value={form.state}
          onChange={(e) => updateField('state', e.target.value)}
        />
      </div>

      {/* ZIP & Country */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="ZIP Code"
          placeholder="10001"
          value={form.zipCode}
          onChange={(e) => updateField('zipCode', e.target.value)}
        />
        <Input
          label="Country"
          placeholder="US"
          value={form.country}
          onChange={(e) => updateField('country', e.target.value)}
        />
      </div>

      {/* Delivery Instructions */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">
          Delivery Instructions (optional)
        </label>
        <textarea
          value={form.deliveryInstructions}
          onChange={(e) => updateField('deliveryInstructions', e.target.value)}
          placeholder="Ring the doorbell, leave at door, etc."
          rows={2}
          className="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 resize-none"
        />
      </div>

      {/* Map Preview Placeholder */}
      <div className="rounded-xl bg-surface-100 border border-surface-200 h-32 flex items-center justify-center overflow-hidden">
        {coords ? (
          <div className="text-center">
            <MapPin className="h-8 w-8 text-brand-500 mx-auto mb-1" />
            <p className="text-xs text-surface-500">
              Map preview at {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <MapPin className="h-8 w-8 text-surface-300 mx-auto mb-1" />
            <p className="text-xs text-surface-400">
              Use location or enter address to see map
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          loading={isPending}
          disabled={!isValid || isPending}
          className="flex-1"
        >
          Save Address
        </Button>
      </div>
    </div>
  )
}
