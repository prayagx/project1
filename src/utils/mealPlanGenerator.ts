import { UserPreferences, MealPlan, FoodItem } from '@/types';

// Sample food database - in a real app, this would come from an API
const foodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Oatmeal',
    calories: 307,
    protein: 10.7,
    carbs: 55.1,
    fats: 5.3,
    servingSize: '100g',
  },
  {
    id: '2',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    servingSize: '100g',
  },
  {
    id: '3',
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fats: 1.8,
    servingSize: '100g',
  },
  {
    id: '4',
    name: 'Salmon',
    calories: 208,
    protein: 22.1,
    carbs: 0,
    fats: 13.4,
    servingSize: '100g',
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    calories: 133,
    protein: 10,
    carbs: 3.8,
    fats: 9.5,
    servingSize: '100g',
  },
];

function calculateMacroSplit(preferences: UserPreferences) {
  const { fitnessGoal, dailyCalories } = preferences;
  
  switch (fitnessGoal) {
    case 'muscle_gain':
      return {
        protein: dailyCalories * 0.3 / 4, // 30% protein
        carbs: dailyCalories * 0.5 / 4,   // 50% carbs
        fats: dailyCalories * 0.2 / 9,    // 20% fats
      };
    case 'fat_loss':
      return {
        protein: dailyCalories * 0.4 / 4, // 40% protein
        carbs: dailyCalories * 0.3 / 4,   // 30% carbs
        fats: dailyCalories * 0.3 / 9,    // 30% fats
      };
    default: // maintenance
      return {
        protein: dailyCalories * 0.25 / 4, // 25% protein
        carbs: dailyCalories * 0.45 / 4,   // 45% carbs
        fats: dailyCalories * 0.3 / 9,     // 30% fats
      };
  }
}

export function generateMealPlan(preferences: UserPreferences): MealPlan {
  const macros = calculateMacroSplit(preferences);
  
  // Simple meal plan generation - in a real app, this would be more sophisticated
  const breakfast: FoodItem[] = [
    { ...foodDatabase[0], id: 'b1' }, // Oatmeal
    { ...foodDatabase[4], id: 'b2' }, // Greek Yogurt
  ];
  
  const lunch: FoodItem[] = [
    { ...foodDatabase[1], id: 'l1' }, // Chicken Breast
    { ...foodDatabase[2], id: 'l2' }, // Brown Rice
  ];
  
  const dinner: FoodItem[] = [
    { ...foodDatabase[3], id: 'd1' }, // Salmon
    { ...foodDatabase[2], id: 'd2' }, // Brown Rice
  ];
  
  const snacks: FoodItem[] = [
    { ...foodDatabase[4], id: 's1' }, // Greek Yogurt
  ];

  const totalCalories = [...breakfast, ...lunch, ...dinner, ...snacks]
    .reduce((sum, food) => sum + food.calories, 0);

  return {
    id: Date.now().toString(),
    name: `Custom Meal Plan - ${preferences.fitnessGoal}`,
    meals: {
      breakfast,
      lunch,
      dinner,
      snacks,
    },
    totalCalories,
    macros,
  };
} 