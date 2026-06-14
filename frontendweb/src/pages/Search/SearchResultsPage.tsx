import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Star, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency, formatRating } from '@/utils/format';
import { useRestaurantList } from '@/hooks/useRestaurants';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Button,
  Card,
  EmptyState,
  SearchInput,
  SkeletonRestaurant,
  Badge,
  Select,
} from '@/components/ui';
import type { Restaurant } from '@/types/restaurant.types';

const CUISINES = [
  'All', 'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Thai',
  'American', 'Mediterranean', 'Korean', 'Vietnamese', 'Ethiopian',
];

const PRICE_RANGES = [
  { value: '', label: 'Any Price' },
  { value: '1', label: '$' },
  { value: '2', label: '$$' },
  { value: '3', label: '$$$' },
  { value: '4', label: '$$$$' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'deliveryTime', label: 'Fastest Delivery' },
  { value: 'distance', label: 'Nearest' },
  { value: 'popularity', label: 'Most Popular' },
];

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '4.5', label: '4.5+ Stars' },
  { value: '4', label: '4+ Stars' },
  { value: '3.5', label: '3.5+ Stars' },
];

function suggestCorrection(query: string): string | null {
  const common: Record<string, string> = {
    piza: 'pizza',
    burgger: 'burger',
    sushhi: 'sushi',
    taccos: 'tacos',
    nudles: 'noodles',
    chiken: 'chicken',
    sandwitch: 'sandwich',
    pastaa: 'pasta',
    burritto: 'burrito',
  };
  const lower = query.toLowerCase().trim();
  return common[lower] || null;
}

interface FilterSidebarProps {
  cuisine: string;
  onCuisineChange: (c: string) => void;
  priceRange: string;
  onPriceRangeChange: (p: string) => void;
  minRating: string;
  onMinRatingChange: (r: string) => void;
  sortBy: string;
  onSortByChange: (s: string) => void;
}

