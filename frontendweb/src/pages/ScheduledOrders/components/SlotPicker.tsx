import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SlotPickerProps {
  availableSlots?: { date: string; startTime: string; endTime: string; isAvailable: boolean }[]
  selectedDate?: Date
  selectedSlot?: string
  onDateSelect?: (date: Date) => void
  onSlotSelect?: (slotId: string) => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function SlotPicker({
  availableSlots = [],
  selectedDate,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
}: SlotPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selected, setSelected] = useState<Date | null>(selectedDate ?? null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
    }
    return days
  }, [currentMonth, daysInMonth, firstDayOfMonth])

  const slotsForSelectedDate = useMemo(() => {
    if (!selected) return []
    const dateStr = selected.toISOString().split('T')[0]
    return availableSlots.filter((slot) => slot.date === dateStr)
  }, [selected, availableSlots])

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDayClick = (date: Date) => {
    if (date < today) return
    setSelected(date)
    onDateSelect?.(date)
  }

  const isToday = (date: Date) => date.toDateString() === today.toDateString()
  const isSelected = (date: Date) => selected?.toDateString() === date.toDateString()
  const isPast = (date: Date) => date < today

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-surface-100 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-700">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-surface-400 py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) =>
            date === null ? (
              <div key={`empty-${index}`} />
            ) : (
              <button
                key={date.toISOString()}
                onClick={() => handleDayClick(date)}
                disabled={isPast(date)}
                className={cn(
                  'aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                  isPast(date) && 'text-surface-300 cursor-not-allowed',
                  !isPast(date) && !isSelected(date) && 'text-surface-700 hover:bg-brand-50',
                  isToday(date) && !isSelected(date) && 'ring-1 ring-brand-300',
                  isSelected(date) && 'bg-brand-500 text-white shadow-glow-brand',
                )}
              >
                {date.getDate()}
              </button>
            )
          )}
        </div>
      </div>

      {selected && (
        <div>
          <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Available Time Slots
          </h3>

          {slotsForSelectedDate.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-8 rounded-xl border border-dashed border-surface-200">
              No available slots for this date
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slotsForSelectedDate.map((slot) => (
                <button
                  key={`${slot.date}-${slot.startTime}`}
                  onClick={() => slot.isAvailable && onSlotSelect?.(`${slot.date}-${slot.startTime}`)}
                  disabled={!slot.isAvailable}
                  className={cn(
                    'rounded-xl border p-3 text-center transition-all',
                    slot.isAvailable
                      ? selectedSlot === `${slot.date}-${slot.startTime}`
                        ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-glow-brand/20'
                        : 'border-surface-200 bg-white hover:border-brand-300 hover:bg-brand-50 text-surface-700'
                      : 'border-surface-100 bg-surface-50 text-surface-400 cursor-not-allowed line-through',
                  )}
                >
                  <p className="text-sm font-semibold">
                    {slot.startTime} - {slot.endTime}
                  </p>
                  {!slot.isAvailable && (
                    <p className="text-xs text-surface-400 mt-1">Unavailable</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
