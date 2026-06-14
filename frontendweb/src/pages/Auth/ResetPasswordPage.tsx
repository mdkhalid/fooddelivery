import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react'
import { authService } from '@/services/auth.service'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await authService.resetPassword(token, data.password)
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-scale-in">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">
            Password reset successful!
          </h1>
          <p className="text-surface-500 mb-8">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Link to="/auth/login">
            <Button fullWidth size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-6">
      <div className="w-full max-w-md">
        <Link
          to="/auth/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-card border border-surface-100">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
            <KeyRound className="h-7 w-7 text-brand-500" />
          </div>

          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">
            Set new password
          </h1>
          <p className="text-surface-500 mb-8">
            Enter your new password below. Make sure it's strong and memorable.
          </p>

          {!token && (
            <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
              No reset token found. Please use the link from your email or{' '}
              <Link to="/auth/forgot-password" className="font-medium underline">
                request a new one
              </Link>.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 animate-slide-down">
                {error}
              </div>
            )}

            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              leftIcon={<Lock className="h-4 w-4" />}
              passwordToggle
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              leftIcon={<Lock className="h-4 w-4" />}
              passwordToggle
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={!token}
              leftIcon={<KeyRound className="h-4 w-4" />}
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
