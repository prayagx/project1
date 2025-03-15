// Use environment variable instead of hardcoding API key
const API_KEY = process.env.CALORIE_NINJAS_API_KEY || '2aTe+XclgBPfWNTeP/83Cw==hqIdsMOtY2IRIkGF';
const BASE_URL = 'https://api.calorieninjas.com/v1';

export interface NutritionInfo {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  protein_g: number;
  carbohydrates_total_g: number;
}

export interface DietType {
  name: string;
  value: string;
  protein: number; // percentage
  carbs: number; // percentage
  fat: number; // percentage
}

export const dietTypes: DietType[] = [
  { name: "Balanced", value: "balanced", protein: 30, carbs: 40, fat: 30 },
  { name: "High Protein", value: "high-protein", protein: 40, carbs: 30, fat: 30 },
  { name: "Low Carb", value: "low-carb", protein: 35, carbs: 25, fat: 40 },
  { name: "Keto", value: "keto", protein: 25, carbs: 5, fat: 70 },
  { name: "Vegetarian", value: "vegetarian", protein: 25, carbs: 50, fat: 25 },
  { name: "Vegan", value: "vegan", protein: 20, carbs: 60, fat: 20 },
  { name: "Paleo", value: "paleo", protein: 35, carbs: 25, fat: 40 },
  { name: "Mediterranean", value: "mediterranean", protein: 25, carbs: 50, fat: 25 }
];

export async function getNutritionInfo(query: string): Promise<NutritionInfo[]> {
  try {
    // Use our server API route instead of direct API call
    const response = await fetch(`/api/nutrition?query=${encodeURIComponent(query)}`);

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
  
  // Improved handling of multiple dietary preferences
  // Use a scoring system to blend macros when multiple preferences are selected
  
  // Default macro ratios (protein is fixed based on weight)
  let fatRatio = 0.3; // 30% fat
  let carbRatio = 0.4; // 40% carbs
  
  // Process diet-specific macro adjustments
  // Count how many diet types are selected to properly weight their influence
  const dietTypes = [];
  
  if (dietaryPreferences.includes('keto')) dietTypes.push('keto');
  if (dietaryPreferences.includes('low-carb')) dietTypes.push('low-carb');
  if (dietaryPreferences.includes('paleo')) dietTypes.push('paleo');
  if (dietaryPreferences.includes('mediterranean')) dietTypes.push('mediterranean');
  if (dietaryPreferences.includes('vegetarian') || dietaryPreferences.includes('vegan')) dietTypes.push('plant-based');
  
  if (dietTypes.length === 0) {
    // Standard plan
    fatRatio = 0.3;
    carbRatio = 0.4;
  } else if (dietTypes.length === 1) {
    // Single diet type
    switch (dietTypes[0]) {
      case 'keto':
        fatRatio = 0.75;
        carbRatio = 0.05;
        break;
      case 'low-carb':
        fatRatio = 0.6;
        carbRatio = 0.1;
        break;
      case 'paleo':
        fatRatio = 0.4;
        carbRatio = 0.3;
        break;
      case 'mediterranean':
        fatRatio = 0.35;
        carbRatio = 0.45;
        break;
      case 'plant-based':
        fatRatio = 0.25;
        carbRatio = 0.5;
        break;
    }
  } else {
    // Multiple diet types - calculate weighted average
    let totalFatRatio = 0;
    let totalCarbRatio = 0;
    
    for (const diet of dietTypes) {
      switch (diet) {
        case 'keto':
          totalFatRatio += 0.75;
          totalCarbRatio += 0.05;
          break;
        case 'low-carb':
          totalFatRatio += 0.6;
          totalCarbRatio += 0.1;
          break;
        case 'paleo':
          totalFatRatio += 0.4;
          totalCarbRatio += 0.3;
          break;
        case 'mediterranean':
          totalFatRatio += 0.35;
          totalCarbRatio += 0.45;
          break;
        case 'plant-based':
          totalFatRatio += 0.25;
          totalCarbRatio += 0.5;
          break;
      }
    }
    
    // Calculate average ratios
    fatRatio = totalFatRatio / dietTypes.length;
    carbRatio = totalCarbRatio / dietTypes.length;
  }
  
  // Calculate actual calorie values based on ratios
  fatCalories = targetCalories * fatRatio;
  carbCalories = targetCalories * carbRatio;
  
  // Ensure protein is prioritized
  const remainingCalories = targetCalories - proteinCalories;
  const adjustmentFactor = remainingCalories / (fatCalories + carbCalories);
  
  // Adjust fat and carbs to fit the remaining calories after protein
  fatCalories = fatCalories * adjustmentFactor;
  carbCalories = carbCalories * adjustmentFactor;

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