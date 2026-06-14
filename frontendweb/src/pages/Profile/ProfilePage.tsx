import { useState, useRef } from 'react'
import { Camera, Save, Pencil, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/user.service'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import { toastSuccess, toastError } from '@/components/ui'

export default function ProfilePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toastError('Image must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      await userService.uploadAvatar(file)
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      toastSuccess('Avatar updated')
    } catch {
      toastError('Failed to upload avatar')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toastError('First and last name are required')
      return
    }

    setIsSaving(true)
    try {
      await userService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
      })
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      setIsEditing(false)
      toastSuccess('Profile updated')
    } catch {
      toastError('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFirstName(user?.firstName ?? '')
    setLastName(user?.lastName ?? '')
    setPhone(user?.phone ?? '')
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold text-surface-900">Profile</h1>

        {/* Avatar */}
        <Card padding="lg" className="mb-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar
                src={user?.avatarUrl}
                name={user ? `${user.firstName} ${user.lastName}` : undefined}
                size="xl"
                ring
              />
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <p className="mt-3 text-sm text-surface-400">Click to change photo</p>
          </div>
        </Card>

        {/* Profile Form */}
        <Card padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-surface-900">Personal Information</h2>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Pencil className="h-4 w-4" />}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Save className="h-4 w-4" />}
                  onClick={handleSave}
                  loading={isSaving}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                leftIcon={<User className="h-4 w-4" />}
              />
            </div>
            <Input
              label="Email"
              value={user?.email ?? ''}
              disabled
              className="bg-surface-50"
            />
            <Input
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter phone number"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
