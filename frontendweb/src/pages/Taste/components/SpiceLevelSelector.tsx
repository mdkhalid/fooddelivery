import { cn } from '@/utils/cn';

const SPICE_LEVELS = [
  {
    level: 0,
    label: 'None',
    description: 'No spice at all. Bland and mild.',
    emojis: '🌶️',
    color: 'bg-green-100 border-green-300 text-green-700',
    activeColor: 'bg-green-500 border-green-600 text-white',
  },
  {
    level: 1,
    label: 'Mild',
    description: 'A gentle warmth. Perfect for spice newcomers.',
    emojis: '🌶️',
    color: 'bg-yellow-50 border-yellow-300 text-yellow-700',
    activeColor: 'bg-yellow-400 border-yellow-500 text-white',
  },
  {
    level: 2,
    label: 'Medium',
    description: 'A noticeable kick. Most people enjoy this level.',
    emojis: '🌶️🌶️',
    color: 'bg-orange-50 border-orange-300 text-orange-700',
    activeColor: 'bg-orange-400 border-orange-500 text-white',
  },
  {
    level: 3,
    label: 'Hot',
    description: 'Bring the heat! Not for the faint of heart.',
    emojis: '🌶️🌶️🌶️',
    color: 'bg-red-50 border-red-300 text-red-700',
    activeColor: 'bg-red-500 border-red-600 text-white',
  },
  {
    level: 4,
    label: 'Extra Hot',
    description: 'Maximum fire! Only for true spice lovers.',
    emojis: '🌶️🌶️🌶️🔥',
    color: 'bg-red-100 border-red-400 text-red-800',
    activeColor: 'bg-red-700 border-red-800 text-white',
  },
];

interface SpiceLevelSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function SpiceLevelSelector({ value, onChange }: SpiceLevelSelectorProps) {
  const selectedLevel = (SPICE_LEVELS[value] ?? SPICE_LEVELS[2]) as typeof SPICE_LEVELS[number];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {SPICE_LEVELS.map((level, index) => (
          <button
            key={level.level}
            onClick={() => onChange(index)}
            className={cn(
              'flex-1 py-4 rounded-xl border-2 transition-all duration-200',
              'hover:shadow-md active:scale-[0.97]',
              index <= value
                ? 'bg-gradient-to-b from-orange-400 to-red-500 border-red-400 text-white'
                : 'bg-surface-50 border-surface-200 text-surface-400',
            )}
          >
            <div className="text-2xl mb-1">
              {'🌶️'.repeat(Math.min(index + 1, 4))}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between px-1">
        {SPICE_LEVELS.map((level, index) => (
          <button
            key={level.level}
            onClick={() => onChange(index)}
            className={cn(
              'text-xs font-medium transition-colors',
              index === value ? 'text-brand-600' : 'text-surface-400',
            )}
          >
            {level.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          'p-4 rounded-xl border-2 transition-all duration-300',
          selectedLevel.color,
        )}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{selectedLevel.emojis}</span>
          <span className="text-lg font-bold">{selectedLevel.label}</span>
        </div>
        <p className="text-sm opacity-80">{selectedLevel.description}</p>
      </div>
    </div>
  );
}
