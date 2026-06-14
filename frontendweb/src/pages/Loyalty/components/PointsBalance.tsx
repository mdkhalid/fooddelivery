import { Coins } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

interface PointsBalanceProps {
  points: number;
  value: number;
  className?: string;
}

export default function PointsBalance({ points, value, className }: PointsBalanceProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative">
        <Coins className="h-8 w-8 text-brand-500 animate-bounce" style={{ animationDuration: '2s' }} />
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-surface-800 tabular-nums tracking-tight">
          {points.toLocaleString()}
        </div>
        <p className="text-sm text-surface-500 font-medium">Points</p>
        <p className="text-xs text-surface-400 mt-1">
          Worth {formatCurrency(value)}
        </p>
      </div>
    </div>
  );
}
