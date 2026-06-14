import { useState } from 'react'
import { cn } from '@/utils/cn'
import Skeleton from './Skeleton'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  wrapperClassName?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/images/placeholder-food.jpg',
  className,
  wrapperClassName,
  loading = 'lazy',
  onLoad,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {isLoading && (
        <div className="absolute inset-0">
          <Skeleton variant="rect" className="h-full w-full" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className,
        )}
      />
    </div>
  )
}
