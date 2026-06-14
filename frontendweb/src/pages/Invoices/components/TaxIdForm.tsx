import { useState } from 'react'
import { CheckCircle, AlertCircle, Building2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'

interface TaxIdData {
  businessName: string
  taxIdNumber: string
  country: string
}

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'NG', label: 'Nigeria' },
]

export default function TaxIdForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified')
  const [formData, setFormData] = useState<TaxIdData>({
    businessName: '',
    taxIdNumber: '',
    country: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof TaxIdData, string>>>({})

  const hasSavedData = formData.businessName.length > 0

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaxIdData, string>> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }
    if (!formData.taxIdNumber.trim()) {
      newErrors.taxIdNumber = 'Tax ID number is required'
    } else if (formData.taxIdNumber.replace(/\D/g, '').length < 5) {
      newErrors.taxIdNumber = 'Please enter a valid tax ID'
    }
    if (!formData.country) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    setVerificationStatus('pending')

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setVerificationStatus('verified')
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setVerificationStatus('unverified')
  }

  return (
    <Card padding="md">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-5 w-5 text-surface-400" />
        <h2 className="text-sm font-semibold text-surface-700">Tax Information</h2>
      </div>

      {verificationStatus === 'verified' && !isEditing && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-700">Tax ID Verified</p>
            <p className="text-xs text-green-600">
              Your tax information has been verified and is on file.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'pending' && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3">
          <Spinner size="sm" className="shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-700">Verification Pending</p>
            <p className="text-xs text-amber-600">
              Your tax information is being verified. This may take a few minutes.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'unverified' && hasSavedData && !isEditing && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700">
            Your tax ID is not yet verified. Please update and save your information.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Business Name"
          placeholder="Enter your business or legal name"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          error={errors.businessName}
          disabled={!isEditing}
        />

        <Input
          label="Tax ID Number"
          placeholder="e.g., EIN, VAT, GST number"
          value={formData.taxIdNumber}
          onChange={(e) => setFormData({ ...formData, taxIdNumber: e.target.value })}
          error={errors.taxIdNumber}
          disabled={!isEditing}
        />

        <Select
          label="Country"
          placeholder="Select country"
          options={COUNTRIES}
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          error={errors.country}
          disabled={!isEditing}
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        {isEditing ? (
          <>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isSaving}
            >
              Save Tax ID
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditing(false)
                if (hasSavedData) setVerificationStatus('verified')
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            onClick={handleEdit}
          >
            {hasSavedData ? 'Edit Tax ID' : 'Add Tax ID'}
          </Button>
        )}
      </div>
    </Card>
  )
}
