import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift,
  Star,
  Clock,
  AlertTriangle,
  Award,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '@/utils/format';
import { useLoyaltyAccount, useLoyaltyHistory, useRedeemReward } from '@/hooks/useLoyalty';
import {
  Button,
  Card,
  EmptyState,
  Skeleton,
  SkeletonText,
} from '@/components/ui';
import TierBadge from './components/TierBadge';
import PointsBalance from './components/PointsBalance';
import PointsHistory from './components/PointsHistory';
import RewardCard from './components/RewardCard';

const REWARDS_CATALOG = [
  {
    id: 'r1',
    name: '$5 Off',
    description: 'Get $5 off your next order',
    pointsCost: 500,
    rewardType: 'DISCOUNT',
    rewardValue: 5,
    icon: '💰',
  },
  {
    id: 'r2',
    name: 'Free Delivery',
    description: 'Free delivery on your next order',
    pointsCost: 300,
    rewardType: 'FREE_DELIVERY',
    rewardValue: 0,
    icon: '🚚',
  },
  {
    id: 'r3',
    name: '10% Off',
    description: '10% off orders over $25',
    pointsCost: 750,
    rewardType: 'DISCOUNT',
    rewardValue: 10,
    icon: '🎉',
  },
  {
    id: 'r4',
    name: '$10 Off',
    description: 'Get $10 off your next order',
    pointsCost: 950,
    rewardType: 'DISCOUNT',
    rewardValue: 10,
    icon: '💎',
  },
  {
    id: 'r5',
    name: 'Free Dessert',
    description: 'Free dessert with any main course',
    pointsCost: 400,
    rewardType: 'FREE_ITEM',
    rewardValue: 0,
    icon: '🍰',
  },
  {
    id: 'r6',
    name: '2x Points',
    description: 'Double points on your next order',
    pointsCost: 600,
    rewardType: 'BONUS',
    rewardValue: 2,
    icon: '✨',
  },
];

const TIER_THRESHOLDS = [
  { tier: 'Bronze', min: 0, next: 'Silver', nextMin: 1000 },
  { tier: 'Silver', min: 1000, next: 'Gold', nextMin: 3000 },
  { tier: 'Gold', min: 3000, next: 'Platinum', nextMin: 5000 },
  { tier: 'Platinum', min: 5000, next: null, nextMin: null },
];

function LoyaltySkeleton() {
  return (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <Skeleton variant="rect" className="h-40" />
      </Card>
      <Card padding="lg" className="space-y-4">
        <SkeletonText lines={4} />
      </Card>
    </div>
  );
}

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const { data: account, isLoading: loadingAccount } = useLoyaltyAccount();
  const [historyPage, setHistoryPage] = useState(1);
  const { data: history, isLoading: loadingHistory } = useLoyaltyHistory({
    page: historyPage,
    limit: 10,
  });
  const redeemMutation = useRedeemReward();

  if (loadingAccount) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <LoyaltySkeleton />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <EmptyState
            icon={<Gift className="h-12 w-12" />}
            title="No loyalty account yet"
            description="Start ordering to earn points and unlock rewards!"
            action={
              <Button onClick={() => navigate('/')}>
                Browse restaurants
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const currentTier = TIER_THRESHOLDS.find((t) => t.tier === account.tier) || TIER_THRESHOLDS[0];
  if (!currentTier) return null;
  const tierProgress = currentTier.nextMin
    ? Math.min((account.totalPointsEarned / currentTier.nextMin) * 100, 100)
    : 100;
  const pointsToNext = currentTier.nextMin
    ? Math.max(currentTier.nextMin - account.totalPointsEarned, 0)
    : 0;

  const pointsValue = account.points * 0.01;
  const hasExpiringPoints = account.pointsExpiringSoon > 0;

  const handleRedeem = async (rewardId: string) => {
    try {
      await redeemMutation.mutateAsync({ rewardId });
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {hasExpiringPoints && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                {account.pointsExpiringSoon} points expiring soon
              </p>
              <p className="text-xs text-amber-600">
                Expires on {formatDate(account.expiryDate)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleRedeem('r1')}>
              Use now
            </Button>
          </div>
        )}

        <Card padding="lg" className="text-center">
          <TierBadge tier={account.tier} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-surface-800 mb-1">
            {account.tier} Member
          </h2>
          {currentTier.next && (
            <p className="text-sm text-surface-500 mb-4">
              {pointsToNext} points to {currentTier.next}
            </p>
          )}
          <div className="max-w-md mx-auto mb-4">
            <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
          </div>
          <PointsBalance points={account.points} value={pointsValue} />
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card padding="lg" className="space-y-3">
            <h3 className="text-sm font-semibold text-surface-700 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Tier Benefits
            </h3>
            <ul className="space-y-2 text-sm text-surface-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Priority customer support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {account.tier === 'Gold' || account.tier === 'Platinum'
                  ? 'Free delivery on all orders'
                  : 'Free delivery on orders over $30'}
              </li>
              {account.tier === 'Platinum' && (
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Exclusive early access to new restaurants
                </li>
              )}
            </ul>
          </Card>

          <Card padding="lg" className="space-y-3">
            <h3 className="text-sm font-semibold text-surface-700 flex items-center gap-2">
              <Star className="h-4 w-4" />
              How to Earn
            </h3>
            <ul className="space-y-2 text-sm text-surface-600">
              <li className="flex items-center gap-2">
                <span className="text-brand-500">+1</span>
                Point per $1 spent
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-500">+50</span>
                Points for first order
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-500">+25</span>
                Points for leaving a review
              </li>
            </ul>
          </Card>
        </div>

        <section>
          <h3 className="text-lg font-bold text-surface-800 mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-brand-500" />
            Redeem Rewards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARDS_CATALOG.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userPoints={account.points}
                onRedeem={() => handleRedeem(reward.id)}
                isRedeeming={redeemMutation.isPending}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-surface-800 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-500" />
            Points History
          </h3>
          <PointsHistory
            history={history?.data || []}
            isLoading={loadingHistory}
            currentPage={historyPage}
            totalPages={history?.meta ? Math.ceil(history.meta.total / 10) : 1}
            onPageChange={setHistoryPage}
          />
        </section>
      </div>
    </div>
  );
}
