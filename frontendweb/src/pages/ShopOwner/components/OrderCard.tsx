import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, MapPin, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'

interface OrderCardProps {
  order: {
    id: string
    orderNumber: string
    customerName: string
    items: { name: string; quantity: number; modifiers?: string }[]
    total: number
    deliveryAddress: string
    status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled'
    createdAt: string
    elapsedMinutes: number
  }
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onMarkReady: (id: string) => void
}

const rejectReasons = [
  { value: 'out_of_stock', label: 'Out of stock' },
  { value: 'too_busy', label: 'Too busy' },
  { value: 'closing_soon', label: 'Closing soon' },
  { value: 'other', label: 'Other' },
]

export default function OrderCard({ order, onAccept, onReject, onMarkReady }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [elapsed, setElapsed] = useState(order.elapsedMinutes)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    if (order.status !== 'new') return
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [order.status])

  const handleReject = () => {
    onReject(order.id)
    setShowReject(false)
    setRejectReason('')
  }

  const isNew = order.status === 'new'
  const isPreparing = order.status === 'preparing'
  const isReady = order.status === 'ready'

  return (
    <div className={cn(
      'border rounded-2xl overflow-hidden transition-all',
      isNew ? 'border-orange-200 bg-orange-50/30 shadow-sm' : 'border-gray-200 bg-white',
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{order.orderNumber}</p>
              {isNew && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  NEW
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{order.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span className={cn(
              'font-medium',
              elapsed > 15 ? 'text-red-600' : elapsed > 10 ? 'text-amber-600' : 'text-gray-600'
            )}>
              {elapsed} min
            </span>
          </div>
          <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
        </div>
      </div>

      {/* Expandable Items */}
      <div className="px-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-2"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </button>
        {expanded && (
          <div className="pb-3 space-y-1.5">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{item.quantity}×</span>
                  <span className="text-gray-700">{item.name}</span>
                  {item.modifiers && <span className="text-xs text-gray-400">({item.modifiers})</span>}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1.5 pt-2 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{order.deliveryAddress}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {isNew && !showReject && (
        <div className="flex gap-2 p-4 pt-0">
          <Button variant="success" size="sm" className="flex-1" onClick={() => onAccept(order.id)}>
            Accept
          </Button>
          <Button variant="danger" size="sm" className="flex-1" onClick={() => setShowReject(true)}>
            Reject
          </Button>
        </div>
      )}

      {isNew && showReject && (
        <div className="p-4 pt-0 space-y-2">
          <Select
            options={rejectReasons}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Select reason"
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowReject(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleReject} disabled={!rejectReason}>
              Confirm Reject
            </Button>
          </div>
        </div>
      )}

      {isPreparing && (
        <div className="p-4 pt-0">
          <Button variant="primary" size="sm" className="w-full" onClick={() => onMarkReady(order.id)}>
            Mark as Ready
          </Button>
        </div>
      )}

      {isReady && (
        <div className="p-4 pt-0">
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Ready for pickup</span>
          </div>
        </div>
      )}
    </div>
  )
}
