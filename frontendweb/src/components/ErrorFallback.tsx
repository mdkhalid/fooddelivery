import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ErrorFallbackProps {
  error: Error | null
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className={cn(
        'w-full max-w-md bg-white rounded-2xl shadow-xl',
        'p-8 text-center'
      )}>
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-6">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-xl',
            'bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold',
            'hover:from-orange-600 hover:to-red-600 transition-all duration-200',
            'shadow-lg shadow-orange-200 active:scale-95'
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}
