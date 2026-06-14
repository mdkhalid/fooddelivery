import { useState } from 'react'
import { Receipt, Download, Building2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { useInvoiceList, useDownloadInvoice } from '@/hooks/useInvoices'
import { formatCurrency } from '@/utils/format'
import InvoiceList from './components/InvoiceList'
import TaxIdForm from './components/TaxIdForm'

const TABS = [
  { key: 'invoices', label: 'Invoices' },
  { key: 'statements', label: 'Monthly Statements' },
  { key: 'tax', label: 'Tax ID' },
]

export default function InvoicePage() {
  const [activeTab, setActiveTab] = useState('invoices')
  const { data: invoices, isLoading } = useInvoiceList()
  const downloadMutation = useDownloadInvoice()

  const invoiceList = invoices ?? []

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-surface-900">Invoices</h1>
          <p className="mt-1 text-sm text-surface-500">Manage your invoices and tax information</p>
        </div>

        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {activeTab === 'invoices' && (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Spinner size="lg" />
              </div>
            ) : invoiceList.length === 0 ? (
              <EmptyState
                icon={<Receipt className="h-16 w-16" />}
                title="No invoices yet"
                description="Your order invoices will appear here once you place an order."
              />
            ) : (
              <InvoiceList
                invoices={invoiceList}
                onDownload={(id) => downloadMutation.mutate(id)}
                isDownloading={downloadMutation.isPending}
              />
            )}
          </div>
        )}

        {activeTab === 'statements' && (
          <Card padding="md">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-5 w-5 text-surface-400" />
              <h2 className="text-sm font-semibold text-surface-700">Monthly Statements</h2>
            </div>
            <p className="text-sm text-surface-500 mb-6">
              Download monthly summaries for your records. Available for vendor accounts.
            </p>
            {invoiceList.length > 0 ? (
              <div className="space-y-3">
                {getMonthlyStatements(invoiceList).map((stmt) => (
                  <div
                    key={stmt.month}
                    className="flex items-center justify-between rounded-xl border border-surface-100 p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-surface-700">{stmt.month}</p>
                      <p className="text-xs text-surface-400">
                        {stmt.count} invoice{stmt.count !== 1 ? 's' : ''} · Total: {formatCurrency(stmt.total)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-400 text-center py-8">
                No statements available yet
              </p>
            )}
          </Card>
        )}

        {activeTab === 'tax' && (
          <TaxIdForm />
        )}
      </div>
    </div>
  )
}

function getMonthlyStatements(invoices: { createdAt: string; total: number }[]) {
  const map = new Map<string, { count: number; total: number }>()

  invoices.forEach((inv) => {
    const d = new Date(inv.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const existing = map.get(key) ?? { count: 0, total: 0 }
    map.set(key, {
      count: existing.count + 1,
      total: existing.total + inv.total,
    })
  })

  return Array.from(map.entries())
    .map(([key, value]) => {
      const [year, month] = key.split('-')
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      })
      return { month: monthName, ...value }
    })
    .sort((a, b) => b.month.localeCompare(a.month))
}
