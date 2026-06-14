import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Clock, Utensils } from 'lucide-react';
import { formatRating } from '@/utils/format';
import { Card, Badge } from '@/components/ui';
import type { Restaurant } from '@/types/restaurant.types';

interface PersonalizedRowProps {
  restaurants: Restaurant[];
}

export default function PersonalizedRow({ restaurants }: PersonalizedRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-surface-50"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5 text-surface-600" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {restaurants.map((restaurant, index) => (
          <Link
            key={restaurant.id}
            to={`/restaurant/${restaurant.slug}`}
            className="shrink-0 w-64"
          >
            <Card hover clickable className="overflow-hidden h-full">
              <div className="relative h-36 -mx-5 -mt-5 mb-3 overflow-hidden">
                {restaurant.coverImageUrl ? (
                  <img
                    src={restaurant.coverImageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                    <span className="text-3xl">🍽️</span>
                  </div>
                )}
                {index < 3 && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="brand" size="sm">
                      <Utensils className="h-3 w-3 mr-1" />
                      {95 - index * 5}% match
                    </Badge>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-surface-800 truncate">{restaurant.name}</h3>
                {restaurant.tags.length > 0 && (
                  <p className="text-xs text-surface-500 truncate">
                    {restaurant.tags.slice(0, 2).join(' · ')}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-surface-600">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {formatRating(restaurant.rating.average)}
                  </span>
                  <span className="text-surface-300">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {restaurant.estimatedDeliveryTime} min
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-surface-50"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5 text-surface-600" />
      </button>
    </div>
  );
}
