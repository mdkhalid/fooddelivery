import { cn } from '@/utils/cn'

interface AnalyticsChartProps {
  data: { label: string; value: number }[]
  type?: 'bar' | 'line'
  className?: string
}

export default function AnalyticsChart({ data, type = 'bar', className }: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1

  return (
    <div className={cn('w-full', className)}>
      {type === 'bar' ? (
        <div className="flex items-end gap-1.5 h-40">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-xs text-gray-500 font-medium">{d.value}</span>
              <div
                className="w-full bg-gradient-to-t from-orange-500 to-red-400 rounded-t-md transition-all hover:from-orange-600 hover:to-red-500 min-h-[2px]"
                style={{ height: `${((d.value - minValue) / range) * 80 + 20}%` }}
              />
              <span className="text-xs text-gray-400 truncate w-full text-center">{d.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative h-40">
          <svg className="w-full h-full" viewBox={`0 0 ${data.length * 40} 160`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={`M ${data.map((d, i) => {
                const x = i * 40 + 20
                const y = 160 - ((d.value - minValue) / range) * 120 - 20
                return `${x},${y}`
              }).join(' L ')} L ${(data.length - 1) * 40 + 20},160 L 20,160 Z`}
              fill="url(#lineGradient)"
            />
            {/* Line */}
            <polyline
              points={data.map((d, i) => {
                const x = i * 40 + 20
                const y = 160 - ((d.value - minValue) / range) * 120 - 20
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="rgb(249 115 22)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {data.map((d, i) => {
              const x = i * 40 + 20
              const y = 160 - ((d.value - minValue) / range) * 120 - 20
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke="rgb(249 115 22)"
                  strokeWidth="2.5"
                />
              )
            })}
          </svg>
          {/* Labels */}
          <div className="flex justify-between mt-1">
            {data.map((d, i) => (
              <span key={i} className="text-xs text-gray-400 flex-1 text-center">{d.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
