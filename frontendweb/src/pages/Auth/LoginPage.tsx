import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, LogIn, Phone, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().min(1, 'Email or phone is required').refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\+?[\d\s()-]{7,}$/.test(val),
    'Please enter a valid email or phone number',
  ),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoginLoading, loginError } = useAuth()
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password)
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
          <div className="absolute top-20 left-20 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 h-32 w-32 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="relative text-center px-12">
            <div className="mb-6 text-7xl">🍔</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Welcome Back!
            </h2>
            <p className="text-lg text-surface-300">
              Your favorite meals are just a click away.
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
              Sign in to your account
            </h1>
            <p className="mt-2 text-surface-500">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {loginError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 animate-slide-down">
                {loginError.message || 'Invalid credentials. Please try again.'}
              </div>
            )}

            <Input
              label="Email or Phone"
              type="text"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              leftIcon={<Lock className="h-4 w-4" />}
              passwordToggle
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-400"
                />
                <span className="text-sm text-surface-600">Remember me</span>
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoginLoading}
              leftIcon={<LogIn className="h-4 w-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-surface-400">or</span>
            </div>
          </div>

          <Link to="/auth/otp">
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              leftIcon={<Phone className="h-4 w-4" />}
            >
              Login with OTP
            </Button>
          </Link>

          <p className="mt-8 text-center text-sm text-surface-500">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
