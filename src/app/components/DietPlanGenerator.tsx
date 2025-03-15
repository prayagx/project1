import { useState, useEffect } from 'react';
import ProgressSteps from './ui/ProgressSteps';
import MealPlanDisplay from './MealPlanDisplay';
import ErrorMessage from './ui/ErrorMessage';
import { generateDietPlan, dietTypes, DietType } from '../services/nutritionService';
import { 
  trackFormStep, 
  trackDietPlanGeneration,
  trackPlanExport,
  EventCategory,
  trackEvent
} from '../utils/analytics';

export interface FormData {
  weight: string;
  height: string;
  age: string;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  dietaryPreferences: string[];
  allergies: string[];
  mealFrequency: string;
  planDuration: 'day' | 'week';
}

interface ResultsData {
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealFrequency: number;
  dietaryPreferences: string[];
  allergies: string[];
  planDuration: 'day' | 'week';
}

interface DietPlanGeneratorProps {
  onSubmit?: (formData: FormData) => void;
  loading?: boolean;
}

export default function DietPlanGenerator({ onSubmit, loading: externalLoading }: DietPlanGeneratorProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryPreferences: [],
    allergies: [],
    mealFrequency: '3',
    planDuration: 'day',
  });
  const [results, setResults] = useState<ResultsData>({
    targetCalories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    mealFrequency: 3,
    dietaryPreferences: [],
    allergies: [],
    planDuration: 'day'
  });
  const [error, setError] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [planKey, setPlanKey] = useState(Date.now()); // Add key for forcing re-renders
  
  // Use external loading state if provided, otherwise use internal
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track step changes for analytics
  useEffect(() => {
    if (currentStep > 0) {
      trackFormStep(currentStep);
    }
  }, [currentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for plan duration changes to force refresh
    if (name === 'planDuration' && value !== formData.planDuration) {
      setPlanKey(Date.now());
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name as keyof FormData] as string[], value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name as keyof FormData] as string[]).filter(
          (item) => item !== value
        ),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onSubmit) {
        // Track for analytics before submitting
        trackEvent(
          'form_submit', 
          EventCategory.CONVERSION, 
          `Preferences: ${formData.dietaryPreferences.join(',')}`,
          parseInt(formData.weight)
        );
        onSubmit(formData);
      } else {
        generatePlan();
      }
    }
  };

  const generatePlan = () => {
    // Validate form data
    if (!formData.weight || !formData.height || !formData.age) {
      setError('Please fill out all required fields');
      return;
    }

    // Reset any previous errors
    setError('');
    setInternalLoading(true);
    
    try {
      // Generate diet plan
      const dietPlan = generateDietPlan(
        parseInt(formData.weight),
        parseInt(formData.height),
        parseInt(formData.age),
        formData.gender,
        formData.activityLevel,
        formData.goal,
        formData.dietaryPreferences,
        formData.planDuration as 'day' | 'week'
      );

      // Track plan generation for analytics
      trackDietPlanGeneration(
        formData.dietaryPreferences,
        parseInt(formData.mealFrequency),
        formData.planDuration,
        dietPlan.targetCalories
      );

      // Update form with diet plan results
      setResults({
        targetCalories: dietPlan.targetCalories,
        protein: dietPlan.macros.protein,
        carbs: dietPlan.macros.carbs,
        fat: dietPlan.macros.fat,
        mealFrequency: parseInt(formData.mealFrequency),
        dietaryPreferences: formData.dietaryPreferences,
        allergies: formData.allergies,
        planDuration: formData.planDuration
      });
      
      // Move to next step
      setCurrentStep(4);
      
      // Force refresh of meal plan component
      setPlanKey(Date.now());
    } catch (error) {
      setError('Failed to generate diet plan. Please try again.');
      console.error('Diet plan generation error:', error);
      // Track error for analytics
      trackEvent(
        'generation_error',
        EventCategory.ENGAGEMENT,
        'Diet plan generation failed'
      );
    } finally {
      setInternalLoading(false);
    }
  };

  // Function to handle going back to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to handle plan duration change specifically
  const handlePlanDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = e.target.value as 'day' | 'week';
    
    // Force a complete refresh when changing plan duration
    setPlanKey(Date.now());
    
    setFormData({
      ...formData,
      planDuration: newDuration
    });
    
    // If we're already on the results step, update results too
    if (currentStep === 4) {
      setResults({
        ...results,
        planDuration: newDuration
      });
    }
  };

  // Function to reset and start over
  const handleReset = () => {
    setCurrentStep(1);
    setError('');
    setPlanKey(Date.now());
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Activity & Goals
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                  <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
                  <option value="active">Active (hard exercise 6-7 days/week)</option>
                  <option value="very_active">Very active (very hard exercise daily, or physical job)</option>
                </select>
              </div>
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal
                </label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="lose">Lose weight</option>
                  <option value="maintain">Maintain weight</option>
                  <option value="gain">Gain weight</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Dietary Preferences
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Your Dietary Preferences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {dietTypes.map((diet) => (
                    <label key={diet.value} className="flex items-center space-x-2 sm:space-x-3">
                      <input
                        type="checkbox"
                        name="dietaryPreferences"
                        value={diet.value}
                        checked={formData.dietaryPreferences.includes(diet.value)}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{diet.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Any Allergies or Restrictions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {['Dairy', 'Nuts', 'Shellfish', 'Gluten', 'Eggs', 'Soy', 'Fish', 'Wheat', 'Sesame', 'Peanuts'].map((allergy) => (
                    <label key={allergy} className="flex items-center space-x-2 sm:space-x-3">
                      <input
                        type="checkbox"
                        name="allergies"
                        value={allergy.toLowerCase()}
                        checked={formData.allergies.includes(allergy.toLowerCase())}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mealFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meals per Day
                  </label>
                  <select
                    id="mealFrequency"
                    name="mealFrequency"
                    value={formData.mealFrequency}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="2">2 (Breakfast, Dinner)</option>
                    <option value="3">3 (Breakfast, Lunch, Dinner)</option>
                    <option value="4">4 (Breakfast, Lunch, Dinner, Snack)</option>
                    <option value="5">5 (Breakfast, Morning Snack, Lunch, Evening Snack, Dinner)</option>
                    <option value="6">6 (Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, Evening Snack)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plan Duration
                  </label>
                  <select
                    id="planDuration"
                    name="planDuration"
                    value={formData.planDuration}
                    onChange={handlePlanDurationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="day">Single Day Plan</option>
                    <option value="week">Full Week Plan</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Weekly plans provide variety across 7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Your Personalized Meal Plan
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Start Over
                </button>
                <select
                  value={results.planDuration}
                  onChange={(e) => {
                    setResults({
                      ...results,
                      planDuration: e.target.value as 'day' | 'week'
                    });
                    setPlanKey(Date.now());
                  }}
                  className="text-sm px-3 py-1 border border-gray-300 rounded-md shadow-sm
                          focus:outline-none focus:ring-blue-500 focus:border-blue-500
                          dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="day">Daily Plan</option>
                  <option value="week">Weekly Plan</option>
                </select>
              </div>
            </div>

            {error && (
              <ErrorMessage 
                message="Failed to generate meal plan"
                details={error}
                severity="error"
                onRetry={generatePlan}
                retryLabel="Try Again"
              />
            )}
            
            <div key={planKey}>
              <MealPlanDisplay
                targetCalories={results.targetCalories}
                protein={results.protein}
                carbs={results.carbs}
                fat={results.fat}
                mealFrequency={results.mealFrequency}
                dietaryPreferences={results.dietaryPreferences}
                allergies={results.allergies}
                planDuration={results.planDuration}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Don't render until client-side hydration is complete
  if (!isClient && currentStep === 4) {
    return (
      <div className="animate-pulse flex flex-col space-y-4 p-4">
        <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <ProgressSteps
          steps={['Personal Info', 'Body Stats', 'Preferences', 'Your Plan']}
          currentStep={currentStep}
        />
        
        <form onSubmit={handleSubmit} className="mt-8">
          {renderStep()}
          
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 
                        bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Back
              </button>
            )}
            
            {currentStep < 4 && (
              <button
                type="submit"
                className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        dark:bg-blue-500 dark:hover:bg-blue-600 ${currentStep === 1 ? "ml-auto" : ""}`}
              >
                {currentStep === 3 ? 'Generate Plan' : 'Next'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 