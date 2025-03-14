import { useState } from 'react';
import { getNutritionInfo } from '../services/nutritionService';

interface MealPlanDisplayProps {
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealFrequency: number;
  dietaryPreferences: string[];
  allergies: string[];
}

export function MealPlanDisplay({
  targetCalories,
  macros,
  mealFrequency,
  dietaryPreferences,
  allergies
}: MealPlanDisplayProps) {
  const [mealPlan, setMealPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMealPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const caloriesPerMeal = Math.round(targetCalories / mealFrequency);
      const proteinPerMeal = Math.round(macros.protein / mealFrequency);
      const carbsPerMeal = Math.round(macros.carbs / mealFrequency);
      const fatPerMeal = Math.round(macros.fat / mealFrequency);

      const mealPlanData = await Promise.all(
        Array.from({ length: mealFrequency }, async (_, index) => {
          const mealType = index === 0 ? 'Breakfast' :
                          index === mealFrequency - 1 ? 'Dinner' :
                          'Lunch';

          // Generate meal components based on macros
          const components = await generateMealComponents(
            caloriesPerMeal,
            proteinPerMeal,
            carbsPerMeal,
            fatPerMeal,
            dietaryPreferences,
            allergies
          );

          return {
            mealType,
            targetCalories: caloriesPerMeal,
            components
          };
        })
      );

      setMealPlan(mealPlanData);
    } catch (err) {
      setError('Failed to generate meal plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateMealComponents = async (
    targetCalories: number,
    targetProtein: number,
    targetCarbs: number,
    targetFat: number,
    preferences: string[],
    allergies: string[]
  ) => {
    // This is a simplified version. In a real application, you would have a more
    // sophisticated algorithm to select foods that meet the exact macro targets
    const proteinSources = preferences.includes('vegetarian') || preferences.includes('vegan')
      ? ['tofu', 'tempeh', 'lentils', 'chickpeas']
      : ['chicken breast', 'fish', 'eggs', 'tofu'];

    const carbSources = preferences.includes('keto')
      ? ['avocado', 'nuts', 'seeds']
      : ['brown rice', 'quinoa', 'sweet potato'];

    const fatSources = ['avocado', 'olive oil', 'nuts', 'seeds'];

    const components = await Promise.all([
      getNutritionInfo(proteinSources[Math.floor(Math.random() * proteinSources.length)]),
      getNutritionInfo(carbSources[Math.floor(Math.random() * carbSources.length)]),
      getNutritionInfo(fatSources[Math.floor(Math.random() * fatSources.length)])
    ]);

    return components.map(comp => comp[0]).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Daily Nutritional Goals
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {targetCalories}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {macros.protein}g
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {macros.carbs}g
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fat</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {macros.fat}g
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={generateMealPlan}
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Generating Meal Plan...' : 'Generate Meal Plan'}
      </button>

      {error && (
        <div className="text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {mealPlan.length > 0 && (
        <div className="grid gap-6">
          {mealPlan.map((meal, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md
                       hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {meal.mealType}
              </h3>
              <div className="grid gap-4">
                {meal.components.map((component: any, compIndex: number) => (
                  <div
                    key={compIndex}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {component.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {component.calories} calories, {component.protein_g}g protein,
                        {component.carbohydrates_total_g}g carbs, {component.fat_total_g}g fat
                      </p>
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