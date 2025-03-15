const API_KEY = '2aTe+XclgBPfWNTeP/83Cw==hqIdsMOtY2IRIkGF';
const BASE_URL = 'https://api.calorieninjas.com/v1';

export interface NutritionInfo {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  protein_g: number;
  carbohydrates_total_g: number;
}

export async function getNutritionInfo(query: string): Promise<NutritionInfo[]> {
  try {
    const response = await fetch(`${BASE_URL}/nutrition?query=${encodeURIComponent(query)}`, {
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return [];
  }
}

export function generateDietPlan(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
  goal: 'lose' | 'maintain' | 'gain',
  dietaryPreferences: string[] = [],
  planDuration: 'day' | 'week' = 'day'
) {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === 'male') bmr += 5;
  else bmr -= 161;

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[activityLevel];

  // Adjust calories based on goal
  let targetCalories = tdee;
  if (goal === 'lose') {
    targetCalories -= 500; // 500 calorie deficit for ~0.5kg/week weight loss
  } else if (goal === 'gain') {
    targetCalories += 500; // 500 calorie surplus for ~0.5kg/week weight gain
  }

  // Calculate macronutrient distribution
  const proteinPerKg = 1.6; // 1.6g per kg of body weight
  const protein = weight * proteinPerKg;
  const proteinCalories = protein * 4;

  let fatCalories;
  let carbCalories;
  
  // Adjust macros based on dietary preferences
  if (dietaryPreferences.includes('keto')) {
    // Keto: 75% fat, 20% protein, 5% carbs
    fatCalories = targetCalories * 0.75;
    carbCalories = targetCalories * 0.05;
  } else if (dietaryPreferences.includes('low-carb')) {
    // Low-carb: 60% fat, 30% protein, 10% carbs
    fatCalories = targetCalories * 0.6;
    carbCalories = targetCalories * 0.1;
  } else if (dietaryPreferences.includes('paleo')) {
    // Paleo: 40% fat, 30% protein, 30% carbs
    fatCalories = targetCalories * 0.4;
    carbCalories = targetCalories * 0.3;
  } else if (dietaryPreferences.includes('mediterranean')) {
    // Mediterranean: 35% fat, 20% protein, 45% carbs
    fatCalories = targetCalories * 0.35;
    carbCalories = targetCalories * 0.45;
  } else if (dietaryPreferences.includes('vegan') || dietaryPreferences.includes('vegetarian')) {
    // Plant-based: 25% fat, 25% protein, 50% carbs
    fatCalories = targetCalories * 0.25;
    carbCalories = targetCalories * 0.5;
  } else {
    // Standard: 30% fat, 30% protein, 40% carbs
    fatCalories = targetCalories * 0.3;
    carbCalories = targetCalories - proteinCalories - fatCalories;
  }

  const fat = fatCalories / 9;
  const carbs = carbCalories / 4;

  // Define the preferred cuisine types based on dietary preferences
  let preferredCuisines = [];
  
  // Extract cuisine-specific preferences
  const cuisineTypes = [
    'indian', 'north-indian', 'south-indian', 'asian', 'chinese', 
    'japanese', 'thai', 'mexican', 'mediterranean', 'italian', 'middle-eastern'
  ];
  
  for (const pref of dietaryPreferences) {
    if (cuisineTypes.includes(pref)) {
      preferredCuisines.push(pref);
    }
  }

  // If no cuisine preference specified, keep it versatile
  if (preferredCuisines.length === 0) {
    preferredCuisines = ['versatile'];
  }

  return {
    targetCalories: Math.round(targetCalories),
    macros: {
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs)
    },
    mealFrequency: 3, // Default to 3 meals per day
    dietaryPreferences,
    cuisinePreferences: preferredCuisines,
    planDuration
  };
} 