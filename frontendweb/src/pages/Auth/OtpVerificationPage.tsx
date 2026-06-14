import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, RotateCcw } from 'lucide-react'
import { cn } from '@/utils/cn'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/ui/Button'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60

export default function OtpVerificationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const { login: storeLogin } = useAuthStore()

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }

    if (newOtp.every((d) => d !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        setActiveIndex(index - 1)
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return

    const newOtp = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIndex]?.focus()
    setActiveIndex(focusIndex)

    if (pasted.length === OTP_LENGTH) {
      handleVerify(pasted)
    }
  }

  const handleVerify = async (code: string) => {
    if (!phone) {
      setError('Phone number is missing. Please go back and try again.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await authService.verifyOtp(phone, code)
      storeLogin(data.user as any, data.accessToken, data.refreshToken)
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err: any) {
      setError(err?.message || 'Invalid OTP. Please try again.')
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
      setActiveIndex(0)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = useCallback(() => {
    if (cooldown > 0 || !phone) return
    authService.loginWithOtp(phone).then(() => {
      setCooldown(RESEND_COOLDOWN)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
      setActiveIndex(0)
    }).catch((err: any) => {
      setError(err?.message || 'Failed to resend OTP.')
    })
  }, [cooldown, phone])

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-scale-in">
            <ShieldCheck className="h-10 w-10 text-success" />
          </div>
          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">
            Verified!
          </h1>
          <p className="text-surface-500">Redirecting you to the home page...</p>
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
            <ShieldCheck className="h-7 w-7 text-brand-500" />
          </div>

          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">
            Enter verification code
          </h1>
          <p className="text-surface-500 mb-8">
            We've sent a 6-digit code to{' '}
            <span className="font-medium text-surface-700">{phone || 'your phone'}</span>.
          </p>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 animate-slide-down">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={OTP_LENGTH}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={() => setActiveIndex(index)}
                disabled={loading}
                className={cn(
                  'h-14 w-12 rounded-xl border-2 bg-white text-center text-xl font-bold text-surface-900',
                  'transition-all duration-200 outline-none',
                  'focus:ring-2 focus:ring-offset-1',
                  error
                    ? 'border-error/50 focus:ring-error/30'
                    : activeIndex === index
                      ? 'border-brand-400 ring-2 ring-brand-400/20'
                      : digit
                        ? 'border-brand-200 bg-brand-50/30'
                        : 'border-surface-200 focus:border-brand-400 focus:ring-brand-400/20',
                  'disabled:opacity-50',
                )}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          <Button
            onClick={() => handleVerify(otp.join(''))}
            fullWidth
            size="lg"
            loading={loading}
            disabled={otp.some((d) => !d)}
          >
            Verify Code
          </Button>

          <div className="mt-6 text-center">
            {cooldown > 0 ? (
              <p className="text-sm text-surface-400">
                Resend code in{' '}
                <span className="font-medium text-surface-600">{cooldown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Resend code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
