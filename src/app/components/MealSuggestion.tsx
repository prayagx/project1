import { useState } from 'react';
import { getNutritionInfo } from '../services/nutritionService';

interface MealSuggestionProps {
  dietaryPreferences: string[];
  allergies: string[];
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const PROTEIN_SOURCES = {
  vegetarian: ['tofu', 'tempeh', 'lentils', 'chickpeas', 'quinoa'],
  vegan: ['tofu', 'tempeh', 'lentils', 'chickpeas', 'quinoa'],
  pescatarian: ['salmon', 'tuna', 'shrimp', 'tofu', 'lentils'],
  default: ['chicken breast', 'turkey', 'fish', 'eggs', 'tofu']
};

const CARB_SOURCES = {
  keto: ['avocado', 'nuts', 'seeds', 'leafy greens'],
  paleo: ['sweet potato', 'fruits', 'vegetables', 'nuts'],
  default: ['brown rice', 'quinoa', 'whole grain bread', 'fruits', 'vegetables']
};

const FAT_SOURCES = {
  keto: ['avocado', 'olive oil', 'nuts', 'seeds', 'coconut oil'],
  paleo: ['avocado', 'olive oil', 'nuts', 'seeds'],
  default: ['avocado', 'olive oil', 'nuts', 'seeds']
};

export function MealSuggestion({ dietaryPreferences, allergies, targetCalories, macros }: MealSuggestionProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMealSuggestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const mealSuggestions = await Promise.all(
        MEAL_TYPES.map(async (mealType) => {
          const isKeto = dietaryPreferences.includes('keto');
          const isPaleo = dietaryPreferences.includes('paleo');
          const isVegetarian = dietaryPreferences.includes('vegetarian');
          const isVegan = dietaryPreferences.includes('vegan');
          const isPescatarian = dietaryPreferences.includes('pescatarian');

          // Determine protein sources based on dietary preferences
          const proteinSource = isVegan || isVegetarian
            ? PROTEIN_SOURCES.vegetarian
            : isPescatarian
            ? PROTEIN_SOURCES.pescatarian
            : PROTEIN_SOURCES.default;

          // Determine carb sources based on dietary preferences
          const carbSource = isKeto
            ? CARB_SOURCES.keto
            : isPaleo
            ? CARB_SOURCES.paleo
            : CARB_SOURCES.default;

          // Determine fat sources based on dietary preferences
          const fatSource = isKeto
            ? FAT_SOURCES.keto
            : isPaleo
            ? FAT_SOURCES.paleo
            : FAT_SOURCES.default;

          // Generate random combinations
          const protein = proteinSource[Math.floor(Math.random() * proteinSource.length)];
          const carb = carbSource[Math.floor(Math.random() * carbSource.length)];
          const fat = fatSource[Math.floor(Math.random() * fatSource.length)];

          // Get nutritional information for each component
          const [proteinInfo, carbInfo, fatInfo] = await Promise.all([
            getNutritionInfo(protein),
            getNutritionInfo(carb),
            getNutritionInfo(fat)
          ]);

          return {
            mealType,
            components: [
              { name: protein, nutrition: proteinInfo[0] },
              { name: carb, nutrition: carbInfo[0] },
              { name: fat, nutrition: fatInfo[0] }
            ]
          };
        })
      );

      setSuggestions(mealSuggestions);
    } catch (err) {
      setError('Failed to generate meal suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={generateMealSuggestion}
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Generating Suggestions...' : 'Generate Meal Suggestions'}
      </button>

      {error && (
        <div className="text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="grid gap-6">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md
                       hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {suggestion.mealType}
              </h3>
              <div className="grid gap-4">
                {suggestion.components.map((component: any, compIndex: number) => (
                  <div
                    key={compIndex}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {component.name}
                      </p>
                      {component.nutrition && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {component.nutrition.calories} calories, {component.nutrition.protein_g}g protein
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 