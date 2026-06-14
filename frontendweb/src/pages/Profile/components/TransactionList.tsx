import { ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react'
import { cn } from '@/utils/cn'
import EmptyState from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/utils/format'
import { WalletTransactionType } from '@/types/user.types'
import type { WalletTransaction } from '@/types/user.types'

interface TransactionListProps {
  transactions: WalletTransaction[]
}

const CREDIT_TYPES = new Set([
  WalletTransactionType.CREDIT,
  WalletTransactionType.REFUND,
  WalletTransactionType.TOPUP,
])

const TYPE_LABELS: Record<string, string> = {
  [WalletTransactionType.CREDIT]: 'Credit',
  [WalletTransactionType.DEBIT]: 'Payment',
  [WalletTransactionType.REFUND]: 'Refund',
  [WalletTransactionType.TOPUP]: 'Top Up',
  [WalletTransactionType.WITHDRAWAL]: 'Withdrawal',
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-12 w-12" />}
        title="No transactions yet"
        description="Your wallet transaction history will appear here."
      />
    )
  }

  return (
    <div className="divide-y divide-surface-100 rounded-2xl border border-surface-100 bg-white">
      {transactions.map((tx) => {
        const isCredit = CREDIT_TYPES.has(tx.type)

        return (
          <div key={tx.id} className="flex items-center gap-3 p-4">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500',
              )}
            >
              {isCredit ? (
                <ArrowDownLeft className="h-5 w-5" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-900 truncate">{tx.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-surface-400">{formatDate(tx.createdAt)}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                    isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500',
                  )}
                >
                  {TYPE_LABELS[tx.type] ?? tx.type}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p
                className={cn(
                  'text-sm font-semibold',
                  isCredit ? 'text-green-600' : 'text-red-500',
                )}
              >
                {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
              <p className="text-[10px] text-surface-300">
                Bal: {formatCurrency(tx.balanceAfter)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
