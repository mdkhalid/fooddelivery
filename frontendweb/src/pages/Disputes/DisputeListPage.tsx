import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight, MessageSquare } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useDisputeList } from '@/hooks/useDisputes'
import { formatDate } from '@/utils/format'

interface Dispute {
  id: string
  orderId: string
  orderNumber: string
  userId: string
  reason: string
  description: string
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED'
  resolution?: string
  refundAmount?: number
  evidence: unknown[]
  messages: unknown[]
  createdAt: string
  updatedAt: string
}

const DISPUTE_STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'success' | 'error' | 'info' | 'default' }> = {
  OPEN: { label: 'Open', variant: 'warning' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'info' },
  RESOLVED: { label: 'Resolved', variant: 'success' },
  CLOSED: { label: 'Closed', variant: 'default' },
}

const DISPUTE_REASON_CONFIG: Record<string, { label: string; variant: 'error' | 'warning' | 'info' | 'default' }> = {
  MISSING_ITEMS: { label: 'Missing Items', variant: 'error' },
  WRONG_ITEMS: { label: 'Wrong Items', variant: 'warning' },
  QUALITY_ISSUE: { label: 'Quality Issue', variant: 'warning' },
  LATE_DELIVERY: { label: 'Late Delivery', variant: 'info' },
  ORDER_NOT_RECEIVED: { label: 'Not Received', variant: 'error' },
  CHARGEBACK: { label: 'Chargeback', variant: 'default' },
}

export default function DisputeListPage() {
  const { data: disputes, isLoading } = useDisputeList()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-surface-200" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const disputeList = disputes ?? []

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-surface-900">My Disputes</h1>
          <p className="mt-1 text-sm text-surface-500">Track and manage your order issues</p>
        </div>

        {disputeList.length === 0 ? (
          <EmptyState
            icon={<AlertTriangle className="h-16 w-16" />}
            title="No disputes filed"
            description="If you have an issue with an order, you can file a dispute from the order detail page."
          />
        ) : (
          <div className="space-y-4">
            {disputeList.map((dispute) => (
              <DisputeCard key={dispute.id} dispute={dispute} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DisputeCard({ dispute }: { dispute: Dispute }) {
  const statusConfig = DISPUTE_STATUS_CONFIG[dispute.status] ?? {
    label: dispute.status,
    variant: 'default' as const,
  }
  const reasonConfig = DISPUTE_REASON_CONFIG[dispute.reason] ?? {
    label: dispute.reason,
    variant: 'default' as const,
  }

  return (
    <Link to={`/disputes/${dispute.id}`}>
      <Card hover clickable padding="md" className="mb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={reasonConfig.variant} size="sm">
                {reasonConfig.label}
              </Badge>
              <Badge variant={statusConfig.variant} size="sm" dot>
                {statusConfig.label}
              </Badge>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium text-surface-700">
                Order #{dispute.orderNumber}
              </p>
              <p className="mt-1 text-sm text-surface-500 line-clamp-2">
                {dispute.description}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <span className="text-xs text-surface-400">
                Filed {formatDate(dispute.createdAt)}
              </span>
              {dispute.messages.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-surface-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {dispute.messages.length} message{dispute.messages.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {dispute.resolution && (
              <div className="mt-3 rounded-lg bg-green-50 p-3">
                <p className="text-xs font-medium text-green-700">Resolution</p>
                <p className="mt-0.5 text-sm text-green-600">{dispute.resolution}</p>
                {dispute.refundAmount !== undefined && dispute.refundAmount > 0 && (
                  <p className="mt-1 text-xs font-semibold text-green-700">
                    Refund: ${dispute.refundAmount.toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-surface-300" />
        </div>
      </Card>
    </Link>
  )
}
