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

export async function generateDietPlan(formData: any) {
  // Calculate BMR using Mifflin-St Jeor Equation
  const weight = parseFloat(formData.weight);
  const height = parseFloat(formData.height);
  const age = parseInt(formData.age);
  const isMale = formData.gender === 'male';

  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (isMale) bmr += 5;
  else bmr -= 161;

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    moderate: 1.375,
    active: 1.55,
    veryActive: 1.725,
    extraActive: 1.9
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers];

  // Adjust calories based on goal
  let targetCalories = tdee;
  if (formData.goal === 'lose') {
    targetCalories -= 500; // 500 calorie deficit for ~0.5kg/week weight loss
  } else if (formData.goal === 'gain') {
    targetCalories += 500; // 500 calorie surplus for ~0.5kg/week weight gain
  }

  // Calculate macronutrient distribution
  const proteinPerKg = 1.6; // 1.6g per kg of body weight
  const protein = weight * proteinPerKg;
  const proteinCalories = protein * 4;

  let fatCalories;
  let carbCalories;
  
  if (formData.dietaryPreferences.includes('keto')) {
    // Keto: 75% fat, 20% protein, 5% carbs
    fatCalories = targetCalories * 0.75;
    carbCalories = targetCalories * 0.05;
  } else if (formData.dietaryPreferences.includes('paleo')) {
    // Paleo: 40% fat, 30% protein, 30% carbs
    fatCalories = targetCalories * 0.4;
    carbCalories = targetCalories * 0.3;
  } else {
    // Standard: 30% fat, 30% protein, 40% carbs
    fatCalories = targetCalories * 0.3;
    carbCalories = targetCalories - proteinCalories - fatCalories;
  }

  const fat = fatCalories / 9;
  const carbs = carbCalories / 4;

  return {
    targetCalories,
    macros: {
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs)
    },
    mealFrequency: parseInt(formData.mealFrequency),
    dietaryPreferences: formData.dietaryPreferences,
    allergies: formData.allergies
  };
} 