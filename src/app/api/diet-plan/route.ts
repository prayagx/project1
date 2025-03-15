import { NextResponse } from 'next/server';
import { generateDietPlan as generateDietPlanUtil } from '../../services/nutritionService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      weight, 
      height, 
      age, 
      gender, 
      activityLevel, 
      goal, 
      dietaryPreferences = [], 
      planDuration = 'day' 
    } = body;

    // Validate required inputs
    if (!weight || !height || !age || !gender || !activityLevel || !goal) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    // Generate diet plan
    const plan = generateDietPlanUtil(
      parseInt(weight),
      parseInt(height),
      parseInt(age),
      gender,
      activityLevel,
      goal,
      dietaryPreferences,
      planDuration
    );

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error generating diet plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate diet plan' },
      { status: 500 }
    );
  }
} 