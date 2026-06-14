import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Compass, ShoppingCart, ArrowRight } from 'lucide-react';
import { useRecommendedRestaurants, usePopularNearYou, useTrySomethingNew } from '@/hooks/useRecommendations';
import { useCartStore } from '@/stores/cartStore';
import { EmptyState, Button, SkeletonRestaurant } from '@/components/ui';
import PersonalizedRow from './components/PersonalizedRow';
import PopularNearYou from './components/PopularNearYou';
import TrySomethingNew from './components/TrySomethingNew';

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 bg-surface-200 rounded-lg animate-pulse" />
        <div className="h-4 w-16 bg-surface-200 rounded animate-pulse" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonRestaurant key={i} className="w-64 shrink-0" />
        ))}
      </div>
    </div>
  );
}

export default function RecommendedPage() {
  const navigate = useNavigate();
  const { data: personalized, isLoading: loadingPersonalized } = useRecommendedRestaurants();
  const { data: popular, isLoading: loadingPopular } = usePopularNearYou();
  const { data: somethingNew, isLoading: loadingNew } = useTrySomethingNew();
  const cartItems = useCartStore((s) => s.items);

  const hasCartItems = cartItems.length > 0;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-800">Based on Your Taste</h2>
              <p className="text-sm text-surface-500">Restaurants we think you'll love</p>
            </div>
          </div>
          {loadingPersonalized ? (
            <SectionSkeleton />
          ) : personalized && personalized.length > 0 ? (
            <PersonalizedRow restaurants={personalized} />
          ) : (
            <EmptyState
              icon={<Sparkles className="h-8 w-8" />}
              title="No personalized recommendations yet"
              description="Order a few meals and we'll learn your taste!"
              action={
                <Button variant="secondary" onClick={() => navigate('/taste')}>
                  Set up your taste profile
                </Button>
              }
            />
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-800">Popular Near You</h2>
              <p className="text-sm text-surface-500">Trending restaurants in your area</p>
            </div>
          </div>
          {loadingPopular ? (
            <SectionSkeleton />
          ) : popular && popular.length > 0 ? (
            <PopularNearYou restaurants={popular} />
          ) : (
            <EmptyState
              icon={<TrendingUp className="h-8 w-8" />}
              title="No popular restaurants yet"
              description="We're still gathering data for your area."
            />
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Compass className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-800">Try Something New</h2>
              <p className="text-sm text-surface-500">A fresh suggestion just for you</p>
            </div>
          </div>
          {loadingNew ? (
            <div className="h-56 bg-surface-200 rounded-2xl animate-pulse" />
          ) : somethingNew && somethingNew.length > 0 ? (
            <TrySomethingNew restaurant={somethingNew[0]!} />
          ) : (
            <EmptyState
              icon={<Compass className="h-8 w-8" />}
              title="Nothing new to suggest"
              description="Check back later for fresh picks!"
            />
          )}
        </section>

        {hasCartItems && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-surface-800">Frequently Bought Together</h2>
                <p className="text-sm text-surface-500">Pairs well with your current cart</p>
              </div>
            </div>
            <EmptyState
              icon={<ShoppingCart className="h-8 w-8" />}
              title="No suggestions for your cart yet"
              description="Add items to your cart and we'll suggest perfect pairings."
              action={
                <Button variant="secondary" onClick={() => navigate('/')}>
                  Browse restaurants
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              }
            />
          </section>
        )}
      </div>
    </div>
  );
}
