import { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface Tab {
  key: string
  label: string
  count?: number
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab?: string
  onChange: (tabKey: string) => void
  className?: string
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.key || '')
  const activeKey = activeTab ?? internalActive
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  const handleChange = (key: string) => {
    if (activeTab === undefined) {
      setInternalActive(key)
    }
    onChange(key)
  }

  useEffect(() => {
    const activeEl = tabRefs.current.get(activeKey)
    if (activeEl && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const tabRect = activeEl.getBoundingClientRect()
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      })
    }
  }, [activeKey])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex gap-1 overflow-x-auto scrollbar-hide border-b border-surface-100',
        className,
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          ref={(el) => {
            if (el) tabRefs.current.set(tab.key, el)
          }}
          role="tab"
          aria-selected={activeKey === tab.key}
          disabled={tab.disabled}
          onClick={() => handleChange(tab.key)}
          className={cn(
            'relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-inset rounded-t-lg',
            activeKey === tab.key
              ? 'text-brand-600'
              : 'text-surface-500 hover:text-surface-700',
            tab.disabled && 'opacity-40 cursor-not-allowed',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-xs font-semibold',
                activeKey === tab.key
                  ? 'bg-brand-100 text-brand-600'
                  : 'bg-surface-100 text-surface-500',
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
      <div
        className="absolute bottom-0 h-0.5 bg-brand-500 rounded-full transition-all duration-300 ease-out"
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
    </div>
  )
}
