import { NextResponse } from 'next/server';

// Set dynamic to force-static for static export
export const dynamic = 'force-static';
export const revalidate = false;

// Mock nutrition data for static export
const mockNutritionData = {
  items: [
    {
      name: "apple",
      calories: 52,
      serving_size_g: 100,
      fat_total_g: 0.2,
      fat_saturated_g: 0,
      protein_g: 0.3,
      sodium_mg: 1,
      potassium_mg: 107,
      cholesterol_mg: 0,
      carbohydrates_total_g: 14,
      fiber_g: 2.4,
      sugar_g: 10.3
    },
    {
      name: "banana",
      calories: 89,
      serving_size_g: 100,
      fat_total_g: 0.3,
      fat_saturated_g: 0.1,
      protein_g: 1.1,
      sodium_mg: 1,
      potassium_mg: 358,
      cholesterol_mg: 0,
      carbohydrates_total_g: 22.8,
      fiber_g: 2.6,
      sugar_g: 12.2
    }
  ]
};

export async function GET() {
  // For static export, we return mock data
  return NextResponse.json(mockNutritionData);
} 