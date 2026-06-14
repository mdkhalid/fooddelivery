import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, MapPin, ShoppingBag, Star, MoreVertical,
  Eye, Pencil, UtensilsCrossed, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency, formatRating } from '@/utils/format'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Branch {
  id: string
  name: string
  address: string
  city: string
  phone: string
  status: 'open' | 'closed'
  todayOrders: number
  todayRevenue: number
  rating: number
  totalRatings: number
}

const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Downtown Main',
    address: '123 Main St',
    city: 'New York, NY',
    phone: '(555) 123-4567',
    status: 'open',
    todayOrders: 45,
    todayRevenue: 1250,
    rating: 4.8,
    totalRatings: 342,
  },
  {
    id: '2',
    name: 'Westside Plaza',
    address: '456 West Ave',
    city: 'New York, NY',
    phone: '(555) 234-5678',
    status: 'open',
    todayOrders: 32,
    todayRevenue: 890,
    rating: 4.5,
    totalRatings: 189,
  },
  {
    id: '3',
    name: 'Eastgate Mall',
    address: '789 East Blvd',
    city: 'Brooklyn, NY',
    phone: '(555) 345-6789',
    status: 'closed',
    todayOrders: 0,
    todayRevenue: 0,
    rating: 4.3,
    totalRatings: 98,
  },
  {
    id: '4',
    name: 'University District',
    address: '321 College Rd',
    city: 'New York, NY',
    phone: '(555) 456-7890',
    status: 'open',
    todayOrders: 38,
    todayRevenue: 1020,
    rating: 4.7,
    totalRatings: 267,
  },
  {
    id: '5',
    name: 'Airport Terminal',
    address: '1 Terminal Way',
    city: 'Queens, NY',
    phone: '(555) 567-8901',
    status: 'closed',
    todayOrders: 0,
    todayRevenue: 0,
    rating: 4.1,
    totalRatings: 54,
  },
]

export default function VendorBranchesPage() {
  const navigate = useNavigate()
  const [branches] = useState<Branch[]>(mockBranches)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const handleToggleStatus = (branch: Branch) => {
    setTogglingId(branch.id)
  }

  if (branches.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="h-12 w-12" />}
        title="Create your first branch"
        description="Start by adding a branch location to manage your food delivery business."
        action={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/vendor/branches/new')}
          >
            Add Branch
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Branches</h2>
          <p className="text-sm text-gray-500 mt-1">{branches.length} total branch{branches.length !== 1 ? 'es' : ''}</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/vendor/branches/new')}
        >
          Add Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <Card key={branch.id} hover className="relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{branch.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{branch.address}, {branch.city}</span>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setMenuOpenId(menuOpenId === branch.id ? null : branch.id)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpenId === branch.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20">
                      <button
                        onClick={() => { navigate(`/vendor/branches/${branch.id}`); setMenuOpenId(null) }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                      <button
                        onClick={() => { navigate(`/vendor/branches/${branch.id}/edit`); setMenuOpenId(null) }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="w-4 h-4" /> Edit Branch
                      </button>
                      <button
                        onClick={() => { navigate(`/vendor/branches/${branch.id}/menu`); setMenuOpenId(null) }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <UtensilsCrossed className="w-4 h-4" /> Manage Menu
                      </button>
                      <button
                        onClick={() => { navigate(`/vendor/orders?branch=${branch.id}`); setMenuOpenId(null) }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ShoppingBag className="w-4 h-4" /> View Orders
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Status & Stats */}
            <div className="flex items-center gap-3 mb-3">
              <Badge variant={branch.status === 'open' ? 'success' : 'default'} dot>
                {branch.status === 'open' ? 'Open' : 'Closed'}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{formatRating(branch.rating)}</span>
                <span className="text-gray-400">({branch.totalRatings})</span>
              </div>
            </div>

            {/* Today's Stats */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Today's Orders</p>
                <p className="text-lg font-bold text-gray-900">{branch.todayOrders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Today's Revenue</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(branch.todayRevenue)}</p>
              </div>
            </div>

            {/* Toggle Status */}
            <button
              onClick={() => handleToggleStatus(branch)}
              className={cn(
                'mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center',
                branch.status === 'open'
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {branch.status === 'open' ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
              {branch.status === 'open' ? 'Close Branch' : 'Open Branch'}
            </button>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!togglingId}
        onClose={() => setTogglingId(null)}
        onConfirm={() => setTogglingId(null)}
        title="Toggle Branch Status"
        message="Are you sure you want to change this branch's status?"
        confirmLabel="Confirm"
      />
    </div>
  )
}
