import { useState } from 'react'
import { Wallet, Plus } from 'lucide-react'
import { useWalletInfo, useTopUpWallet } from '@/hooks/useWallet'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import TransactionList from './components/TransactionList'
import { formatCurrency } from '@/utils/format'
import { toastSuccess, toastError } from '@/components/ui'
import type { WalletTransaction } from '@/types/user.types'
import type { ApiResponse } from '@/types/api.types'

export default function WalletPage() {
  const { data: wallet, isLoading: isWalletLoading } = useWalletInfo()
  const topUp = useTopUpWallet()

  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')

  const { data: transactions = [], isLoading: isTxLoading } = useQuery({
    queryKey: ['walletTransactions'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<WalletTransaction[]>>('/wallet/transactions')
      return data.data ?? []
    },
    staleTime: 60 * 1000,
  })

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) {
      toastError('Please enter a valid amount')
      return
    }
    if (amount > 10000) {
      toastError('Maximum top-up is $10,000')
      return
    }

    try {
      await topUp.mutateAsync({ amount })
      toastSuccess(`Successfully topped up ${formatCurrency(amount)}`)
      setShowTopUp(false)
      setTopUpAmount('')
    } catch {
      toastError('Top-up failed. Please try again.')
    }
  }

  const PRESET_AMOUNTS = [10, 25, 50, 100]

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold text-surface-900">Wallet</h1>

        {/* Balance Card */}
        <Card padding="lg" className="mb-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          {isWalletLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner className="h-8 w-8 text-white/60" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-white/70">
                <Wallet className="h-5 w-5" />
                <span className="text-sm font-medium">Available Balance</span>
              </div>
              <p className="mt-2 font-display text-4xl font-bold">
                {formatCurrency(wallet?.balance ?? 0, wallet?.currency ?? 'USD')}
              </p>
              <Button
                className="mt-4 bg-white/20 text-white hover:bg-white/30"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setShowTopUp(true)}
              >
                Top Up
              </Button>
            </>
          )}
        </Card>

        {/* Transaction History */}
        <div>
          <h2 className="mb-4 text-sm font-semibold text-surface-900">Transaction History</h2>
          {isTxLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner className="h-6 w-6 text-surface-400" />
            </div>
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </div>
      </div>

      {/* Top Up Modal */}
      <Modal
        open={showTopUp}
        onClose={() => {
          setShowTopUp(false)
          setTopUpAmount('')
        }}
        title="Top Up Wallet"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setShowTopUp(false)
                setTopUpAmount('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTopUp}
              loading={topUp.isPending}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Top Up
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            min="1"
            max="10000"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            leftIcon={<Wallet className="h-4 w-4" />}
          />
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setTopUpAmount(String(amount))}
                className="rounded-full border border-surface-200 bg-white px-4 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:border-brand-300 hover:text-brand-600"
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
