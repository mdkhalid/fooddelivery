import { cn } from '@/utils/cn'

type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  count?: number
}

function Skeleton({ variant = 'text', className }: SkeletonProps) {
  const base = 'animate-pulse bg-surface-200 rounded-xl'

  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'h-4 w-full rounded-md',
    circle: 'h-12 w-12 rounded-full',
    rect: 'h-32 w-full',
    card: 'h-48 w-full rounded-2xl',
  }

  return (
    <div
      className={cn(base, variantStyles[variant], className)}
      aria-hidden="true"
    />
  )
}

function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-surface-100 bg-white p-4 space-y-3', className)}>
      <Skeleton variant="rect" className="h-40" />
      <Skeleton variant="text" className="h-5 w-2/3" />
      <Skeleton variant="text" className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton variant="text" className="h-6 w-16 rounded-full" />
        <Skeleton variant="text" className="h-6 w-12 rounded-full" />
      </div>
    </div>
  )
}

function SkeletonRestaurant({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-surface-100 bg-white overflow-hidden', className)}>
      <Skeleton variant="rect" className="h-44 rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton variant="circle" className="h-5 w-5" />
          <Skeleton variant="text" className="h-4 w-10" />
          <Skeleton variant="text" className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

function SkeletonOrder({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-surface-100 bg-white p-4 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-1/3" />
          <Skeleton variant="text" className="h-3 w-1/4" />
        </div>
        <Skeleton variant="text" className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton variant="text" className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonRestaurant, SkeletonOrder }
export default Skeleton
