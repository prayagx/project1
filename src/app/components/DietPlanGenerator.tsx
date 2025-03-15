import { useState, useEffect } from 'react';
import ProgressSteps from './ui/ProgressSteps';
import MealPlanDisplay from './MealPlanDisplay';
import { generateDietPlan } from '../services/nutritionService';
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
  
  // Use external loading state if provided, otherwise use internal
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  // Track step changes for analytics
  useEffect(() => {
    if (currentStep > 0) {
      trackFormStep(currentStep);
    }
  }, [currentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
    } catch (error) {
      setError('Failed to generate diet plan. Please try again.');
      console.error(error);
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
                  {['Standard', 'Vegetarian', 'Vegan', 'Keto', 'Low-carb', 'Paleo', 'Mediterranean', 'Gluten-free'].map((diet) => (
                    <label key={diet} className="flex items-center space-x-2 sm:space-x-3">
                      <input
                        type="checkbox"
                        name="dietaryPreferences"
                        value={diet.toLowerCase()}
                        checked={formData.dietaryPreferences.includes(diet.toLowerCase())}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{diet}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cuisine Preferences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {['Indian', 'North Indian', 'South Indian', 'Asian', 'Chinese', 'Japanese', 'Thai', 'Mexican', 'Italian', 'Middle Eastern'].map((cuisine) => (
                    <label key={cuisine} className="flex items-center space-x-2 sm:space-x-3">
                      <input
                        type="checkbox"
                        name="dietaryPreferences"
                        value={cuisine.toLowerCase().replace(' ', '-')}
                        checked={formData.dietaryPreferences.includes(cuisine.toLowerCase().replace(' ', '-'))}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{cuisine}</span>
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
                  <label htmlFor="planDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plan Duration
                  </label>
                  <select
                    id="planDuration"
                    name="planDuration"
                    value={formData.planDuration}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="day">Single Day</option>
                    <option value="week">Full Week</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Personalized {results.planDuration === 'week' ? 'Weekly' : 'Daily'} Meal Plan
              </h3>
              <button
                onClick={generatePlan}
                className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition duration-200 flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate Plan
              </button>
            </div>
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
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition duration-200"
              >
                Back
              </button>
              
              <button
                onClick={handlePrintPlan}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Plan
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Update case 4 in renderStep to track print events
  const handlePrintPlan = () => {
    trackPlanExport('print');
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        {currentStep < 4 ? 'Generate Your Custom Diet Plan' : 'Your Personalized Diet Plan'}
      </h2>

      <div className="mb-8">
        <ProgressSteps steps={4} currentStep={currentStep} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || loading}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                     text-gray-800 dark:text-white rounded-lg transition duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type={currentStep === 3 ? 'submit' : 'button'}
              onClick={currentStep < 3 ? () => setCurrentStep(currentStep + 1) : undefined}
              disabled={loading}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg 
                     transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                currentStep < 3 ? 'Next' : 'Generate Plan'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
} 