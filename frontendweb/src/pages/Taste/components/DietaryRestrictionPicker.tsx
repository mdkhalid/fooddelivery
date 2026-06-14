import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

const DIETARY_OPTIONS = [
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'halal', label: 'Halal', icon: '🍖' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'nut-free', label: 'Nut-Free', icon: '🥜' },
  { id: 'low-sodium', label: 'Low Sodium', icon: '🧂' },
  { id: 'pescatarian', label: 'Pescatarian', icon: '🐟' },
  { id: 'kosher', label: 'Kosher', icon: '✡️' },
];

interface DietaryRestrictionPickerProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function DietaryRestrictionPicker({
  selected,
  onChange,
}: DietaryRestrictionPickerProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {DIETARY_OPTIONS.map((option) => {
        const isSelected = selected.includes(option.id);

        return (
          <button
            key={option.id}
            onClick={() => toggle(option.id)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left',
              'hover:shadow-md active:scale-[0.97]',
              isSelected
                ? 'bg-brand-50 border-brand-400 ring-2 ring-brand-200'
                : 'bg-white border-surface-200 hover:border-surface-300',
            )}
          >
            <div
              className={cn(
                'h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                isSelected
                  ? 'bg-brand-500 border-brand-500'
                  : 'border-surface-300',
              )}
            >
              {isSelected && <Check className="h-4 w-4 text-white" />}
            </div>
            <span className="text-xl">{option.icon}</span>
            <span
              className={cn(
                'text-sm font-medium',
                isSelected ? 'text-brand-700' : 'text-surface-700',
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
