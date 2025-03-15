import React, { useState, useEffect } from 'react';
import { getNutritionInfo } from '../services/nutritionService';
import { FoodItem, getFoodsByCategory, calculatePortion, getPortionDescription } from '../services/foodDatabase';

interface MealPlanDisplayProps {
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealFrequency: number;
  dietaryPreferences: string[];
  allergies: string[];
  planDuration?: 'day' | 'week';
}

interface NutritionInfo {
  name: string;
  calories: number;
  protein_g: number;
  carbohydrates_total_g: number;
  fat_total_g: number;
  portion: string;
  description?: string;
}

interface MealSection {
  type: string;
  options: NutritionInfo[];
}

interface MealPlan {
  caloriesPerMeal: number;
  proteinPerMeal: number;
  carbsPerMeal: number;
  fatPerMeal: number;
  meals: MealSection[][][];
  weeklyPlan?: boolean;
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({
  targetCalories,
  protein,
  carbs,
  fat,
  mealFrequency,
  dietaryPreferences,
  allergies,
  planDuration = 'day'
}) => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0); // For weekly plans

  const generateMealPlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate calories and macros per meal
      const caloriesPerMeal = Math.round(targetCalories / mealFrequency);
      const proteinPerMeal = Math.round(protein / mealFrequency);
      const carbsPerMeal = Math.round(carbs / mealFrequency);
      const fatPerMeal = Math.round(fat / mealFrequency);
      
      // Generate meal components for each meal
      const meals: MealSection[][][] = [];
      
      // For weekly plan, create 7 days of meals with more variety
      if (planDuration === 'week') {
        for (let day = 0; day < 7; day++) {
          const dailyMeals: MealSection[][] = [];
          for (let i = 0; i < mealFrequency; i++) {
            const mealComponents = await generateMealComponents(
              caloriesPerMeal,
              proteinPerMeal,
              carbsPerMeal,
              fatPerMeal,
              dietaryPreferences,
              allergies,
              i + (day * mealFrequency) // Using a different seed for each day to ensure variety
            );
            dailyMeals.push(mealComponents);
          }
          meals.push(dailyMeals);
        }
      } else {
        // Original single day plan - wrap in a day array to match the structure
        const dailyMeals: MealSection[][] = [];
        for (let i = 0; i < mealFrequency; i++) {
          const mealComponents = await generateMealComponents(
            caloriesPerMeal,
            proteinPerMeal,
            carbsPerMeal,
            fatPerMeal,
            dietaryPreferences,
            allergies,
            i
          );
          dailyMeals.push(mealComponents);
        }
        meals.push(dailyMeals);
      }
      
      setMealPlan({
        caloriesPerMeal,
        proteinPerMeal,
        carbsPerMeal,
        fatPerMeal,
        meals,
        weeklyPlan: planDuration === 'week'
      });
    } catch (err) {
      setError('Error generating meal plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate meal components based on dietary preferences
  const generateMealComponents = async (
    caloriesPerMeal: number,
    proteinPerMeal: number,
    carbsPerMeal: number,
    fatPerMeal: number,
    dietaryPreferences: string[],
    allergies: string[],
    mealIndex: number
  ): Promise<MealSection[]> => {
    // Determine cuisine preference for this meal
    // Alternate between different cuisines for variety
    let cuisinePreference: 'indian' | 'asian' | 'general' | 'all' = 'all';
    
    // Extract cuisine types from dietary preferences
    const cuisineTypes = [
      'indian', 'north-indian', 'south-indian', 'asian', 'chinese', 
      'japanese', 'thai', 'mexican', 'mediterranean', 'italian', 'middle-eastern'
    ];
    
    const selectedCuisines = dietaryPreferences.filter(pref => 
      cuisineTypes.includes(pref.toLowerCase())
    );
    
    // If specific cuisines are selected, rotate through them
    if (selectedCuisines.length > 0) {
      const cuisineIndex = mealIndex % selectedCuisines.length;
      const selectedCuisine = selectedCuisines[cuisineIndex];
      
      // Map the selected cuisine to one of our main cuisine categories
      if (selectedCuisine.includes('indian')) {
        cuisinePreference = 'indian';
      } else if (selectedCuisine.includes('asian') || 
                selectedCuisine.includes('chinese') || 
                selectedCuisine.includes('japanese') || 
                selectedCuisine.includes('thai')) {
        cuisinePreference = 'asian';
      } else {
        cuisinePreference = 'general';
      }
    } else {
      // Otherwise rotate through all cuisines
      const cuisines: ('indian' | 'asian' | 'general')[] = ['indian', 'asian', 'general'];
      cuisinePreference = cuisines[mealIndex % cuisines.length];
    }

    // Protein allocation (approximately 30-35% of calories)
    const proteinCalories = proteinPerMeal * 4; // 4 calories per gram of protein
    const proteinOptions = await getProteinOptions(
      Math.round(proteinCalories * 0.8), // Leave some room for other items
      cuisinePreference,
      dietaryPreferences,
      allergies
    );

    // Carbohydrate allocation (approximately 45-50% of calories)
    const carbCalories = carbsPerMeal * 4; // 4 calories per gram of carbs
    const carbOptions = await getCarbOptions(
      Math.round(carbCalories * 0.8), // Leave some room for other items
      cuisinePreference,
      dietaryPreferences,
      allergies
    );

    // Mixed dish allocation (to round out the meal)
    const remainingCalories = caloriesPerMeal - 
      (proteinOptions.options.reduce((sum, item) => sum + item.calories, 0) +
       carbOptions.options.reduce((sum, item) => sum + item.calories, 0));
    
    const mixedOptions = await getMixedDishOptions(
      Math.max(100, remainingCalories), // At least 100 calories for a mixed dish
      cuisinePreference,
      dietaryPreferences,
      allergies
    );

    return [proteinOptions, carbOptions, mixedOptions];
  };

  // Function to get protein options
  const getProteinOptions = async (
    targetCalories: number,
    cuisinePreference: 'indian' | 'asian' | 'general' | 'all',
    dietaryPreferences: string[],
    allergies: string[]
  ): Promise<MealSection> => {
    try {
      // Get protein foods from our database
      let proteinFoods = getFoodsByCategory(cuisinePreference, 'protein');
      
      // Filter based on dietary preferences
      if (dietaryPreferences.includes('vegetarian') || dietaryPreferences.includes('vegan')) {
        proteinFoods = proteinFoods.filter(food => 
          !['Tandoori Chicken', 'Steamed Fish', 'Tom Yum Soup'].includes(food.name)
        );
      }
      
      // Filter based on allergies (simplified - in a real app, would need a more robust system)
      if (allergies.includes('dairy')) {
        proteinFoods = proteinFoods.filter(food => !['Paneer'].includes(food.name));
      }
      if (allergies.includes('soy')) {
        proteinFoods = proteinFoods.filter(food => !['Tofu', 'Miso Soup with Tofu'].includes(food.name));
      }
      
      // Select 1-2 protein options randomly
      const numOptions = Math.min(proteinFoods.length, Math.random() > 0.5 ? 2 : 1);
      const selectedFoods: NutritionInfo[] = [];
      
      // Clone and shuffle the array
      const shuffledFoods = [...proteinFoods].sort(() => Math.random() - 0.5);
      
      // Calculate total calories needed
      let remainingCalories = targetCalories;
      
      for (let i = 0; i < numOptions && i < shuffledFoods.length; i++) {
        const food = shuffledFoods[i];
        const caloriesForThisItem = i === numOptions - 1 
          ? remainingCalories 
          : Math.round(remainingCalories / (numOptions - i));
        
        // Calculate portion size
        const portionSize = calculatePortion(food, caloriesForThisItem);
        const portionDescription = getPortionDescription(food, portionSize);
        
        // Calculate scaled nutritional values
        const scaleFactor = portionSize / food.serving_size_g;
        const scaledCalories = Math.round(food.calories * scaleFactor);
        const scaledProtein = Math.round(food.protein_g * scaleFactor * 10) / 10;
        const scaledCarbs = Math.round(food.carbohydrates_total_g * scaleFactor * 10) / 10;
        const scaledFat = Math.round(food.fat_total_g * scaleFactor * 10) / 10;
        
        selectedFoods.push({
          name: food.name,
          calories: scaledCalories,
          protein_g: scaledProtein,
          carbohydrates_total_g: scaledCarbs,
          fat_total_g: scaledFat,
          portion: portionDescription,
          description: food.description
        });
        
        remainingCalories -= scaledCalories;
      }
      
      return {
        type: 'Protein',
        options: selectedFoods,
      };
    } catch (error) {
      console.error('Error getting protein options:', error);
      throw error;
    }
  };

  // Function to get carbohydrate options
  const getCarbOptions = async (
    targetCalories: number,
    cuisinePreference: 'indian' | 'asian' | 'general' | 'all',
    dietaryPreferences: string[],
    allergies: string[]
  ): Promise<MealSection> => {
    try {
      // Get carb foods from our database
      let carbFoods = getFoodsByCategory(cuisinePreference, 'carb');
      
      // Filter based on dietary preferences
      if (dietaryPreferences.includes('keto') || dietaryPreferences.includes('low-carb')) {
        // For keto, minimize carbs and select very small portions
        targetCalories = Math.min(50, targetCalories);
      }
      
      // Filter based on allergies
      if (allergies.includes('gluten')) {
        carbFoods = carbFoods.filter(food => 
          !['Roti/Chapati', 'Paratha', 'Soba Noodles'].includes(food.name)
        );
      }
      
      // Select 1 carb option randomly
      const shuffledFoods = [...carbFoods].sort(() => Math.random() - 0.5);
      
      if (shuffledFoods.length === 0) {
        return {
          type: 'Carbohydrates',
          options: [],
        };
      }
      
      const food = shuffledFoods[0];
      
      // Calculate portion size
      const portionSize = calculatePortion(food, targetCalories);
      const portionDescription = getPortionDescription(food, portionSize);
      
      // Calculate scaled nutritional values
      const scaleFactor = portionSize / food.serving_size_g;
      const scaledCalories = Math.round(food.calories * scaleFactor);
      const scaledProtein = Math.round(food.protein_g * scaleFactor * 10) / 10;
      const scaledCarbs = Math.round(food.carbohydrates_total_g * scaleFactor * 10) / 10;
      const scaledFat = Math.round(food.fat_total_g * scaleFactor * 10) / 10;
      
      return {
        type: 'Carbohydrates',
        options: [{
          name: food.name,
          calories: scaledCalories,
          protein_g: scaledProtein,
          carbohydrates_total_g: scaledCarbs,
          fat_total_g: scaledFat,
          portion: portionDescription,
          description: food.description
        }],
      };
    } catch (error) {
      console.error('Error getting carb options:', error);
      throw error;
    }
  };

  // Function to get mixed dish options
  const getMixedDishOptions = async (
    targetCalories: number,
    cuisinePreference: 'indian' | 'asian' | 'general' | 'all',
    dietaryPreferences: string[],
    allergies: string[]
  ): Promise<MealSection> => {
    try {
      // Get mixed foods from our database
      let mixedFoods = getFoodsByCategory(cuisinePreference, 'mixed');
      
      // Filter based on dietary preferences
      if (dietaryPreferences.includes('vegetarian') || dietaryPreferences.includes('vegan')) {
        mixedFoods = mixedFoods.filter(food => 
          !['Tom Yum Soup'].includes(food.name)
        );
      }
      
      // Filter based on allergies
      if (allergies.includes('dairy')) {
        mixedFoods = mixedFoods.filter(food => 
          !['Palak Paneer'].includes(food.name)
        );
      }
      
      // Select 1 mixed dish option randomly
      const shuffledFoods = [...mixedFoods].sort(() => Math.random() - 0.5);
      
      if (shuffledFoods.length === 0) {
        return {
          type: 'Mixed Dishes',
          options: [],
        };
      }
      
      const food = shuffledFoods[0];
      
      // Calculate portion size
      const portionSize = calculatePortion(food, targetCalories);
      const portionDescription = getPortionDescription(food, portionSize);
      
      // Calculate scaled nutritional values
      const scaleFactor = portionSize / food.serving_size_g;
      const scaledCalories = Math.round(food.calories * scaleFactor);
      const scaledProtein = Math.round(food.protein_g * scaleFactor * 10) / 10;
      const scaledCarbs = Math.round(food.carbohydrates_total_g * scaleFactor * 10) / 10;
      const scaledFat = Math.round(food.fat_total_g * scaleFactor * 10) / 10;
      
      return {
        type: 'Mixed Dishes',
        options: [{
          name: food.name,
          calories: scaledCalories,
          protein_g: scaledProtein,
          carbohydrates_total_g: scaledCarbs,
          fat_total_g: scaledFat,
          portion: portionDescription,
          description: food.description
        }],
      };
    } catch (error) {
      console.error('Error getting mixed dish options:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (targetCalories && protein && carbs && fat && mealFrequency) {
      generateMealPlan();
    }
  }, [targetCalories, protein, carbs, fat, mealFrequency, dietaryPreferences, allergies, planDuration]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8" key={`meal-plan-${planDuration}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Personalized {planDuration === 'week' ? 'Weekly' : 'Daily'} Meal Plan</h2>
      
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Daily Nutritional Goals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
            <p className="font-medium text-gray-800 dark:text-white">{targetCalories}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
            <p className="font-medium text-gray-800 dark:text-white">{protein}g</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
            <p className="font-medium text-gray-800 dark:text-white">{carbs}g</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fat</p>
            <p className="font-medium text-gray-800 dark:text-white">{fat}g</p>
          </div>
        </div>
      </div>
      
      {!mealPlan && !loading && !error && (
        <button
          onClick={generateMealPlan}
          className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg shadow transition duration-200"
        >
          Generate Meal Plan
        </button>
      )}
      
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {mealPlan && (
        <div className="space-y-8">
          {mealPlan.weeklyPlan && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Select Day
              </h3>
              <div className="flex flex-wrap gap-2">
                {dayNames.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDay(index)}
                    className={`px-4 py-2 rounded-lg ${
                      activeDay === index
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mealPlan.meals[activeDay] && Array.from({ length: mealPlan.meals[activeDay].length }).map((_, mealIndex) => (
            <div key={mealIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Meal {mealIndex + 1}
                {mealIndex === 0 && <span className="text-sm font-normal ml-2 text-gray-500">(Breakfast)</span>}
                {mealIndex === 1 && mealPlan.meals[activeDay].length >= 3 && <span className="text-sm font-normal ml-2 text-gray-500">(Lunch)</span>}
                {mealIndex === 2 && mealPlan.meals[activeDay].length >= 3 && <span className="text-sm font-normal ml-2 text-gray-500">(Dinner)</span>}
                {mealIndex === 1 && mealPlan.meals[activeDay].length === 2 && <span className="text-sm font-normal ml-2 text-gray-500">(Dinner)</span>}
                {mealIndex >= 3 && <span className="text-sm font-normal ml-2 text-gray-500">(Snack)</span>}
              </h3>
              
              <div className="space-y-6">
                {mealPlan.meals[activeDay][mealIndex].map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{section.type}</h4>
                    <div className="space-y-4">
                      {section.options.length > 0 ? (
                        section.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-white">{option.name}</p>
                                {option.description && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{option.description}</p>
                                )}
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                  Portion: {option.portion}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{option.calories} cal</p>
                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                  <p>P: {option.protein_g}g</p>
                                  <p>C: {option.carbohydrates_total_g}g</p>
                                  <p>F: {option.fat_total_g}g</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm italic text-gray-500 dark:text-gray-400">
                          No suitable options found based on your preferences.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Meal Totals</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {mealPlan.meals[activeDay][mealIndex].flatMap(section => section.options)
                      .reduce((sum, item) => sum + item.calories, 0)} cal
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-primary-600 dark:text-primary-300">Nutrition Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>Stay hydrated by drinking at least 8 glasses of water daily</li>
              <li>Try to consume meals at regular intervals</li>
              <li>Include a variety of colorful vegetables in your diet</li>
              <li>Consider fiber-rich foods to maintain digestive health</li>
              <li>Listen to your body's hunger and fullness cues</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanDisplay; 