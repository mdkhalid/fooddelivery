import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Phone, ArrowLeft, UserPlus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/types/auth.types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']
const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isRegisterLoading, registerError } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')
  const strength = getPasswordStrength(password)

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        role: UserRole.CUSTOMER,
      })
      navigate('/')
    } catch {
      // Error handled by useAuth
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 lg:block">
        <div className="relative flex h-full items-center justify-center bg-gradient-dark overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
          <div className="absolute top-32 right-20 h-36 w-36 rounded-full bg-brand-500/20 blur-3xl animate-float" />
          <div className="absolute bottom-32 left-20 h-28 w-28 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="relative text-center px-12">
            <div className="mb-6 text-7xl">🎉</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Join the Feast!
            </h2>
            <p className="text-lg text-surface-300">
              Create an account and get exclusive deals on your first order.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-surface-900">
              Create your account
            </h1>
            <p className="mt-2 text-surface-500">
              Start ordering your favorite meals today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {registerError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 animate-slide-down">
                {registerError.message || 'Registration failed. Please try again.'}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                leftIcon={<Lock className="h-4 w-4" />}
                passwordToggle
                error={errors.password?.message}
                {...register('password')}
              />
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1.5 flex-1 rounded-full transition-all duration-300',
                          i < strength ? strengthColors[strength - 1] : 'bg-surface-200',
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn('mt-1 text-xs', strength >= 3 ? 'text-green-600' : 'text-surface-400')}>
                    {strengthLabels[strength - 1] || 'Too short'}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              leftIcon={<Lock className="h-4 w-4" />}
              passwordToggle
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-400"
                {...register('terms')}
              />
              <span className="text-sm text-surface-600">
                I agree to the{' '}
                <span className="font-medium text-brand-500 hover:text-brand-600">Terms of Service</span>
                {' '}and{' '}
                <span className="font-medium text-brand-500 hover:text-brand-600">Privacy Policy</span>
              </span>
            </label>
            {errors.terms && (
              <p className="text-sm text-error animate-slide-down">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isRegisterLoading}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
