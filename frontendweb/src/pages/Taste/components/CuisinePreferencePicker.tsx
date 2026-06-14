import { cn } from '@/utils/cn';

const CUISINES = [
  { name: 'Italian', emoji: '🍝' },
  { name: 'Chinese', emoji: '🥡' },
  { name: 'Japanese', emoji: '🍣' },
  { name: 'Indian', emoji: '🍛' },
  { name: 'Mexican', emoji: '🌮' },
  { name: 'Thai', emoji: '🍜' },
  { name: 'American', emoji: '🍔' },
  { name: 'Mediterranean', emoji: '🥙' },
  { name: 'Korean', emoji: '🥘' },
  { name: 'Vietnamese', emoji: '🍲' },
  { name: 'Ethiopian', emoji: '🫕' },
  { name: 'French', emoji: '🥐' },
  { name: 'Greek', emoji: '🫒' },
  { name: 'Caribbean', emoji: '🌴' },
  { name: 'Middle Eastern', emoji: '🧆' },
  { name: 'African', emoji: '🌍' },
];

const PREFERENCE_CYCLE = ['neutral', 'like', 'love', 'dislike'] as const;
type Preference = typeof PREFERENCE_CYCLE[number];

interface CuisinePreferencePickerProps {
  selected: Record<string, string>;
  onChange: (selected: Record<string, string>) => void;
}

const preferenceStyles: Record<Preference, string> = {
  neutral: 'bg-white border-surface-200 text-surface-700',
  like: 'bg-blue-50 border-blue-300 text-blue-700 ring-2 ring-blue-200',
  love: 'bg-green-50 border-green-300 text-green-700 ring-2 ring-green-200',
  dislike: 'bg-red-50 border-red-200 text-red-500 line-through opacity-60',
};

const preferenceLabels: Record<Preference, string> = {
  neutral: '',
  like: 'Like',
  love: 'Love',
  dislike: 'No',
};

export default function CuisinePreferencePicker({
  selected,
  onChange,
}: CuisinePreferencePickerProps) {
  const handleClick = (cuisineName: string) => {
    const current = (selected[cuisineName] || 'neutral') as Preference;
    const currentIndex = PREFERENCE_CYCLE.indexOf(current);
    const nextIndex = (currentIndex + 1) % PREFERENCE_CYCLE.length;
    const nextPreference = PREFERENCE_CYCLE[nextIndex];

    onChange({
      ...selected,
      [cuisineName]: nextPreference,
    } as Record<string, string>);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {CUISINES.map((cuisine) => {
        const preference = (selected[cuisine.name] || 'neutral') as Preference;

        return (
          <button
            key={cuisine.name}
            onClick={() => handleClick(cuisine.name)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              'hover:shadow-md active:scale-[0.97]',
              preferenceStyles[preference],
            )}
          >
            <span className="text-3xl">{cuisine.emoji}</span>
            <span className="text-sm font-medium">{cuisine.name}</span>
            {preferenceLabels[preference] && (
              <span
                className={cn(
                  'absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full text-xs font-bold',
                  preference === 'love' && 'bg-green-500 text-white',
                  preference === 'like' && 'bg-blue-500 text-white',
                  preference === 'dislike' && 'bg-red-400 text-white',
                )}
              >
                {preferenceLabels[preference]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
