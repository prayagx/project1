export type Theme = 'light' | 'dark';

export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'maintenance';

export type DietaryPreference = 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'standard';

export interface UserPreferences {
  fitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  dailyCalories: number;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
  vitamins?: {
    [key: string]: number;
  };
}

export interface MealPlan {
  id: string;
  name: string;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
} 