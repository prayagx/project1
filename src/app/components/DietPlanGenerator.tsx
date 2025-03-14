import { useState } from 'react';

export interface FormData {
  age: string;
  weight: string;
  height: string;
  gender: string;
  activityLevel: string;
  goal: string;
  dietaryPreferences: string[];
  allergies: string[];
  mealFrequency: string;
}

interface DietPlanGeneratorProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

export function DietPlanGenerator({ onSubmit, loading }: DietPlanGeneratorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryPreferences: [],
    allergies: [],
    mealFrequency: '3',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
        ? [...prev[name as keyof FormData] as string[], value]
        : (prev[name as keyof FormData] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      await onSubmit(formData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Activity & Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Activity Level
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="moderate">Moderate (light exercise 1-3 days/week)</option>
                  <option value="active">Active (moderate exercise 3-5 days/week)</option>
                  <option value="veryActive">Very Active (hard exercise 6-7 days/week)</option>
                  <option value="extraActive">Extra Active (very hard exercise & physical job)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Goal
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Meal Frequency
                </label>
                <select
                  name="mealFrequency"
                  value={formData.mealFrequency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="2">2 meals per day</option>
                  <option value="3">3 meals per day</option>
                  <option value="4">4 meals per day</option>
                  <option value="5">5 meals per day</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Dietary Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Your Dietary Preferences
                </label>
                <div className="space-y-2">
                  {['Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Mediterranean'].map((pref) => (
                    <label key={pref} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="dietaryPreferences"
                        value={pref.toLowerCase()}
                        checked={formData.dietaryPreferences.includes(pref.toLowerCase())}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Allergies & Restrictions
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Any Allergies or Restrictions
                </label>
                <div className="space-y-2">
                  {['Dairy', 'Nuts', 'Shellfish', 'Gluten', 'Eggs', 'Soy'].map((allergy) => (
                    <label key={allergy} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="allergies"
                        value={allergy.toLowerCase()}
                        checked={formData.allergies.includes(allergy.toLowerCase())}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                         ${
                           step <= currentStep
                             ? 'bg-blue-600 dark:bg-blue-400 text-white'
                             : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                         }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                     hover:text-gray-900 dark:hover:text-white focus:outline-none"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`ml-auto px-6 py-2 text-sm font-medium text-white bg-blue-600
                     rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
                     disabled:cursor-not-allowed transition-colors duration-200`}
        >
          {loading
            ? 'Generating Plan...'
            : currentStep === 4
            ? 'Generate Diet Plan'
            : 'Next'}
        </button>
      </div>
    </form>
  );
} 