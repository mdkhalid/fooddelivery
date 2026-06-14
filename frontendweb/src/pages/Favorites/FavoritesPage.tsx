import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { useRestaurantList } from '@/hooks/useRestaurants'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { Link } from 'react-router-dom'
import RestaurantCard from '@/pages/Home/components/RestaurantCard'
import type { Restaurant } from '@/types/restaurant.types'

export default function FavoritesPage() {
  const { favorites } = useFavorites()

  const { data, isLoading } = useRestaurantList({ limit: 100 })

  const allRestaurants = data?.data ?? []
  const favoriteRestaurants = allRestaurants.filter((r: Restaurant) => favorites.includes(r.id))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-surface-900">My Favorites</h1>
          <p className="mt-1 text-sm text-surface-500">
            {favoriteRestaurants.length > 0
              ? `${favoriteRestaurants.length} favorite restaurant${favoriteRestaurants.length !== 1 ? 's' : ''}`
              : 'Your favorite restaurants'}
          </p>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-16 w-16" />}
            title="No favorites yet"
            description="Browse restaurants and tap the heart to save your favorites!"
            action={
              <Link to="/restaurants">
                <Button variant="primary">Browse Restaurants</Button>
              </Link>
            }
          />
        ) : favoriteRestaurants.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-16 w-16" />}
            title="Favorites not found"
            description="Some of your favorite restaurants may no longer be available."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteRestaurants.map((restaurant: Restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
