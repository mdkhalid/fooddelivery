import { useState, useMemo } from 'react'
import { Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import { formatCurrency, formatDate } from '@/utils/format'

interface Invoice {
  id: string
  orderNumber: string
  invoiceNumber: string
  amount: number
  tax: number
  total: number
  currency: string
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  dueDate: string
  createdAt: string
}

interface InvoiceListProps {
  invoices: Invoice[]
  onDownload: (id: string) => void
  isDownloading?: boolean
}

type SortField = 'createdAt' | 'total'
type SortOrder = 'asc' | 'desc'

const STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'success' | 'error' | 'info' | 'default' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  PAID: { label: 'Paid', variant: 'success' },
  OVERDUE: { label: 'Overdue', variant: 'error' },
  CANCELLED: { label: 'Cancelled', variant: 'default' },
}

const PAGE_SIZE = 10

export default function InvoiceList({ invoices, onDownload, isDownloading }: InvoiceListProps) {
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const sorted = useMemo(() => {
    return [...invoices].sort((a, b) => {
      const valA = sortField === 'createdAt' ? new Date(a.createdAt).getTime() : a.total
      const valB = sortField === 'createdAt' ? new Date(b.createdAt).getTime() : b.total
      return sortOrder === 'asc' ? valA - valB : valB - valA
    })
  }, [invoices, sortField, sortOrder])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-surface-400" />
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-brand-500" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-brand-500" />
    )
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-surface-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-surface-100 bg-surface-50">
              <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Invoice
              </th>
              <th
                className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort('createdAt')}
              >
                <div className="flex items-center gap-1.5">
                  Date
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort('total')}
              >
                <div className="flex items-center gap-1.5">
                  Amount
                  <SortIcon field="total" />
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {paginated.map((invoice) => {
              const statusConfig = STATUS_CONFIG[invoice.status] ?? {
                label: invoice.status,
                variant: 'default' as const,
              }

              return (
                <tr key={invoice.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-surface-700">
                      #{invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-surface-400">
                      Order #{invoice.orderNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-surface-600">{formatDate(invoice.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-surface-900">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </p>
                    {invoice.tax > 0 && (
                      <p className="text-xs text-surface-400">
                        Tax: {formatCurrency(invoice.tax, invoice.currency)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={statusConfig.variant} size="sm">
                      {statusConfig.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(invoice.id)}
                      disabled={isDownloading}
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      PDF
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-4"
      />
    </div>
  )
}
