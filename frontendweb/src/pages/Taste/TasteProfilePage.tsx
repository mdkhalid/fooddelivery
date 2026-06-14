import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  Flame,
  X,
  Clock,
  DollarSign,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import { useTasteProfile } from '@/hooks/useTasteProfile';
import { useRecommendedRestaurants } from '@/hooks/useRecommendations';
import {
  Button,
  Card,
  Badge,
  EmptyState,
  Skeleton,
  SkeletonText,
} from '@/components/ui';

const SPICE_LABELS = ['None', 'Mild', 'Medium', 'Hot', 'Extra Hot'];

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
};

function SpiceLevelMeter({ level }: { level: string }) {
  const spiceIndex = ['NONE', 'MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT'].indexOf(level);
  const normalizedIndex = spiceIndex >= 0 ? spiceIndex : 0;

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-3 rounded-full transition-all duration-300',
              i <= normalizedIndex
                ? i === 0
                  ? 'bg-green-400'
                  : i === 1
                    ? 'bg-yellow-400'
                    : i === 2
                      ? 'bg-orange-400'
                      : i === 3
                        ? 'bg-red-400'
                        : 'bg-red-600'
                : 'bg-surface-100',
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-surface-500">
        <span>Mild</span>
        <span>Extra Hot</span>
      </div>
    </div>
  );
}

function CuisineAffinityBar({ cuisine, affinity }: { cuisine: string; affinity: number }) {
  const emoji = CUISINE_EMOJIS[cuisine.toLowerCase()] || '🍽️';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-surface-700">
          <span className="text-lg">{emoji}</span>
          {cuisine}
        </span>
        <span className="text-xs text-surface-500">{affinity}%</span>
      </div>
      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500"
          style={{ width: `${affinity}%` }}
        />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <Skeleton variant="text" className="h-5 w-32" />
        <SkeletonText lines={3} />
      </Card>
      <Card padding="lg" className="space-y-4">
        <Skeleton variant="text" className="h-5 w-40" />
        <Skeleton variant="rect" className="h-8" />
      </Card>
    </div>
  );
}

export default function TasteProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading: loadingProfile } = useTasteProfile();
  const { data: recommendations } = useRecommendedRestaurants();

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <EmptyState
            icon={<Utensils className="h-12 w-12" />}
            title="No taste profile yet"
            description="Order a few times and we'll learn your taste! Or set up your preferences now."
            action={
              <Button onClick={() => navigate('/taste/onboarding')}>
                Set up preferences
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const spiceIndex = ['NONE', 'MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT'].indexOf(profile.spiceLevel);

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-800">Your Taste Profile</h1>
            <p className="text-sm text-surface-500 mt-1">
              Personalized preferences based on your orders
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/taste/onboarding')}
            leftIcon={<Edit3 className="h-4 w-4" />}
          >
            Edit Preferences
          </Button>
        </div>

        <Card padding="lg" className="space-y-5">
          <h3 className="text-sm font-semibold text-surface-700 flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Top Cuisines
          </h3>
          {profile.favoriteCuisines.length > 0 ? (
            <div className="space-y-4">
              {profile.favoriteCuisines.slice(0, 5).map((cuisine, index) => (
                <CuisineAffinityBar
                  key={cuisine}
                  cuisine={cuisine}
                  affinity={Math.max(95 - index * 15, 30)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-500">No cuisine preferences set yet.</p>
          )}
        </Card>

        <Card padding="lg" className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-700">Dietary Restrictions</h3>
          {profile.dietaryRestrictions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.dietaryRestrictions.map((restriction) => (
                <Badge key={restriction} variant="info" size="md">
                  {restriction}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-500">No dietary restrictions set.</p>
          )}
        </Card>

        <Card padding="lg" className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-700 flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Spice Level
          </h3>
          <SpiceLevelMeter level={profile.spiceLevel} />
          <p className="text-sm font-medium text-surface-700">
            {SPICE_LABELS[spiceIndex >= 0 ? spiceIndex : 0]}
          </p>
        </Card>

        <Card padding="lg" className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-700">Disliked Ingredients</h3>
          {profile.dislikedIngredients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.dislikedIngredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-medium"
                >
                  <X className="h-3 w-3" />
                  {ingredient}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-500">No disliked ingredients.</p>
          )}
        </Card>

        <Card padding="lg" className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-700">Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50">
              <Clock className="h-5 w-5 text-brand-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-surface-700">Preferred Order Time</p>
                <p className="text-sm text-surface-500">
                  {profile.preferredDeliveryTime || 'Evening (6-8 PM)'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50">
              <DollarSign className="h-5 w-5 text-brand-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-surface-700">Average Price Range</p>
                <p className="text-sm text-surface-500">
                  {formatCurrency(profile.priceRange.min)} - {formatCurrency(profile.priceRange.max)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {recommendations && recommendations.length > 0 && (
          <Card padding="lg" className="space-y-4">
            <h3 className="text-sm font-semibold text-surface-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" />
              Based on Your Taste
            </h3>
            <div className="space-y-3">
              {recommendations.slice(0, 4).map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurant/${restaurant.slug}`)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 cursor-pointer transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-surface-100">
                    {restaurant.coverImageUrl ? (
                      <img
                        src={restaurant.coverImageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800 truncate">
                      {restaurant.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {restaurant.tags.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
