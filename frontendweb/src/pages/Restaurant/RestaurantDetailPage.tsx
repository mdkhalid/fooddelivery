import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import { useRestaurantDetail } from '@/hooks/useRestaurants'
import { useMenu } from '@/hooks/useMenu'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'
import { useGeolocation } from '@/hooks/useGeolocation'
import Tabs from '@/components/ui/Tabs'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  Info,
  ShoppingCart,
  ArrowLeft,
  Star,
  MapPin,
  Heart,
} from 'lucide-react'
import RestaurantInfo from './components/RestaurantInfo'
import MenuCategory from './components/MenuCategory'
import ModifierSelector from './components/ModifierSelector'
import type { MenuItem } from '@/types/menu.types'

const TABS = [
  { key: 'menu', label: 'Menu' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'info', label: 'Info' },
]

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  useGeolocation()

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurantDetail(id ?? '')
  const { data: menu, isLoading: isLoadingMenu } = useMenu(id ?? '')
  const { items: cartItems, restaurant: cartRestaurant } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  const [activeTab, setActiveTab] = useState('menu')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const isFromThisRestaurant = cartRestaurant?.id === id
  const cartItemCount = isFromThisRestaurant ? cartItems.reduce((s, i) => s + i.quantity, 0) : 0

  const isOpenNow = useMemo(() => {
    if (!restaurant?.operatingHours) return false
    const now = new Date()
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    const today = dayNames[now.getDay()]
    const hours = restaurant.operatingHours.find((h) => h.dayOfWeek === today)
    if (!hours || hours.isClosed) return false

    const [openH = 0, openM = 0] = hours.openTime.split(':').map(Number)
    const [closeH = 0, closeM = 0] = hours.closeTime.split(':').map(Number)
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const openMinutes = openH * 60 + openM
    const closeMinutes = closeH * 60 + closeM

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes
  }, [restaurant])

  if (isLoadingRestaurant) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Skeleton variant="rect" className="h-[300px] w-full rounded-none" />
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <Skeleton variant="text" className="h-8 w-1/2" />
          <Skeleton variant="text" className="h-5 w-2/3" />
          <div className="flex gap-4">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-4 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <EmptyState
          icon={<Info className="h-12 w-12" />}
          title="Restaurant not found"
          description="The restaurant you're looking for doesn't exist or has been removed."
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              Go Home
            </Button>
          }
        />
      </div>
    )
  }

  const sortedCategories = menu?.categories
    ?.filter((c) => c.isActive)
    ?.sort((a, b) => a.displayOrder - b.displayOrder) ?? []

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      {/* Cover Image */}
      <div className="relative h-[300px] w-full overflow-hidden bg-surface-200">
        {restaurant.coverImageUrl ? (
          <img
            src={restaurant.coverImageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-500 to-brand-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all hover:bg-white hover:shadow-lg active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-surface-900" />
        </button>

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(restaurant.id)}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all hover:bg-white hover:shadow-lg active:scale-95"
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              isFavorite(restaurant.id)
                ? 'fill-red-500 text-red-500'
                : 'text-surface-600'
            )}
          />
        </button>

        {/* Open/Closed badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold backdrop-blur-sm',
              isOpenNow
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            )}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isOpenNow ? 'bg-white animate-pulse' : 'bg-white/60'
              )}
            />
            {isOpenNow ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="max-w-3xl mx-auto px-4">
        <RestaurantInfo
          restaurant={restaurant}
          isOpenNow={isOpenNow}
          isFavorited={isFavorite(restaurant.id)}
          onToggleFavorite={() => toggleFavorite(restaurant.id)}
        />
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-surface-100 mt-4">
        <div className="max-w-3xl mx-auto px-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'menu' && (
          <div className="space-y-2">
            {isLoadingMenu ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton variant="text" className="h-6 w-32" />
                    {Array.from({ length: 2 }).map((_, j) => (
                      <Skeleton key={j} variant="rect" className="h-24" />
                    ))}
                  </div>
                ))}
              </div>
            ) : sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <MenuCategory
                  key={category.id}
                  category={category}
                  onItemSelect={setSelectedItem}
                />
              ))
            ) : (
              <EmptyState
                icon={<Info className="h-12 w-12" />}
                title="No menu available"
                description="This restaurant hasn't added their menu yet."
              />
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <EmptyState
            icon={<Star className="h-12 w-12" />}
            title="Reviews coming soon"
            description="Customer reviews will appear here."
          />
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            {restaurant.description && (
              <div className="rounded-2xl bg-white border border-surface-100 p-5">
                <h3 className="text-sm font-semibold text-surface-900 mb-2">About</h3>
                <p className="text-sm text-surface-600 leading-relaxed">
                  {restaurant.description}
                </p>
              </div>
            )}
            <div className="rounded-2xl bg-white border border-surface-100 p-5">
              <h3 className="text-sm font-semibold text-surface-900 mb-3">Address</h3>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-surface-400 mt-0.5 shrink-0" />
                <p className="text-sm text-surface-600">
                  {restaurant.address.streetAddress}
                  <br />
                  {restaurant.address.city}, {restaurant.address.state}{' '}
                  {restaurant.address.zipCode}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-surface-100 p-5">
              <h3 className="text-sm font-semibold text-surface-900 mb-3">
                Operating Hours
              </h3>
              <div className="space-y-2">
                {restaurant.operatingHours.map((hours) => (
                  <div key={hours.dayOfWeek} className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 capitalize">
                      {hours.dayOfWeek.toLowerCase()}
                    </span>
                    <span className="font-medium text-surface-900">
                      {hours.isClosed
                        ? 'Closed'
                        : `${hours.openTime} - ${hours.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {restaurant.phone && (
              <div className="rounded-2xl bg-white border border-surface-100 p-5">
                <h3 className="text-sm font-semibold text-surface-900 mb-2">Contact</h3>
                <p className="text-sm text-surface-600">{restaurant.phone}</p>
                {restaurant.email && (
                  <p className="text-sm text-surface-600 mt-1">{restaurant.email}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating View Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-surface-50 via-surface-50 to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/cart')}
              leftIcon={<ShoppingCart className="h-5 w-5" />}
              className="shadow-glow-brand"
            >
              <span>View Cart</span>
              <span className="ml-2 rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-bold">
                {cartItemCount}
              </span>
              <span className="ml-auto">{formatCurrency(0)}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Modifier Selection Modal */}
      <ModifierSelector
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        restaurant={restaurant}
      />
    </div>
  )
}