function FilterSidebar({
  cuisine,
  onCuisineChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
}: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <Card padding="lg" className="sticky top-24 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Sort By</h3>
          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Cuisine</h3>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((c) => (
              <button
                key={c}
                onClick={() => onCuisineChange(c === 'All' ? '' : c)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                  (c === 'All' && !cuisine) || cuisine === c
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Price Range</h3>
          <div className="flex gap-2">
            {PRICE_RANGES.map((p) => (
              <button
                key={p.value}
                onClick={() => onPriceRangeChange(p.value)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  (p.value === '' && !priceRange) || priceRange === p.value
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Rating</h3>
          <Select
            options={RATING_OPTIONS}
            value={minRating}
            onChange={(e) => onMinRatingChange(e.target.value)}
          />
        </div>
      </Card>
    </aside>
  );
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${restaurant.slug}`}>
      <Card hover clickable className="overflow-hidden h-full">
        <div className="relative h-44 -mx-5 -mt-5 mb-4 overflow-hidden">
          {restaurant.coverImageUrl ? (
            <img
              src={restaurant.coverImageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {restaurant.estimatedDeliveryTime > 0 && (
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              {restaurant.estimatedDeliveryTime} min
            </div>
          )}
          {restaurant.deliveryFee === 0 && (
            <Badge variant="success" className="absolute top-2 right-2">
              Free Delivery
            </Badge>
          )}
        </div>
        <div className="space-y-1.5">
          <h3 className="font-semibold text-surface-800 truncate">{restaurant.name}</h3>
          {restaurant.tags.length > 0 && (
            <p className="text-xs text-surface-500 truncate">
              {restaurant.tags.slice(0, 3).join(' · ')}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-surface-600">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {formatRating(restaurant.rating.average)}
            </span>
            <span className="text-surface-300">·</span>
            <span>({restaurant.rating.totalReviews})</span>
            <span className="text-surface-300">·</span>
            <span>{formatCurrency(restaurant.minimumOrderAmount)} min</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonRestaurant key={i} />
      ))}
    </div>
  );
}

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data, isLoading } = useRestaurantList({
    search: debouncedQuery || undefined,
    cuisine: cuisine || undefined,
    sort: sortBy as 'rating' | 'deliveryTime' | 'distance' | 'popularity',
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (cuisine) params.set('cuisine', cuisine);
    if (priceRange) params.set('price', priceRange);
    if (minRating) params.set('rating', minRating);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, cuisine, priceRange, minRating, sortBy, setSearchParams]);

  const suggestion = useMemo(() => {
    if (debouncedQuery && !isLoading && (!data || data.data.length === 0)) {
      return suggestCorrection(debouncedQuery);
    }
    return null;
  }, [debouncedQuery, isLoading, data]);

  const filteredResults = useMemo(() => {
    if (!data?.data) return [];
    let results = data.data;
    if (priceRange) {
      const maxPrice = parseInt(priceRange);
      results = results.filter((r) => {
        const avgPrice = r.minimumOrderAmount;
        if (maxPrice === 1) return avgPrice < 15;
        if (maxPrice === 2) return avgPrice >= 15 && avgPrice < 30;
        if (maxPrice === 3) return avgPrice >= 30 && avgPrice < 50;
        return avgPrice >= 50;
      });
    }
    if (minRating) {
      const min = parseFloat(minRating);
      results = results.filter((r) => r.rating.average >= min);
    }
    return results;
  }, [data, priceRange, minRating]);

  const resultCount = filteredResults.length;
  const totalPages = data?.meta ? Math.ceil(data.meta.total / (data.meta.limit || 20)) : 1;

  const activeFilters = [cuisine, priceRange, minRating].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchInput
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={setSearchQuery}
                autoFocus
              />
            </div>
            <Button
              variant="secondary"
              size="md"
              className="lg:hidden"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="lg:hidden bg-white border-b border-surface-100 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-surface-700 mb-2">Sort By</h3>
              <Select
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-700 mb-2">Cuisine</h3>
              <div className="flex flex-wrap gap-2">
                {CUISINES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCuisine(c === 'All' ? '' : c)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                      (c === 'All' && !cuisine) || cuisine === c
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-100 text-surface-600',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-surface-700 mb-2">Price</h3>
                <div className="flex gap-1">
                  {PRICE_RANGES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriceRange(p.value)}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-xs font-medium transition-all',
                        (p.value === '' && !priceRange) || priceRange === p.value
                          ? 'bg-brand-500 text-white'
                          : 'bg-surface-100 text-surface-600',
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-surface-700 mb-2">Rating</h3>
                <Select
                  options={RATING_OPTIONS}
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                />
              </div>
            </div>
            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCuisine('');
                  setPriceRange('');
                  setMinRating('');
                }}
                leftIcon={<X className="h-3.5 w-3.5" />}
              >
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          <FilterSidebar
            cuisine={cuisine}
            onCuisineChange={setCuisine}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />

          <main className="flex-1 min-w-0">
            {debouncedQuery && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-surface-600">
                  {isLoading ? (
                    <span className="inline-block h-4 w-32 bg-surface-200 rounded animate-pulse" />
                  ) : (
                    <>
                      <span className="font-medium text-surface-800">{resultCount}</span>
                      {' '}result{resultCount !== 1 ? 's' : ''} for{' '}
                      <span className="font-medium text-surface-800">"{debouncedQuery}"</span>
                    </>
                  )}
                </p>
              </div>
            )}

            {suggestion && (
              <div className="mb-4 p-3 bg-brand-50 border border-brand-100 rounded-xl flex items-center gap-3">
                <span className="text-sm text-surface-600">
                  Did you mean{' '}
                  <button
                    onClick={() => setSearchQuery(suggestion)}
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    {suggestion}
                  </button>
                  ?
                </span>
              </div>
            )}

            {isLoading ? (
              <SearchSkeleton />
            ) : filteredResults.length === 0 ? (
              <EmptyState
                icon={<Search className="h-12 w-12" />}
                title={
                  debouncedQuery
                    ? `No results for "${debouncedQuery}"`
                    : 'No restaurants found'
                }
                description={
                  debouncedQuery
                    ? 'Try a different search term or adjust your filters.'
                    : 'Try adjusting your filters to see more results.'
                }
                action={
                  debouncedQuery ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearchQuery('');
                        setCuisine('');
                        setPriceRange('');
                        setMinRating('');
                      }}
                    >
                      Clear search
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredResults.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    {/* Pagination could be added here */}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
