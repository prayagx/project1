'use client';

import { MealPlan } from '@/types';

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
}

export default function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-6">{mealPlan.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-medium mb-4">Macronutrients</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Protein:</span>
              <span>{mealPlan.macros.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span>Carbs:</span>
              <span>{mealPlan.macros.carbs}g</span>
            </div>
            <div className="flex justify-between">
              <span>Fats:</span>
              <span>{mealPlan.macros.fats}g</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Calories:</span>
              <span>{mealPlan.totalCalories} kcal</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-4">Meals</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Breakfast</h4>
              <ul className="list-disc list-inside">
                {mealPlan.meals.breakfast.map((food) => (
                  <li key={food.id}>
                    {food.name} ({food.calories} kcal)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Lunch</h4>
              <ul className="list-disc list-inside">
                {mealPlan.meals.lunch.map((food) => (
                  <li key={food.id}>
                    {food.name} ({food.calories} kcal)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Dinner</h4>
              <ul className="list-disc list-inside">
                {mealPlan.meals.dinner.map((food) => (
                  <li key={food.id}>
                    {food.name} ({food.calories} kcal)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Snacks</h4>
              <ul className="list-disc list-inside">
                {mealPlan.meals.snacks.map((food) => (
                  <li key={food.id}>
                    {food.name} ({food.calories} kcal)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 