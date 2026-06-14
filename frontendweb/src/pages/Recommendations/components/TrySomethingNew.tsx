import { Link } from 'react-router-dom';
import { RefreshCw, Star, Clock, ArrowRight } from 'lucide-react';
import { formatRating } from '@/utils/format';
import { Button } from '@/components/ui';
import type { Restaurant } from '@/types/restaurant.types';

const CUISINE_EMOJIS: Record<string, string> = {
  italian: '🍝',
  chinese: '🥡',
  japanese: '🍣',
  indian: '🍛',
  mexican: '🌮',
  thai: '🍜',
  american: '🍔',
  mediterranean: '🥙',
  korean: '🥘',
  vietnamese: '🍲',
  ethiopian: '🫕',
  default: '🍽️',
};

function getCuisineEmoji(tags: string[]): string {
  for (const tag of tags) {
    const lower = tag.toLowerCase();
    if (CUISINE_EMOJIS[lower]) return CUISINE_EMOJIS[lower];
  }
  return CUISINE_EMOJIS.default ?? '🍽️';
}

interface TrySomethingNewProps {
  restaurant: Restaurant;
}

export default function TrySomethingNew({ restaurant }: TrySomethingNewProps) {
  const emoji = getCuisineEmoji(restaurant.tags);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 text-6xl">{emoji}</div>
        <div className="absolute bottom-4 left-8 text-5xl rotate-12">{emoji}</div>
        <div className="absolute top-1/2 right-1/3 text-4xl -rotate-12">{emoji}</div>
      </div>

      <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
          <span className="text-5xl">{emoji}</span>
        </div>

        <div className="flex-1 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-100">
              Try something new
            </span>
            <RefreshCw className="h-3 w-3 text-emerald-200" />
            <span className="text-xs text-emerald-200">Refreshes daily</span>
          </div>
          <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
          <div className="flex items-center gap-3 text-sm text-emerald-100">
            {restaurant.tags.length > 0 && (
              <span>{restaurant.tags.slice(0, 2).join(' · ')}</span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              {formatRating(restaurant.rating.average)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {restaurant.estimatedDeliveryTime} min
            </span>
          </div>
        </div>

        <Link to={`/restaurant/${restaurant.slug}`} className="shrink-0">
          <Button
            variant="secondary"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
          >
            Try it!
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
