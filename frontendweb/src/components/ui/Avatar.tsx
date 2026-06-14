import { useState } from 'react'
import { cn } from '@/utils/cn'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  online?: boolean
  ring?: boolean
  className?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-lg',
}

const ringStyles: Record<AvatarSize, string> = {
  sm: 'ring-2 ring-offset-1',
  md: 'ring-2 ring-offset-2',
  lg: 'ring-2 ring-offset-2',
  xl: 'ring-2 ring-offset-2',
}

const onlineDotSize: Record<AvatarSize, string> = {
  sm: 'h-2 w-2 border',
  md: 'h-2.5 w-2.5 border',
  lg: 'h-3 w-3 border-2',
  xl: 'h-4 w-4 border-2',
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  online,
  ring = false,
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = src && !imgError

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full overflow-hidden',
          sizeStyles[size],
          ring && 'ring-brand-400 ' + ringStyles[size],
          !showImage && 'bg-gradient-brand text-white font-semibold',
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white bg-success',
            onlineDotSize[size],
          )}
        />
      )}
    </div>
  )
}
