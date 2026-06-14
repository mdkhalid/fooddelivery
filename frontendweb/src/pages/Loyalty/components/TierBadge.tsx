import { cn } from '@/utils/cn';

const TIER_CONFIG: Record<string, { emoji: string; gradient: string; shadow: string }> = {
  Bronze: {
    emoji: '🥈',
    gradient: 'from-amber-600 via-amber-700 to-amber-800',
    shadow: 'shadow-amber-300/50',
  },
  Silver: {
    emoji: '⬜',
    gradient: 'from-gray-300 via-gray-400 to-gray-500',
    shadow: 'shadow-gray-300/50',
  },
  Gold: {
    emoji: '🥇',
    gradient: 'from-yellow-400 via-yellow-500 to-amber-500',
    shadow: 'shadow-yellow-400/50',
  },
  Platinum: {
    emoji: '💎',
    gradient: 'from-cyan-300 via-blue-400 to-purple-500',
    shadow: 'shadow-blue-300/50',
  },
};

interface TierBadgeProps {
  tier: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TierBadge({ tier, className, size = 'lg' }: TierBadgeProps) {
  const config = TIER_CONFIG[tier] ?? TIER_CONFIG.Bronze;
  if (!config) return null;

  const sizeStyles = {
    sm: 'h-12 w-12 text-2xl',
    md: 'h-16 w-16 text-3xl',
    lg: 'h-24 w-24 text-4xl',
  };

  return (
    <div
      className={cn(
        'relative rounded-full bg-gradient-to-br flex items-center justify-center',
        config.gradient,
        config.shadow,
        'shadow-lg',
        sizeStyles[size],
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />
      </div>
      <span className="relative z-10">{config.emoji}</span>
    </div>
  );
}
