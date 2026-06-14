import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'

type CardVariant = 'default' | 'glass' | 'elevated'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  variant?: CardVariant
  padding?: CardPadding
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-surface-100 shadow-card',
  glass: 'bg-white/60 backdrop-blur-xl border border-white/20 shadow-glass',
  elevated: 'bg-white shadow-soft-lg',
}

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export default function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  children,
  className,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl transition-all duration-300',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5',
        clickable && 'cursor-pointer active:scale-[0.98]',
        className,
      )}
    >
      {children}
    </div>
  )
}
