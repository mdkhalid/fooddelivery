import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPasswordLoading, forgotPasswordError } = useAuth()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(data.email)
      setSubmitted(true)
    } catch {
      // Error handled by useAuth
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-scale-in">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">
            Check your email
          </h1>
          <p className="text-surface-500 mb-8">
            We've sent a password reset link to{' '}
            <span className="font-medium text-surface-700">{getValues('email')}</span>.
            Please check your inbox and follow the instructions.
          </p>
          <Link to="/auth/login">
            <Button variant="secondary" fullWidth size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Login
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
            <Mail className="h-7 w-7 text-brand-500" />
          </div>

          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-surface-500 mb-8">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {forgotPasswordError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 animate-slide-down">
                {forgotPasswordError.message || 'Something went wrong. Please try again.'}
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isForgotPasswordLoading}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Send Reset Link
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
