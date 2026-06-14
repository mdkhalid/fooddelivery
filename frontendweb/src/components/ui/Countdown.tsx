import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/utils/cn'

interface CountdownProps {
  totalSeconds: number
  onEnd?: () => void
  format?: 'mm:ss' | 'hh:mm:ss' | 'ss'
  className?: string
}

function formatTime(seconds: number, format: string): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  switch (format) {
    case 'hh:mm:ss':
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    case 'ss':
      return `${s}`
    case 'mm:ss':
    default:
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
}

export default function Countdown({
  totalSeconds,
  onEnd,
  format = 'mm:ss',
  className,
}: CountdownProps) {
  const [remaining, setRemaining] = useState(Math.max(0, totalSeconds))

  const handleEnd = useCallback(() => {
    onEnd?.()
  }, [onEnd])

  useEffect(() => {
    setRemaining(Math.max(0, totalSeconds))
  }, [totalSeconds])

  useEffect(() => {
    if (remaining <= 0) {
      handleEnd()
      return
    }

    const timer = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(timer)
          handleEnd()
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [remaining > 0, handleEnd])

  return (
    <span
      className={cn(
        'font-mono tabular-nums text-surface-900',
        remaining <= 10 && remaining > 0 && 'text-error animate-pulse-soft',
        remaining === 0 && 'text-surface-400',
        className,
      )}
    >
      {formatTime(remaining, format)}
    </span>
  )
}
