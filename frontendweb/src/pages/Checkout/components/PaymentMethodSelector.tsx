import { useState, useCallback } from 'react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import {
  CreditCard,
  Wallet,
  Banknote,
  Plus,
  CheckCircle,
  Smartphone,
} from 'lucide-react'
import type { PaymentMethod } from '@/types/payment.types'

interface PaymentMethodSelectorProps {
  selectedMethodId: string | null
  onSelect: (id: string | null) => void
  useWallet: boolean
  onToggleWallet: (use: boolean) => void
  walletBalance: number
  orderTotal: number
}

const paymentTypeIcons: Record<string, typeof CreditCard> = {
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
  WALLET: Wallet,
  CASH_ON_DELIVERY: Banknote,
  BANK_TRANSFER: Banknote,
  DIGITAL_WALLET: Smartphone,
}

export default function PaymentMethodSelector({
  selectedMethodId,
  onSelect,
  useWallet,
  onToggleWallet,
  walletBalance,
  orderTotal,
}: PaymentMethodSelectorProps) {
  const [showModal, setShowModal] = useState(false)

  // Mock payment methods - in real app these come from API
  const savedMethods: PaymentMethod[] = []

  const selectedMethod = savedMethods.find((m) => m.id === selectedMethodId)

  const handleSelect = useCallback(
    (id: string | null) => {
      onSelect(id)
      setShowModal(false)
    },
    [onSelect]
  )

  const getMethodLabel = (method: PaymentMethod) => {
    if (method.card) {
      return `${method.card.cardType} •••• ${method.card.last4Digits}`
    }
    if (method.digitalWallet) {
      return method.digitalWallet.provider.replace('_', ' ')
    }
    return method.type.replace('_', ' ')
  }

  const getMethodIcon = (method: PaymentMethod) => {
    const Icon = paymentTypeIcons[method.type] ?? CreditCard
    return <Icon className="h-5 w-5" />
  }

  return (
    <>
      <section className="rounded-2xl bg-white border border-surface-100 p-5">
        <h2 className="text-sm font-bold text-surface-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-brand-500" />
          Payment Method
        </h2>

        <div className="space-y-3">
          {/* Wallet Option */}
          {walletBalance > 0 && (
            <button
              onClick={() => onToggleWallet(!useWallet)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                useWallet
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-surface-200 hover:border-surface-300'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  useWallet ? 'bg-brand-100' : 'bg-surface-100'
                )}
              >
                <Wallet
                  className={cn(
                    'h-5 w-5',
                    useWallet ? 'text-brand-600' : 'text-surface-500'
                  )}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-surface-900">Wallet Balance</p>
                <p className="text-xs text-surface-500">
                  {formatCurrency(walletBalance)} available
                </p>
              </div>
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
                  useWallet
                    ? 'border-brand-500 bg-brand-500'
                    : 'border-surface-300'
                )}
              >
                {useWallet && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          )}

          {/* Saved Payment Methods */}
          {savedMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                selectedMethodId === method.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-surface-200 hover:border-surface-300'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  selectedMethodId === method.id
                    ? 'bg-brand-100'
                    : 'bg-surface-100'
                )}
              >
                {getMethodIcon(method)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900 truncate">
                  {getMethodLabel(method)}
                </p>
                {method.card && (
                  <p className="text-xs text-surface-500">
                    Exp {method.card.expiryMonth}/{method.card.expiryYear}
                  </p>
                )}
              </div>
              {selectedMethodId === method.id && (
                <CheckCircle className="h-5 w-5 text-brand-500 shrink-0" />
              )}
            </button>
          ))}

          {/* Cash on Delivery */}
          <button
            onClick={() => handleSelect('cod')}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
              selectedMethodId === 'cod'
                ? 'border-brand-500 bg-brand-50'
                : 'border-surface-200 hover:border-surface-300'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                selectedMethodId === 'cod' ? 'bg-brand-100' : 'bg-surface-100'
              )}
            >
              <Banknote
                className={cn(
                  'h-5 w-5',
                  selectedMethodId === 'cod'
                    ? 'text-brand-600'
                    : 'text-surface-500'
                )}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-surface-900">
                Cash on Delivery
              </p>
              <p className="text-xs text-surface-500">Pay when your order arrives</p>
            </div>
            {selectedMethodId === 'cod' && (
              <CheckCircle className="h-5 w-5 text-brand-500 shrink-0" />
            )}
          </button>

          {/* Add New Card */}
          <button
            onClick={() => setShowModal(true)}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-surface-200 p-4 text-left transition-all hover:border-brand-300 hover:bg-brand-50/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-100">
              <Plus className="h-5 w-5 text-surface-500" />
            </div>
            <span className="text-sm font-medium text-surface-700">
              Add new card
            </span>
          </button>
        </div>

        {/* Selected Summary */}
        {selectedMethod && (
          <div className="mt-4 rounded-xl bg-surface-50 p-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-brand-500 shrink-0" />
            <span className="text-xs text-surface-600">
              Paying with{' '}
              <span className="font-semibold text-surface-900">
                {getMethodLabel(selectedMethod)}
              </span>
            </span>
          </div>
        )}

        {useWallet && (
          <div className="mt-3 rounded-xl bg-brand-50 p-3 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-brand-600 shrink-0" />
            <span className="text-xs text-brand-700">
              Using wallet balance ({formatCurrency(Math.min(walletBalance, orderTotal))})
              {walletBalance < orderTotal && (
                <span className="text-brand-500">
                  {' '}
                  + {formatCurrency(orderTotal - walletBalance)} from other method
                </span>
              )}
            </span>
          </div>
        )}
      </section>

      {/* Add Card Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add Payment Method"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-surface-50 p-8 text-center">
            <CreditCard className="h-12 w-12 text-surface-300 mx-auto mb-3" />
            <p className="text-sm text-surface-600">
              Card input form would be integrated here with Stripe or similar payment
              provider.
            </p>
          </div>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  )
}
