'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Navbar } from './components/Navbar';
import { FeatureCard } from './components/FeatureCard';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { DietPlanGenerator, FormData } from './components/DietPlanGenerator';
import { AboutSection } from './components/AboutSection';
import { FoodSearch } from './components/FoodSearch';
import { MealSuggestion } from './components/MealSuggestion';
import { MealPlanDisplay } from './components/MealPlanDisplay';
import { generateDietPlan } from './services/nutritionService';

export default function Home() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [dietPlan, setDietPlan] = useState<any>(null);

  // Only show the theme toggle button after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const plan = await generateDietPlan(formData);
      setDietPlan(plan);
      setActiveSection('generator');
    } catch (error) {
      console.error('Error generating diet plan:', error);
      alert('Failed to generate diet plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testimonials = [
    {
      name: "Sarah J.",
      text: "This diet plan changed my life! I've lost 15 pounds and feel more energetic than ever.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128"
    },
    {
      name: "Michael T.",
      text: "As an athlete, I needed a diet that supported my training. This plan perfectly balanced my nutrition needs.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128"
    },
    {
      name: "Elena P.",
      text: "The personalized approach made all the difference. For the first time, I have a diet I can actually stick to.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128"
    }
  ];

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      title: "Personalized Plans",
      description: "Diet plans tailored to your body type, goals, and food preferences."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971z" />
        </svg>
      ),
      title: "Nutrient Balance",
      description: "Optimal macronutrient ratios and calorie targets based on your activity level."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
      title: "Easy Adaptation",
      description: "Flexible plans that adapt to your changing needs and preferences."
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="pt-20">
        {activeSection === 'home' && (
          <>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Your AI-Powered Nutrition Companion
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Get personalized meal plans and nutritional guidance powered by artificial intelligence
                </p>
                <button
                  onClick={() => setActiveSection('generator')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:ring-offset-2 transition-colors"
                >
                  Create Your Diet Plan
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Why Choose MacroMindAI?
                  </h2>
                  <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Our platform combines cutting-edge AI technology with proven nutrition science
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                  ))}
                </div>
              </div>
            </div>

            <div className="py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    What Our Users Say
                  </h2>
                </div>
                <TestimonialCarousel testimonials={testimonials} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <AboutSection />
              </div>
            </div>
          </>
        )}

        {activeSection === 'generator' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Generate Your Personalized Diet Plan
              </h2>
              <DietPlanGenerator onSubmit={handleSubmit} loading={loading} />
              
              {dietPlan && (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Your Personalized Meal Plan
                  </h3>
                  <MealPlanDisplay
                    targetCalories={dietPlan.targetCalories}
                    macros={dietPlan.macros}
                    mealFrequency={dietPlan.mealFrequency}
                    dietaryPreferences={dietPlan.dietaryPreferences}
                    allergies={dietPlan.allergies}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AboutSection />
          </div>
        )}
      </div>
    </main>
  );
} 