import { useState } from 'react'
import { Save, Upload, Mail, MessageSquare } from 'lucide-react'
import { cn } from '@/utils/cn'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Tabs from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import HoursEditor from './components/HoursEditor'

const cuisineOptions = [
  { value: 'american', label: 'American' },
  { value: 'italian', label: 'Italian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'indian', label: 'Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'thai', label: 'Thai' },
  { value: 'mediterranean', label: 'Mediterranean' },
]

const settingTabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'hours', label: 'Hours' },
  { key: 'delivery', label: 'Delivery Zones' },
  { key: 'orders', label: 'Order Settings' },
  { key: 'notifications', label: 'Notifications' },
]

export default function ShopSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: 'Tasty Bites Downtown',
    description: 'A cozy restaurant serving fresh, made-to-order American cuisine.',
    tags: ['american', 'burgers'],
  })

  const [orderSettings, setOrderSettings] = useState({
    prepTime: '15',
    autoAccept: false,
    maxDailyOrders: '100',
  })

  const [notifications, setNotifications] = useState({
    emailNewOrder: true,
    emailOrderReady: true,
    emailDailyReport: false,
    smsNewOrder: true,
    smsOrderCancelled: true,
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your restaurant settings</p>
      </div>

      <Tabs tabs={settingTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Restaurant Profile</h3>
            <div className="space-y-4">
              <Input
                label="Restaurant Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cuisine Tags</label>
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <Badge key={tag} variant="brand">
                      {tag}
                      <button
                        onClick={() => setProfile({ ...profile, tags: profile.tags.filter((t) => t !== tag) })}
                        className="ml-1 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <select
                    className="text-sm border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-gray-500 focus:outline-none"
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !profile.tags.includes(e.target.value)) {
                        setProfile({ ...profile, tags: [...profile.tags, e.target.value] })
                      }
                    }}
                  >
                    <option value="">+ Add tag</option>
                    {cuisineOptions.filter((o) => !profile.tags.includes(o.value)).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Hours Tab */}
      {activeTab === 'hours' && (
        <Card>
          <HoursEditor />
        </Card>
      )}

      {/* Delivery Zones Tab */}
      {activeTab === 'delivery' && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Zones</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-xl h-64 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <span className="text-2xl">🗺️</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Map-based zone editor</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">Define your delivery zones using an interactive map. Coming soon.</p>
            <Button variant="secondary" size="sm" className="mt-4" disabled>
              Coming Soon
            </Button>
          </div>
        </Card>
      )}

      {/* Order Settings Tab */}
      {activeTab === 'orders' && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Order Settings</h3>
          <div className="space-y-4">
            <Input
              label="Estimated Prep Time (minutes)"
              type="number"
              value={orderSettings.prepTime}
              onChange={(e) => setOrderSettings({ ...orderSettings, prepTime: e.target.value })}
            />
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">Auto-accept orders</p>
                <p className="text-sm text-gray-500">Automatically accept incoming orders without manual review</p>
              </div>
              <button
                onClick={() => setOrderSettings({ ...orderSettings, autoAccept: !orderSettings.autoAccept })}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  orderSettings.autoAccept ? 'bg-orange-500' : 'bg-gray-300'
                )}
              >
                <div className={cn(
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  orderSettings.autoAccept ? 'translate-x-6' : 'translate-x-0.5'
                )} />
              </button>
            </div>
            <Input
              label="Max Daily Orders"
              type="number"
              value={orderSettings.maxDailyOrders}
              onChange={(e) => setOrderSettings({ ...orderSettings, maxDailyOrders: e.target.value })}
            />
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-gray-900">Email Notifications</p>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'emailNewOrder', label: 'New order received' },
                  { key: 'emailOrderReady', label: 'Order ready for pickup' },
                  { key: 'emailDailyReport', label: 'Daily summary report' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={cn(
                        'relative w-10 h-5 rounded-full transition-colors',
                        notifications[item.key as keyof typeof notifications] ? 'bg-orange-500' : 'bg-gray-300'
                      )}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
                    </button>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-gray-900">SMS Notifications</p>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'smsNewOrder', label: 'New order received' },
                  { key: 'smsOrderCancelled', label: 'Order cancelled' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={cn(
                        'relative w-10 h-5 rounded-full transition-colors',
                        notifications[item.key as keyof typeof notifications] ? 'bg-orange-500' : 'bg-gray-300'
                      )}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

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
