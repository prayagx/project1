'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { generateDietPlan } from '../services/nutritionService';

interface DietPlanFormData {
  weight: string;
  height: string;
  age: string;
  gender: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
  dietaryPreferences: string[];
  allergies: string[];
  mealFrequency: string;
  planDuration: "day" | "week";
}

interface DietPlanResultsData {
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealFrequency: number;
  dietaryPreferences: string[];
  allergies: string[];
  planDuration: 'day' | 'week';
}

interface DietPlanContextType {
  formData: DietPlanFormData;
  results: DietPlanResultsData | null;
  loading: boolean;
  error: string | null;
  step: number;
  updateFormData: (data: Partial<DietPlanFormData>) => void;
  generatePlan: () => Promise<void>;
  setStep: (step: number) => void;
  resetForm: () => void;
  updatePlanDuration: (duration: 'day' | 'week') => void;
}

const defaultFormData: DietPlanFormData = {
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
};

const DietPlanContext = createContext<DietPlanContextType | undefined>(undefined);

export const DietPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<DietPlanFormData>(defaultFormData);
  const [results, setResults] = useState<DietPlanResultsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Fix for hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateFormData = (data: Partial<DietPlanFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const generatePlan = async () => {
    if (!formData.weight || !formData.height || !formData.age) {
      setError('Please fill out all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dietPlan = generateDietPlan(
        parseInt(formData.weight),
        parseInt(formData.height),
        parseInt(formData.age),
        formData.gender,
        formData.activityLevel,
        formData.goal,
        formData.dietaryPreferences,
        formData.planDuration
      );

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

      setStep(4); // Move to results step
    } catch (error) {
      setError('Failed to generate diet plan. Please try again.');
      console.error('Error generating diet plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setResults(null);
    setError(null);
    setStep(1);
  };

  const updatePlanDuration = (duration: 'day' | 'week') => {
    setFormData(prev => ({ ...prev, planDuration: duration }));
    
    if (results) {
      setResults(prev => prev ? { ...prev, planDuration: duration } : null);
    }
  };

  // Don't provide context until client-side hydration is complete
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <DietPlanContext.Provider
      value={{
        formData,
        results,
        loading,
        error,
        step,
        updateFormData,
        generatePlan,
        setStep,
        resetForm,
        updatePlanDuration
      }}
    >
      {children}
    </DietPlanContext.Provider>
  );
};

export const useDietPlan = () => {
  const context = useContext(DietPlanContext);
  if (context === undefined) {
    throw new Error('useDietPlan must be used within a DietPlanProvider');
  }
  return context;
}; 