import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { useDisputeDetail } from '@/hooks/useDisputes'
import { formatDateTime, formatRelativeTime } from '@/utils/format'
import DisputeChat from './components/DisputeChat'
import DisputeEvidenceUpload from './components/DisputeEvidenceUpload'

const DISPUTE_STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'success' | 'error' | 'info' | 'default' }> = {
  OPEN: { label: 'Open', variant: 'warning' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'info' },
  RESOLVED: { label: 'Resolved', variant: 'success' },
  CLOSED: { label: 'Closed', variant: 'default' },
}

export default function DisputeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: dispute, isLoading } = useDisputeDetail(id ?? '')
  const [showUpload, setShowUpload] = useState(false)

  if (isLoading || !dispute) {
    return (
      <div className="min-h-screen bg-surface-50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = DISPUTE_STATUS_CONFIG[dispute.status] ?? {
    label: dispute.status,
    variant: 'default' as const,
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/disputes"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Disputes
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl font-bold text-surface-900">
              Dispute
            </h1>
            <Badge variant={statusConfig.variant} size="md" dot>
              {statusConfig.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-surface-500">
            Order #{dispute.orderNumber} · Filed {formatDateTime(dispute.createdAt)}
          </p>
        </div>

        <Card padding="md" className="mb-6">
          <h2 className="text-sm font-semibold text-surface-700">Details</h2>
          <p className="mt-2 text-sm text-surface-600">{dispute.description}</p>

          {dispute.resolution && (
            <div className="mt-4 rounded-lg bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-700">Resolution</p>
              </div>
              <p className="mt-1 text-sm text-green-600">{dispute.resolution}</p>
              {dispute.refundAmount !== undefined && dispute.refundAmount > 0 && (
                <p className="mt-2 text-sm font-semibold text-green-700">
                  Refund: ${dispute.refundAmount.toFixed(2)}
                </p>
              )}
              {dispute.status === 'RESOLVED' && (
                <Button variant="ghost" size="sm" className="mt-3" leftIcon={<AlertCircle className="h-4 w-4" />}>
                  Appeal Resolution
                </Button>
              )}
            </div>
          )}
        </Card>

        <Card padding="none" className="mb-6">
          <div className="border-b border-surface-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-surface-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </h2>
          </div>
          <DisputeChat
            messages={dispute.messages}
            disputeId={dispute.id}
          />
        </Card>

        <Card padding="md" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-700">Evidence</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpload(!showUpload)}
              leftIcon={<Paperclip className="h-4 w-4" />}
            >
              {showUpload ? 'Hide' : 'Add Photos'}
            </Button>
          </div>

          {dispute.evidence.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {dispute.evidence.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square overflow-hidden rounded-lg bg-surface-100"
                >
                  <img
                    src={item.fileUrl}
                    alt={item.description ?? 'Evidence'}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {dispute.evidence.length === 0 && !showUpload && (
            <p className="text-sm text-surface-400 text-center py-4">
              No evidence uploaded yet
            </p>
          )}

          {showUpload && (
            <DisputeEvidenceUpload disputeId={dispute.id} />
          )}
        </Card>

        {dispute.messages.length > 0 && (
          <Card padding="md">
            <h2 className="text-sm font-semibold text-surface-700 mb-3">Timeline</h2>
            <div className="space-y-4">
              {dispute.messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-surface-300" />
                  <div>
                    <p className="text-sm text-surface-600">
                      <span className="font-medium text-surface-700">
                        {msg.senderRole === 'SYSTEM' ? 'System' : 'Support'}
                      </span>{' '}
                      — {msg.content}
                    </p>
                    <p className="mt-0.5 text-xs text-surface-400">
                      {formatRelativeTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
