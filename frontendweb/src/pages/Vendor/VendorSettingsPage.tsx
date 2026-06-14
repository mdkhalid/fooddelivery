import { useState } from 'react'
import { Save, Globe, Mail, Phone, CreditCard, LifeBuoy } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

export default function VendorSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: 'Tasty Bites Co.',
    description: 'A multi-branch restaurant chain specializing in American cuisine.',
    website: 'https://tastybites.com',
    contactEmail: 'admin@tastybites.com',
    contactPhone: '(555) 100-2000',
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Vendor Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your vendor profile and account settings</p>
      </div>

      {/* Vendor Profile */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Vendor Profile</h3>
        <div className="space-y-4">
          <Input
            label="Vendor Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all"
            />
          </div>
          <Input
            label="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            leftIcon={<Globe className="w-4 h-4" />}
          />
          <Input
            label="Contact Email"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Contact Phone"
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>
      </Card>

      {/* Commission Plan */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Commission Plan</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Premium Plan</p>
              <p className="text-sm text-gray-500">15% commission per order</p>
            </div>
          </div>
          <Badge variant="brand">Active</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Monthly Commission</p>
            <p className="text-lg font-bold text-gray-900">$1,867.50</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Next Payout</p>
            <p className="text-lg font-bold text-gray-900">June 30, 2026</p>
          </div>
        </div>
      </Card>

      {/* Payout Information */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Payout Information</h3>
        <div className="space-y-4">
          <Input label="Bank Name" value="Chase Bank" readOnly />
          <Input label="Account Number" value="****4567" readOnly />
          <Input label="Routing Number" value="****8901" readOnly />
          <p className="text-xs text-gray-400">Contact support to update payout details.</p>
        </div>
      </Card>

      {/* Support */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2.5 rounded-xl bg-blue-50">
            <LifeBuoy className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Need help?</p>
            <p className="text-sm text-gray-500">Contact our vendor support team at support@fooddelivery.com</p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          leftIcon={<Save className="w-4 h-4" />}
          loading={saving}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
