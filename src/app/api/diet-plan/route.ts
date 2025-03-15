import { NextResponse } from 'next/server';
import { generateDietPlan as generateDietPlanUtil } from '../../services/nutritionService';

// Set dynamic to force-static for static export
export const dynamic = 'force-static';
export const revalidate = false;

// Mock diet plan data for static export
const mockDietPlan = {
  targetCalories: 2000,
  macros: {
    protein: 150,
    carbs: 200,
    fat: 67
  },
  mealFrequency: 3,
  dietaryPreferences: ["balanced"],
  meals: [
    {
      name: "Breakfast",
      calories: 500,
      protein: 30,
      carbs: 60,
      fat: 15,
      foods: [
        "Oatmeal with berries and nuts",
        "Greek yogurt",
        "Coffee or tea"
      ]
    },
    {
      name: "Lunch",
      calories: 700,
      protein: 45,
      carbs: 70,
      fat: 25,
      foods: [
        "Grilled chicken salad with mixed greens",
        "Quinoa",
        "Olive oil dressing",
        "Apple"
      ]
    },
    {
      name: "Dinner",
      calories: 800,
      protein: 50,
      carbs: 70,
      fat: 27,
      foods: [
        "Baked salmon",
        "Roasted vegetables",
        "Brown rice",
        "Small side salad"
      ]
    }
  ]
};

export async function POST() {
  // For static export, we return mock data
  return NextResponse.json(mockDietPlan);
} 