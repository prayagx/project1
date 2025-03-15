import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getNutritionInfo } from '../services/nutritionService';
import { FoodItem, getFoodsByCategory, calculatePortion, getPortionDescription } from '../services/foodDatabase';
import ErrorMessage from './ui/ErrorMessage';

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
  const [isClient, setIsClient] = useState(false);
  const [key, setKey] = useState(Date.now()); // Add a key for forced re-renders when plan type changes
  
  // For progressive loading of weekly plans
  const [progressiveDays, setProgressiveDays] = useState<number[]>([]);
  const [daysLoaded, setDaysLoaded] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  
  // Use a ref to track whether component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Fix for hydration errors - only run on client side
  useEffect(() => {
    setIsClient(true);
    
    // Generate meal plan on component mount, but only on client side
    if (typeof window !== 'undefined') {
      generateMealPlan();
    }
  }, []);
  
  // Track changes to plan duration specifically to properly reset state
  useEffect(() => {
    if (isClient) {
      // Reset everything when plan duration changes
      setMealPlan(null);
      setProgressiveDays([]);
      setDaysLoaded(0);
      setProgressPercent(0);
      setActiveDay(0);
      setKey(Date.now());
      
      // Regenerate the meal plan with the new duration
      generateMealPlan();
    }
  }, [planDuration, isClient]);
  
  // Regenerate meal plan when other props change
  useEffect(() => {
    if (isClient) {
      generateMealPlan();
    }
  }, [targetCalories, protein, carbs, fat, mealFrequency, dietaryPreferences, allergies, isClient]);
  
  // Helper function to get a deterministic hash from a string
  const getStringHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  // Helper function to get deterministic seed
  const getSeed = (day: number, meal: number, userInputs: string) => {
    const inputHash = getStringHash(userInputs);
    return inputHash + (day * 1000) + meal;
  };

  // Function to generate a single day's meal plan
  const generateDayMealPlan = useCallback(async (
    day: number, 
    userInputs: string, 
    caloriesPerMeal: number,
    proteinPerMeal: number,
    carbsPerMeal: number,
    fatPerMeal: number
  ) => {
    const dailyMeals: MealSection[][] = [];
    
    for (let i = 0; i < mealFrequency; i++) {
      const seed = getSeed(day, i, userInputs);
      const mealComponents = await generateMealComponents(
        caloriesPerMeal,
        proteinPerMeal,
        carbsPerMeal,
        fatPerMeal,
        dietaryPreferences,
        allergies,
        seed
      );
      dailyMeals.push(mealComponents);
    }
    
    return dailyMeals;
  }, [mealFrequency, dietaryPreferences, allergies]);

  const generateMealPlan = async (isRegeneration = false) => {
    if (!isClient) return; // Only generate on client-side
    
    setLoading(true);
    setError(null);
    
    try {
      // For regeneration, we should reset all states
      if (isRegeneration) {
        // Reset states
        setMealPlan(null);
        setProgressiveDays([]);
        setDaysLoaded(0);
        setProgressPercent(0);
        setKey(Date.now()); // Force re-render
      }
      
      // Calculate calories and macros per meal
      const caloriesPerMeal = Math.round(targetCalories / mealFrequency);
      const proteinPerMeal = Math.round(protein / mealFrequency);
      const carbsPerMeal = Math.round(carbs / mealFrequency);
      const fatPerMeal = Math.round(fat / mealFrequency);
      
      // Create a deterministic seed based on user inputs but add a random element for regeneration
      // This ensures a different set of meals while still being deterministic for initial rendering
      const randomSeed = isRegeneration ? Date.now().toString() : '';
      const userInputs = `${targetCalories}-${protein}-${carbs}-${fat}-${mealFrequency}-${dietaryPreferences.join(',')}-${allergies.join(',')}-${randomSeed}`;
      
      // Generate meal components for each meal
      const meals: MealSection[][][] = [];
      
      // For weekly plan, use progressive loading
      if (planDuration === 'week') {
        // Reset progressive loading state
        setProgressiveDays([0]); // Start with just the first day
        setDaysLoaded(0);
        setProgressPercent(0);
        
        // First generate day 0 to show immediately
        const day0Meals = await generateDayMealPlan(
          0, userInputs, caloriesPerMeal, proteinPerMeal, carbsPerMeal, fatPerMeal
        );
        meals.push(day0Meals);
        
        // Create the meal plan with just the first day for now
        if (isMounted.current) {
          setMealPlan({
            caloriesPerMeal,
            proteinPerMeal,
            carbsPerMeal,
            fatPerMeal,
            meals,
            weeklyPlan: true
          });
        }
        
        // Make a copy of the first day for fallback
        const fallbackDay = [...day0Meals];
        
        // Then progressively load the rest of the days
        // This allows the UI to be responsive while the rest of the days load
        const allDays: MealSection[][][] = [];
        
        // Use Promise.all with a limited concurrency to generate all days more efficiently
        // but still maintain some parallelism
        const dayPromises = [];
        
        for (let day = 1; day < 7; day++) {
          // Create a promise for each day
          const dayPromise = (async (dayIndex) => {
            if (!isMounted.current) return null;
            
            try {
              // Small delay to not block the main thread
              await new Promise(resolve => setTimeout(resolve, 30));
              
              // Generate the meal plan for this day
              const dailyMeals = await generateDayMealPlan(
                dayIndex, userInputs, caloriesPerMeal, proteinPerMeal, carbsPerMeal, fatPerMeal
              );
              
              return { dayIndex, dailyMeals };
            } catch (error) {
              console.error(`Error generating day ${dayIndex}:`, error);
              // Return a copy of the first day as a fallback
              return { dayIndex, dailyMeals: fallbackDay };
            }
          })(day);
          
          dayPromises.push(dayPromise);
        }
        
        // Process the results in order as they complete
        for (const promise of dayPromises) {
          const result = await promise;
          if (result && isMounted.current) {
            const { dayIndex, dailyMeals } = result;
            
            // Store the day's meals
            allDays[dayIndex - 1] = dailyMeals;
            
            // Update the meal plan with the new day
            setMealPlan(prevMealPlan => {
              if (!prevMealPlan) return null;
              
              // Create a deep copy of the existing meals
              const updatedMeals = [...prevMealPlan.meals];
              
              // Add the new day at the correct index
              updatedMeals[dayIndex] = dailyMeals;
              
              return {
                ...prevMealPlan,
                meals: updatedMeals
              };
            });
            
            // Update progress indicators
            setDaysLoaded(prev => prev + 1);
            setProgressiveDays(prev => [...prev, dayIndex]);
            setProgressPercent(Math.round(((daysLoaded + 1) / 7) * 100));
          }
        }
        
        // Ensure we have all 7 days after all promises have completed
        if (isMounted.current) {
          // Check if all days were generated properly
          setMealPlan(prevMealPlan => {
            if (!prevMealPlan) return null;
            
            // Create a complete meal plan with 7 days
            const completeMeals = [...prevMealPlan.meals];
            
            // Fill in any missing days with the fallback
            for (let i = 0; i < 7; i++) {
              if (!completeMeals[i]) {
                console.warn(`Missing day ${i}, using fallback`);
                completeMeals[i] = fallbackDay;
              }
            }
            
            return {
              ...prevMealPlan,
              meals: completeMeals.slice(0, 7) // Ensure exactly 7 days
            };
          });
          
          // Mark all days as loaded
          setDaysLoaded(7);
          setProgressiveDays([0, 1, 2, 3, 4, 5, 6]);
          setProgressPercent(100);
        }
      } else {
        // Single day plan - much simpler
        const dailyMeals = await generateDayMealPlan(
          0, userInputs, caloriesPerMeal, proteinPerMeal, carbsPerMeal, fatPerMeal
        );
        meals.push(dailyMeals);
        
        if (isMounted.current) {
          setMealPlan({
            caloriesPerMeal,
            proteinPerMeal,
            carbsPerMeal,
            fatPerMeal,
            meals,
            weeklyPlan: false
          });
        }
      }
    } catch (err) {
      if (isMounted.current) {
        setError('Error generating meal plan. Please try again.');
        console.error(err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
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
    seed: number
  ): Promise<MealSection[]> => {
    // Use deterministic logic for cuisine selection based on seed
    let cuisinePreference: 'indian' | 'asian' | 'general' | 'all' = 'all';
    
    // Extract cuisine types from dietary preferences
    const cuisineTypes = [
      'indian', 'north-indian', 'south-indian', 'asian', 'chinese', 
      'japanese', 'thai', 'mexican', 'mediterranean', 'italian', 'middle-eastern'
    ];
    
    const selectedCuisines = dietaryPreferences.filter(pref => 
      cuisineTypes.includes(pref.toLowerCase())
    );
    
    // If specific cuisines are selected, deterministically select one based on seed
    if (selectedCuisines.length > 0) {
      const cuisineIndex = seed % selectedCuisines.length;
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
      // Otherwise deterministically select a cuisine based on seed
      const cuisines: ('indian' | 'asian' | 'general')[] = ['indian', 'asian', 'general'];
      cuisinePreference = cuisines[seed % cuisines.length];
    }

    // Protein allocation (approximately 30-35% of calories)
    const proteinCalories = proteinPerMeal * 4; // 4 calories per gram of protein
    const proteinOptions = await getProteinOptions(
      Math.round(proteinCalories * 0.8), // Leave some room for other items
      cuisinePreference,
      dietaryPreferences,
      allergies,
      seed
    );

    // Carbohydrate allocation (approximately 45-50% of calories)
    const carbCalories = carbsPerMeal * 4; // 4 calories per gram of carbs
    const carbOptions = await getCarbOptions(
      Math.round(carbCalories * 0.8), // Leave some room for other items
      cuisinePreference,
      dietaryPreferences,
      allergies,
      seed + 1 // Ensure different deterministic selection than proteins
    );

    // Mixed dish allocation (to round out the meal)
    const remainingCalories = caloriesPerMeal - 
      (proteinOptions.options.reduce((sum, item) => sum + item.calories, 0) +
       carbOptions.options.reduce((sum, item) => sum + item.calories, 0));
    
    const mixedOptions = await getMixedDishOptions(
      Math.max(100, remainingCalories), // At least 100 calories for a mixed dish
      cuisinePreference,
      dietaryPreferences,
      allergies,
      seed + 2 // Ensure different deterministic selection than proteins and carbs
    );

    return [proteinOptions, carbOptions, mixedOptions];
  };

  // Function to get protein options with deterministic selection
  const getProteinOptions = async (
    targetCalories: number,
    cuisinePreference: 'indian' | 'asian' | 'general' | 'all',
    dietaryPreferences: string[],
    allergies: string[],
    seed: number
  ): Promise<MealSection> => {
    try {
      // Get protein foods from our database
      let proteinFoods = getFoodsByCategory(cuisinePreference, 'protein');
      
      // If no foods match the current cuisine, expand to all cuisines
      if (proteinFoods.length === 0) {
        proteinFoods = getFoodsByCategory('all', 'protein');
      }
      
      // Filter based on dietary preferences
      if (dietaryPreferences.includes('vegetarian') || dietaryPreferences.includes('vegan')) {
        proteinFoods = proteinFoods.filter(food => 
          !['Tandoori Chicken', 'Steamed Fish', 'Tom Yum Soup'].includes(food.name)
        );
      }
      
      // Filter based on allergies
      if (allergies.includes('dairy')) {
        proteinFoods = proteinFoods.filter(food => !['Paneer', 'Palak Paneer'].includes(food.name));
      }
      if (allergies.includes('soy')) {
        proteinFoods = proteinFoods.filter(food => !['Tofu', 'Miso Soup with Tofu'].includes(food.name));
      }
      
      // Fallback options if no suitable foods are found after filtering
      if (proteinFoods.length === 0) {
        // Create a generic protein option based on dietary preferences
        if (dietaryPreferences.includes('vegan')) {
          return {
            type: 'protein',
            options: [{
              name: 'Chickpeas',
              calories: Math.round(targetCalories * 0.8),
              protein_g: Math.round((targetCalories * 0.25) / 4), // 25% of calories from protein
              carbohydrates_total_g: Math.round((targetCalories * 0.6) / 4), // 60% from carbs
              fat_total_g: Math.round((targetCalories * 0.15) / 9), // 15% from fat
              portion: '100g serving',
              description: 'Protein-rich legumes, perfect for plant-based diets'
            }]
          };
        } else if (dietaryPreferences.includes('vegetarian')) {
          return {
            type: 'protein',
            options: [{
              name: 'Lentils',
              calories: Math.round(targetCalories * 0.8),
              protein_g: Math.round((targetCalories * 0.3) / 4), // 30% of calories from protein
              carbohydrates_total_g: Math.round((targetCalories * 0.5) / 4), // 50% from carbs
              fat_total_g: Math.round((targetCalories * 0.2) / 9), // 20% from fat
              portion: '100g serving',
              description: 'Versatile, protein-packed legumes'
            }]
          };
        } else {
          return {
            type: 'protein',
            options: [{
              name: 'Grilled Chicken',
              calories: Math.round(targetCalories * 0.8),
              protein_g: Math.round((targetCalories * 0.7) / 4), // 70% of calories from protein
              carbohydrates_total_g: 0, // No carbs
              fat_total_g: Math.round((targetCalories * 0.3) / 9), // 30% from fat
              portion: '100g serving',
              description: 'Lean protein source, perfect for any diet plan'
            }]
          };
        }
      }
      
      // Use a deterministic selection method
      // Sort by name for consistency
      const sortedFoods = [...proteinFoods].sort((a, b) => a.name.localeCompare(b.name));
      
      // Select 1-2 protein options based on deterministic logic
      const numOptions = Math.min(proteinFoods.length, (seed % 2) + 1); // Either 1 or 2 options
      const selectedFoods: NutritionInfo[] = [];
      
      // Calculate total calories needed
      let remainingCalories = targetCalories;
      
      for (let i = 0; i < numOptions && i < sortedFoods.length; i++) {
        // Use deterministic index calculation
        const index = (seed + i) % sortedFoods.length;
        const food = sortedFoods[index];
        
        // Calculate portion based on remaining calories
        const caloriesForThisItem = i === numOptions - 1 
          ? remainingCalories 
          : Math.round(remainingCalories / (numOptions - i));
        
        const portion = calculatePortion(food, caloriesForThisItem);
        const portionDescription = getPortionDescription(food, portion);
        
        // Add to selected foods
        selectedFoods.push({
          name: food.name,
          calories: Math.round(food.calories * portion),
          protein_g: Math.round(food.protein_g * portion * 10) / 10,
          carbohydrates_total_g: Math.round(food.carbohydrates_total_g * portion * 10) / 10,
          fat_total_g: Math.round(food.fat_total_g * portion * 10) / 10,
          portion: portionDescription,
          description: food.description
        });
        
        // Update remaining calories
        remainingCalories -= Math.round(food.calories * portion);
      }
      
      return {
        type: 'protein',
        options: selectedFoods
      };
    } catch (error) {
      console.error('Error getting protein options:', error);
      // Return a fallback option in case of error
      return {
        type: 'protein',
        options: [{
          name: 'Protein Source',
          calories: Math.round(targetCalories * 0.8),
          protein_g: Math.round((targetCalories * 0.7) / 4),
          carbohydrates_total_g: 0,
          fat_total_g: Math.round((targetCalories * 0.3) / 9),
          portion: '100g serving',
          description: 'High-quality protein source'
        }]
      };
    }
  };

  // Function to get carbohydrate options
  const getCarbOptions = async (
    targetCalories: number,
    cuisinePreference: 'indian' | 'asian' | 'general' | 'all',
    dietaryPreferences: string[],
    allergies: string[],
    seed: number
  ): Promise<MealSection> => {
    try {
      // Get carb foods from our database
      let carbFoods = getFoodsByCategory(cuisinePreference, 'carb');
      
      // If no foods match the current cuisine, expand to all cuisines
      if (carbFoods.length === 0) {
        carbFoods = getFoodsByCategory('all', 'carb');
      }
      
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
      
      // Fallback if no suitable foods are found
      if (carbFoods.length === 0) {
        // Default generic carb option
        if (dietaryPreferences.includes('keto') || dietaryPreferences.includes('low-carb')) {
          return {
            type: 'Carbohydrates',
            options: [{
              name: 'Leafy Greens',
              calories: 25,
              protein_g: 2,
              carbohydrates_total_g: 4,
              fat_total_g: 0.5,
              portion: 'Large serving',
              description: 'Low-carb vegetables, perfect for keto and low-carb diets'
            }]
          };
        } else {
          return {
            type: 'Carbohydrates',
            options: [{
              name: 'Rice',
              calories: Math.min(targetCalories, 150),
              protein_g: Math.round((targetCalories * 0.1) / 4),
              carbohydrates_total_g: Math.round((targetCalories * 0.8) / 4),
              fat_total_g: Math.round((targetCalories * 0.1) / 9),
              portion: 'Regular serving',
              description: 'Versatile staple carbohydrate'
            }]
          };
        }
      }
      
      // Use deterministic selection instead of random
      // Sort by name for consistency
      const sortedFoods = [...carbFoods].sort((a, b) => a.name.localeCompare(b.name));
      
      if (sortedFoods.length === 0) {
        return {
          type: 'Carbohydrates',
          options: [],
        };
      }
      
      // Use deterministic index based on targetCalories
      const index = targetCalories % sortedFoods.length;
      const food = sortedFoods[index];
      
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
      // Return a fallback option in case of error
      return {
        type: 'Carbohydrates',
        options: [{
          name: 'Carbohydrate Source',
          calories: Math.min(targetCalories, 150),
          protein_g: 3,
          carbohydrates_total_g: Math.round((targetCalories * 0.8) / 4),
          fat_total_g: 1,
          portion: 'Regular serving',
          description: 'Healthy complex carbohydrates'
        }]
      };
    }
  };

  // Function to get mixed dish options
  const getMixedDishOptions = async (
    targetCalories: number,
    cuisinePreference: 'indian' | 'asian' | 'general' | 'all',
    dietaryPreferences: string[],
    allergies: string[],
    seed: number
  ): Promise<MealSection> => {
    try {
      // Get mixed foods from our database
      let mixedFoods = getFoodsByCategory(cuisinePreference, 'mixed');
      
      // If no foods match the current cuisine, expand to all cuisines
      if (mixedFoods.length === 0) {
        mixedFoods = getFoodsByCategory('all', 'mixed');
      }
      
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
      
      // Fallback if no suitable foods are found
      if (mixedFoods.length === 0) {
        // Default generic mixed dish option based on dietary preferences
        if (dietaryPreferences.includes('vegan')) {
          return {
            type: 'Mixed Dish',
            options: [{
              name: 'Vegetable Stir Fry',
              calories: targetCalories,
              protein_g: Math.round((targetCalories * 0.15) / 4),
              carbohydrates_total_g: Math.round((targetCalories * 0.6) / 4),
              fat_total_g: Math.round((targetCalories * 0.25) / 9),
              portion: 'Regular serving',
              description: 'Colorful mix of vegetables in a savory sauce'
            }]
          };
        } else if (dietaryPreferences.includes('vegetarian')) {
          return {
            type: 'Mixed Dish',
            options: [{
              name: 'Vegetable Curry',
              calories: targetCalories,
              protein_g: Math.round((targetCalories * 0.2) / 4),
              carbohydrates_total_g: Math.round((targetCalories * 0.5) / 4),
              fat_total_g: Math.round((targetCalories * 0.3) / 9),
              portion: 'Regular serving',
              description: 'Flavorful vegetable curry in aromatic sauce'
            }]
          };
        } else {
          return {
            type: 'Mixed Dish',
            options: [{
              name: 'Stir Fried Vegetables with Chicken',
              calories: targetCalories,
              protein_g: Math.round((targetCalories * 0.3) / 4),
              carbohydrates_total_g: Math.round((targetCalories * 0.4) / 4),
              fat_total_g: Math.round((targetCalories * 0.3) / 9),
              portion: 'Regular serving',
              description: 'Nutritious combination of protein and vegetables'
            }]
          };
        }
      }
      
      // Use deterministic selection instead of random
      // Sort by name for consistency
      const sortedFoods = [...mixedFoods].sort((a, b) => a.name.localeCompare(b.name));
      
      if (sortedFoods.length === 0) {
        return {
          type: 'Mixed Dish',
          options: [],
        };
      }
      
      // Use deterministic index calculation based on calorie target
      const index = (targetCalories * 2) % sortedFoods.length;
      const food = sortedFoods[index];
      
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
        type: 'Mixed Dish',
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
      // Return a fallback option in case of error
      return {
        type: 'Mixed Dish',
        options: [{
          name: 'Mixed Vegetable Dish',
          calories: targetCalories,
          protein_g: Math.round((targetCalories * 0.2) / 4),
          carbohydrates_total_g: Math.round((targetCalories * 0.5) / 4),
          fat_total_g: Math.round((targetCalories * 0.3) / 9),
          portion: 'Regular serving',
          description: 'Balanced blend of nutrients in a flavorful dish'
        }]
      };
    }
  };

  // If not client-side yet, show minimal loading state to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="animate-pulse flex flex-col space-y-4 p-4">
        <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
      </div>
    );
  }

  // Loading state when initially generating the meal plan
  if (loading && !mealPlan) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Generating your {planDuration === 'week' ? 'weekly' : 'daily'} meal plan...
        </p>
      </div>
    );
  }

  // Loading state when progressively loading weekly plan days
  if (mealPlan?.weeklyPlan && daysLoaded < 7 && progressPercent < 100) {
    return (
      <div className="space-y-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              Your Personalized Weekly Meal Plan
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>Loading meal data for all 7 days...</p>
              <p>Days loaded: {daysLoaded} of 7 ({progressPercent}% complete)</p>
            </div>
          </div>
        </div>
        
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        {/* Show partially loaded content if we have at least one day */}
        {daysLoaded > 0 && (
          <div>
            <div className="mt-4 mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Days loaded so far:
              </h3>
              <button
                onClick={() => setLoading(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                View Available Days
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {progressiveDays.map((day) => (
                <span 
                  key={day} 
                  className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 rounded-full text-sm"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-6">
        <ErrorMessage 
          message="Error Generating Meal Plan"
          details={error}
          severity="error"
          onRetry={generateMealPlan}
          retryLabel="Try Again"
        />
      </div>
    );
  }

  if (!mealPlan) {
    return null;
  }

  // Main meal plan display
  return (
    <div key={key} className="mb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Your Personalized {planDuration === 'week' ? 'Weekly' : 'Daily'} Meal Plan
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>Target: {mealPlan?.caloriesPerMeal} calories per meal ({targetCalories} daily total)</p>
            <p>Macros per meal: {mealPlan?.proteinPerMeal}g protein, {mealPlan?.carbsPerMeal}g carbs, {mealPlan?.fatPerMeal}g fat</p>
          </div>
        </div>
        <button
          onClick={() => generateMealPlan(true)}
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md shadow hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
          aria-label="Regenerate meal plan"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Regenerating...
            </span>
          ) : (
            'Regenerate Meals'
          )}
        </button>
      </div>

      {/* Weekly plan tabs for day selection */}
      {planDuration === 'week' && mealPlan?.weeklyPlan && mealPlan.meals.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
              <button
                key={day}
                onClick={() => setActiveDay(index)}
                disabled={!mealPlan.meals[index] || !progressiveDays.includes(index)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !mealPlan.meals[index] || !progressiveDays.includes(index)
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
                    : activeDay === index
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={`View ${day}'s meal plan`}
                aria-selected={activeDay === index}
                role="tab"
              >
                {day}
                {(!mealPlan.meals[index] || !progressiveDays.includes(index)) && (
                  <span className="ml-1 opacity-70">...</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ensure we have meals for the active day before rendering */}
      {mealPlan.meals[activeDay] ? (
        mealPlan.meals[activeDay].map((meal: MealSection[], mealIndex: number) => (
          <div key={mealIndex} className="mb-8">
            <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
              Meal {mealIndex + 1}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {meal.map((section: MealSection, sectionIndex: number) => (
                <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300 capitalize">
                    {section.type === 'protein' ? 'Protein Source' : 
                     section.type === 'Carbohydrates' ? 'Carbohydrate Source' : 'Mixed Dish'}
                  </h4>
                  <div className="space-y-3">
                    {section.options.length > 0 ? (
                      section.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                          <div className="font-medium text-gray-800 dark:text-white">{option.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{option.portion}</div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {option.calories} cal | P: {option.protein_g}g | C: {option.carbohydrates_total_g}g | F: {option.fat_total_g}g
                          </div>
                          {option.description && (
                            <div className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">
                              {option.description}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        No specific options available with your current preferences.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Meal plan for this day is not yet available. Please try again or select another day.
          </p>
          <button 
            onClick={() => generateMealPlan(true)} 
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Regenerate Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default MealPlanDisplay; 