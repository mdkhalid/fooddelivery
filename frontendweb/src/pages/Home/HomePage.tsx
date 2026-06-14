import { useState, useMemo } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { useRestaurantList } from '@/hooks/useRestaurants'
import { useGeolocation } from '@/hooks/useGeolocation'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonRestaurant } from '@/components/ui/Skeleton'
import HeroBanner from './components/HeroBanner'
import CuisineFilter from './components/CuisineFilter'
import FeaturedRow from './components/FeaturedRow'
import RestaurantCard from './components/RestaurantCard'
import type { Restaurant } from '@/types/restaurant.types'

export default function HomePage() {
  const [selectedCuisine, setSelectedCuisine] = useState('all')
  const { latitude, longitude } = useGeolocation()

  const { data, isLoading } = useRestaurantList({
    lat: latitude ?? undefined,
    lng: longitude ?? undefined,
    cuisine: selectedCuisine === 'all' ? undefined : selectedCuisine,
    limit: 20,
  })

  const restaurants = data?.data ?? []

  const featuredRestaurants = useMemo(
    () => restaurants.filter((r: Restaurant) => r.isFeatured || r.rating.average >= 4.5),
    [restaurants],
  )

  return (
    <div className="min-h-screen bg-surface-50">
      <HeroBanner />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <CuisineFilter selected={selectedCuisine} onSelect={setSelectedCuisine} />
      </section>

      {isLoading ? (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-surface-200" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonRestaurant key={i} />
            ))}
          </div>
        </section>
      ) : restaurants.length === 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            icon={<UtensilsCrossed className="h-16 w-16" />}
            title="No restaurants near you"
            description="We couldn't find any restaurants in your area. Try adjusting your location or filters."
          />
        </section>
      ) : (
        <>
          {featuredRestaurants.length > 0 && selectedCuisine === 'all' && (
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <FeaturedRow
                title="Top Rated Near You"
                restaurants={featuredRestaurants}
              />
            </section>
          )}

          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="mb-6 font-display text-xl font-bold text-surface-900 sm:text-2xl">
              {selectedCuisine === 'all' ? 'All Restaurants' : `${selectedCuisine.charAt(0).toUpperCase() + selectedCuisine.slice(1)} Restaurants`}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {restaurants.map((restaurant: Restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
