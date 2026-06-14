import { useState } from 'react'
import { ToggleLeft, ToggleRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { DayOfWeek, type OperatingHours } from '@/types/restaurant.types'

const days: { key: DayOfWeek; label: string }[] = [
  { key: DayOfWeek.MONDAY, label: 'Mon' },
  { key: DayOfWeek.TUESDAY, label: 'Tue' },
  { key: DayOfWeek.WEDNESDAY, label: 'Wed' },
  { key: DayOfWeek.THURSDAY, label: 'Thu' },
  { key: DayOfWeek.FRIDAY, label: 'Fri' },
  { key: DayOfWeek.SATURDAY, label: 'Sat' },
  { key: DayOfWeek.SUNDAY, label: 'Sun' },
]

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const ampm = h < 12 ? 'AM' : 'PM'
  return { value: `${String(h).padStart(2, '0')}:${m}`, label: `${hour12}:${m} ${ampm}` }
})

const defaultHours: OperatingHours[] = days.map((d) => ({
  dayOfWeek: d.key,
  openTime: '09:00',
  closeTime: '21:00',
  isClosed: d.key === 'SUNDAY',
}))

export default function HoursEditor() {
  const [sameEveryDay, setSameEveryDay] = useState(false)
  const [hours, setHours] = useState<OperatingHours[]>(defaultHours)

  const updateHours = (dayIndex: number, updates: Partial<OperatingHours>) => {
    setHours((prev) => {
      const newHours = [...prev]
      if (sameEveryDay && dayIndex === 0) {
        const first = newHours[0]
        if (!first) return prev
        const updated = { ...first, ...updates }
        return newHours.map((h) => ({ ...h, ...updates, isClosed: updated.isClosed ?? h.isClosed }))
      }
      const existing = newHours[dayIndex]
      if (!existing) return prev
      newHours[dayIndex] = { ...existing, ...updates }
      return newHours
    })
  }

  const toggleSameEveryDay = () => {
    if (!sameEveryDay) {
      const first = hours[0]
      if (first) {
        setHours((prev) => prev.map((h) => ({
          ...h,
          openTime: first.openTime,
          closeTime: first.closeTime,
          isClosed: first.isClosed,
        })))
      }
    }
    setSameEveryDay(!sameEveryDay)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Operating Hours</h3>
        <button
          onClick={toggleSameEveryDay}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          {sameEveryDay ? (
            <ToggleRight className="w-6 h-6 text-orange-500" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
          Same every day
        </button>
      </div>

      <div className="space-y-2">
        {days.map((day, i) => (
          <div
            key={day.key}
            className={cn(
              'flex items-center gap-4 p-3 rounded-xl transition-colors',
              hours[i]?.isClosed ? 'bg-gray-50' : 'bg-white border border-gray-100'
            )}
          >
            <div className="w-10">
              <span className="text-sm font-medium text-gray-700">{day.label}</span>
            </div>

            <button
              onClick={() => updateHours(i, { isClosed: !hours[i]?.isClosed })}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                hours[i]?.isClosed
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              )}
            >
              {hours[i]?.isClosed ? 'Closed' : 'Open'}
            </button>

            {!hours[i]?.isClosed && (
              <>
                <select
                  value={hours[i]?.openTime}
                  onChange={(e) => updateHours(i, { openTime: e.target.value })}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                >
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <span className="text-gray-400 text-sm">to</span>
                <select
                  value={hours[i]?.closeTime}
                  onChange={(e) => updateHours(i, { closeTime: e.target.value })}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                >
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </>
            )}

            {sameEveryDay && i > 0 && (
              <span className="text-xs text-gray-400 ml-auto">Same as Mon</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
