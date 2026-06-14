import { Coins } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card, Button } from '@/components/ui';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  rewardType: string;
  rewardValue: number;
  icon: string;
}

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: () => void;
  isRedeeming: boolean;
}

export default function RewardCard({
  reward,
  userPoints,
  onRedeem,
  isRedeeming,
}: RewardCardProps) {
  const canAfford = userPoints >= reward.pointsCost;

  return (
    <Card hover className="overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
          <span className="text-2xl">{reward.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-surface-800">{reward.name}</h4>
          <p className="text-sm text-surface-500 mt-0.5">{reward.description}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Coins className="h-3.5 w-3.5 text-brand-500" />
            <span
              className={cn(
                'text-sm font-bold',
                canAfford ? 'text-brand-600' : 'text-surface-400',
              )}
            >
              {reward.pointsCost.toLocaleString()} pts
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button
          variant={canAfford ? 'primary' : 'secondary'}
          size="sm"
          fullWidth
          disabled={!canAfford}
          loading={isRedeeming}
          onClick={onRedeem}
        >
          {canAfford ? 'Redeem' : `Need ${reward.pointsCost - userPoints} more pts`}
        </Button>
      </div>
    </Card>
  );
}
