import { cn } from '@/utils/cn'
import Spinner from './Spinner'

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export default function LoadingState({
  message,
  fullScreen = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen ? 'min-h-screen' : 'py-16',
        className,
      )}
    >
      <Spinner size="lg" />
      {message && (
        <p className="text-sm text-surface-500 animate-pulse-soft">{message}</p>
      )}
    </div>
  )
}
