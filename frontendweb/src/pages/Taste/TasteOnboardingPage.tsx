import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X, Sparkles } from 'lucide-react';
import { useUpdateTasteProfile } from '@/hooks/useTasteProfile';
import { Button, Card } from '@/components/ui';
import CuisinePreferencePicker from './components/CuisinePreferencePicker';
import DietaryRestrictionPicker from './components/DietaryRestrictionPicker';
import SpiceLevelSelector from './components/SpiceLevelSelector';

const TOTAL_STEPS = 4;

interface DislikedInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

const SUGGESTIONS = [
  'Cilantro', 'Mushrooms', 'Olives', 'Onions', 'Garlic',
  'Bell Peppers', 'Eggplant', 'Pineapple', 'Anchovies', 'Blue Cheese',
  'Truffle', 'Seaweed', 'Liver', 'Beets', 'Fennel',
];

function DislikedIngredientsInput({ ingredients, onChange }: DislikedInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addIngredient = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed]);
    }
    setInputValue('');
  };

  const removeIngredient = (value: string) => {
    onChange(ingredients.filter((i) => i !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient(inputValue);
    }
  };

  const availableSuggestions = SUGGESTIONS.filter((s) => !ingredients.includes(s));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-xl border border-surface-200 bg-white">
        {ingredients.length === 0 && (
          <span className="text-sm text-surface-400">Type an ingredient and press Enter...</span>
        )}
        {ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-medium animate-in fade-in zoom-in-95"
          >
            {ingredient}
            <button
              onClick={() => removeIngredient(ingredient)}
              className="hover:text-red-900 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type an ingredient and press Enter"
        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400"
      />
      <div>
        <p className="text-xs text-surface-500 mb-2">Popular choices:</p>
        <div className="flex flex-wrap gap-2">
          {availableSuggestions.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => addIngredient(suggestion)}
              className="px-3 py-1.5 rounded-full border border-surface-200 text-xs font-medium text-surface-600 hover:bg-surface-50 hover:border-brand-300 transition-all"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TasteOnboardingPage() {
  const navigate = useNavigate();
  const updateProfile = useUpdateTasteProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [cuisines, setCuisines] = useState<Record<string, string>>({});
  const [dietary, setDietary] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState(2);
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>([]);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const stepTitles = [
    'Cuisine Preferences',
    'Dietary Restrictions',
    'Spice Level',
    'Disliked Ingredients',
  ];

  const next = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const back = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const complete = async () => {
    const favoriteCuisines = Object.entries(cuisines)
      .filter(([_, pref]) => pref === 'love' || pref === 'like')
      .map(([cuisine]) => cuisine);

    const spiceLevels = ['NONE', 'MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT'];

    await updateProfile.mutateAsync({
      favoriteCuisines,
      dietaryRestrictions: dietary,
      spiceLevel: spiceLevels[spiceLevel] || 'MEDIUM',
      dislikedIngredients,
      priceRange: { min: 10, max: 50 },
    });

    navigate('/taste');
  };

  const skip = () => {
    navigate('/taste');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-500" />
              <span className="text-sm font-medium text-surface-600">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
            </div>
            <button
              onClick={skip}
              className="text-sm text-surface-500 hover:text-surface-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
          <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card padding="lg" className="mb-6">
          <h2 className="text-xl font-bold text-surface-800 mb-2">
            {stepTitles[currentStep - 1]}
          </h2>
          <p className="text-sm text-surface-500 mb-6">
            {currentStep === 1 && 'Select cuisines you enjoy. Tap twice for "Love".'}
            {currentStep === 2 && 'Choose any dietary requirements you have.'}
            {currentStep === 3 && 'How spicy do you like your food?'}
            {currentStep === 4 && 'Add any ingredients you want to avoid.'}
          </p>

          <div className="min-h-[300px]">
            {currentStep === 1 && (
              <CuisinePreferencePicker
                selected={cuisines}
                onChange={setCuisines}
              />
            )}
            {currentStep === 2 && (
              <DietaryRestrictionPicker
                selected={dietary}
                onChange={setDietary}
              />
            )}
            {currentStep === 3 && (
              <SpiceLevelSelector
                value={spiceLevel}
                onChange={setSpiceLevel}
              />
            )}
            {currentStep === 4 && (
              <DislikedIngredientsInput
                ingredients={dislikedIngredients}
                onChange={setDislikedIngredients}
              />
            )}
          </div>
        </Card>

        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <Button
              variant="secondary"
              onClick={back}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
          )}
          {currentStep < TOTAL_STEPS ? (
            <Button
              onClick={next}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              fullWidth
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={complete}
              loading={updateProfile.isPending}
              rightIcon={<Check className="h-4 w-4" />}
              fullWidth
            >
              Complete Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
