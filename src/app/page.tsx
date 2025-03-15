'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from './components/Navbar';
import { FeatureCard } from './components/FeatureCard';
import TestimonialCarousel from './components/TestimonialCarousel';
import DietPlanGenerator from './components/DietPlanGenerator';
import { AboutSection } from './components/AboutSection';
import { FoodSearch } from './components/FoodSearch';
import { MealSuggestion } from './components/MealSuggestion';
import MealPlanDisplay from './components/MealPlanDisplay';
import { generateDietPlan } from './services/nutritionService';
import SEO from './components/SEO';
import CookieConsent from './components/CookieConsent';
import { trackSectionNavigation } from './utils/analytics';
import { seoConfig } from './config';
import Features from './components/Features';
import ShareButton from './components/ShareButton';
import featuresData from './data/featuresData';
import testimonials from './data/testimonialsData';

// Define a custom FormData interface for diet plan generation
interface DietPlanFormData {
  weight: string;
  height: string;
  age: string;
  gender: "male" | "female"; // Restrict to valid options
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"; // Restrict to valid options
  goal: "lose" | "maintain" | "gain"; // Restrict to valid options
  dietaryPreferences?: string[];
  allergies?: string[];
  planDuration: "day" | "week"; // Match the expected values in the component
}

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
  const [activeSection, setActiveSection] = useState<string>('generator');
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [planDuration, setPlanDuration] = useState<'day' | 'week'>('day');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only show the theme toggle button after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track section changes for analytics
  useEffect(() => {
    if (mounted && activeSection) {
      trackSectionNavigation(activeSection);
    }
  }, [activeSection, mounted]);

  // Load section from URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['generator', 'features', 'testimonials', 'about'].includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  // Function to handle section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Update URL for better SEO
    window.history.pushState({}, '', `#${section}`);
  };

  const handleSubmit = async (formData: DietPlanFormData) => {
    setLoading(true);
    try {
      const plan = await generateDietPlan(
        parseInt(formData.weight),
        parseInt(formData.height),
        parseInt(formData.age),
        formData.gender,
        formData.activityLevel,
        formData.goal,
        formData.dietaryPreferences || [],
        formData.planDuration
      );
      setDietPlan({
        ...plan,
        allergies: formData.allergies || [],
        planDuration: formData.planDuration
      });
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

  const features = [
    {
      category: "Personalization",
      items: [
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          ),
          title: "AI-Powered Personalization",
          description: "Our advanced algorithm analyzes your body metrics, activity level, and dietary preferences to create truly personalized meal plans tailored specifically to your unique needs.",
          details: "Unlike one-size-fits-all approaches, our system considers over 20 different factors including your BMI, metabolic rate, food allergies, and eating patterns to create a plan that works for your lifestyle."
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          ),
          title: "Dietary Preference Matching",
          description: "Whether you follow keto, vegan, paleo, or have specific cuisine preferences, our system adapts to provide delicious meal options that match your exact dietary needs.",
          details: "We support over 12 different dietary patterns and can combine multiple preferences (like gluten-free vegetarian) to ensure your meal plan remains both healthy and enjoyable."
        }
      ]
    },
    {
      category: "Nutrition Science",
      items: [
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971z" />
            </svg>
          ),
          title: "Evidence-Based Nutrition",
          description: "All meal plans are created following the latest nutritional science research to ensure optimal macronutrient ratios and micronutrient intake for your specific goals.",
          details: "Our nutrition algorithms are developed by registered dietitians and nutrition scientists to align with guidelines from major health organizations while incorporating cutting-edge nutritional research."
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          ),
          title: "Advanced Macronutrient Calculations",
          description: "Our system precisely calculates your optimal protein, carbohydrates, and fat intake based on your body composition, activity level, and specific fitness goals.",
          details: "We use the Mifflin-St Jeor equation combined with activity multipliers and goal-specific adjustments to determine your exact caloric and macronutrient needs for optimal results."
        }
      ]
    },
    {
      category: "Meal Planning",
      items: [
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          ),
          title: "Weekly Meal Planning",
          description: "Generate full 7-day meal plans with diverse recipes that avoid repetition while maintaining your nutritional targets throughout the week.",
          details: "Our weekly planning feature ensures variety in your meals while keeping your shopping list efficient and minimizing food waste through strategic ingredient usage across recipes."
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
          ),
          title: "Flexible Meal Frequency",
          description: "Customize your meal plan with 2-6 meals per day based on your preference for traditional meals, intermittent fasting, or frequent smaller meals.",
          details: "Whether you prefer three square meals, practice time-restricted eating, or need frequent fueling for athletic performance, our system adapts your nutrient timing accordingly."
        }
      ]
    },
    {
      category: "Customization & Adaptation",
      items: [
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          ),
          title: "Adaptive Meal Plans",
          description: "Our system learns from your feedback and adjusts future meal recommendations based on your preferences, making your meal plan smarter over time.",
          details: "The more you use MacroMindAI, the better it understands your taste preferences, adjusting portion sizes, ingredient combinations, and recipe complexity to match your lifestyle."
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          title: "Comprehensive Customization",
          description: "Fine-tune your meal plan with detailed preferences including cuisine types, ingredient exclusions, cooking complexity, and portion adjustments.",
          details: "With over 50 customization options, you can specify everything from cooking time constraints to flavor preferences, ensuring your meal plan is perfectly aligned with your lifestyle."
        }
      ]
    },
    {
      category: "Special Features",
      items: [
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          ),
          title: "Recipe Modification Tools",
          description: "Easily adjust recipes to match your caloric needs, ingredient preferences, or serving sizes with our smart recipe modification system.",
          details: "Our intelligent scaling feature can modify recipes while maintaining flavor profiles, even suggesting ingredient substitutions when necessary for dietary restrictions or preferences."
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          ),
          title: "Progress Tracking",
          description: "Monitor your nutrition journey with detailed analytics on adherence, macronutrient intake, and progress toward your health and fitness goals.",
          details: "Our tracking system allows you to log meals, weight changes, energy levels, and other metrics to visualize your progress and identify patterns for continual improvement."
        }
      ]
    }
  ];

  // Get SEO props based on active section
  const getSeoProps = () => {
    switch (activeSection) {
      case 'generator':
        return {
          title: 'Create Your Personalized Diet Plan | MacroMindAI',
          description: 'Generate a customized diet plan based on your personal needs, goals, and preferences.',
        };
      case 'features':
        return {
          title: 'Powerful Nutrition Planning Features | MacroMindAI',
          description: 'Explore the advanced features that make MacroMindAI the ultimate tool for your nutrition journey.',
        };
      case 'testimonials':
        return {
          title: 'Success Stories from MacroMindAI Users | MacroMindAI',
          description: 'Read real testimonials from people who transformed their nutrition with our AI-powered diet planner.',
        };
      case 'about':
        return {
          title: 'About MacroMindAI Diet Planner | Our Mission',
          description: 'Learn about our mission to make personalized nutrition accessible to everyone through AI technology.',
        };
      default:
        return seoConfig;
    }
  };

  return (
    <>
      <SEO {...getSeoProps()} />
      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="pt-20">
          {activeSection === 'home' && (
            <>
              <div className="text-center py-20">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Personalized Nutrition,
                  <br /> <span className="text-blue-600 dark:text-blue-400">Powered by AI</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                  Create a customized diet plan tailored to your body, goals, and food preferences
                  in just a few clicks.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => handleSectionChange('generator')}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mr-4"
                  >
                    Generate Plan
                  </button>
                  <button
                    onClick={() => handleSectionChange('features')}
                    className="px-8 py-3 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 rounded-lg"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              <div id="features" className="bg-white dark:bg-dark-card py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                      Why Choose MacroMindAI?
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                      Our AI-powered platform combines cutting-edge technology with evidence-based nutritional science to 
                      create truly personalized meal plans that adapt to your unique needs and preferences.
                    </p>
                  </div>
                  
                  <div className="space-y-20">
                    {featuresData.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                          {category.category}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                          {category.items.slice(0, 4).map((feature, featureIndex) => (
                            <div 
                              key={featureIndex}
                              className="group relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg
                                      transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                                      hover:ring-2 hover:ring-blue-500/20 dark:hover:ring-blue-400/20"
                            >
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg
                                            flex items-center justify-center text-blue-600 dark:text-blue-300
                                            mb-4 transform transition-transform duration-300
                                            group-hover:scale-110 group-hover:rotate-3">
                                {feature.icon}
                              </div>
                              
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {feature.title}
                              </h4>
                              
                              <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {feature.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-16 text-center">
                    <button
                      onClick={() => handleSectionChange('features')}
                      className="px-6 py-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 
                               text-blue-700 dark:text-blue-300 rounded-lg font-medium
                               transition-colors duration-300"
                    >
                      Explore All Features
                    </button>
                  </div>
                </div>
              </div>

              <div id="testimonials" className="bg-gray-50 dark:bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                      Success Stories
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                      Join thousands of users who have transformed their nutrition and achieved their health goals with MacroMindAI.
                    </p>
                  </div>
                  
                  <TestimonialCarousel testimonials={testimonials} />
                  
                  {/* Stats section */}
                  <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Active Users */}
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">15k+</div>
                        <div className="mt-2 text-gray-600 dark:text-gray-300">Active Users</div>
                      </div>
                      
                      {/* Average Rating */}
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">4.8</div>
                        <div className="mt-2 text-gray-600 dark:text-gray-300">Average Rating</div>
                      </div>
                      
                      {/* Success Rate */}
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">92%</div>
                        <div className="mt-2 text-gray-600 dark:text-gray-300">Success Rate</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => handleSectionChange('generator')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 
                                 text-white rounded-lg font-medium transition-colors duration-300"
                      >
                        Create Your Plan Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'features' && (
            <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Key Features
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Explore the powerful features that make MacroMindAI the best choice for your nutrition journey. 
                  Our AI-powered platform combines cutting-edge technology with evidence-based nutritional science.
                </p>
              </div>
              
              <div className="space-y-20">
                {features.map((category, idx) => (
                  <FeatureCard 
                    key={idx}
                    category={category.category}
                    items={category.items}
                  />
                ))}
              </div>
              
              <div className="mt-16 text-center">
                <button
                  onClick={() => setActiveSection('generator')}
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-lg font-semibold
                          transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Try MacroMindAI Now
                </button>
              </div>
            </div>
          )}

          {activeSection === 'testimonials' && (
            <div id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Success Stories
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Real results from real people. Discover how MacroMindAI has helped thousands achieve their nutrition 
                  and fitness goals with personalized meal plans tailored to their unique needs.
                </p>
              </div>
              
              <TestimonialCarousel testimonials={testimonials} />
              
              <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Join Thousands of Satisfied Users
                </h3>
                <div className="flex justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary-500">15k+</p>
                    <p className="text-gray-600 dark:text-gray-300">Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary-500">4.8</p>
                    <p className="text-gray-600 dark:text-gray-300">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary-500">92%</p>
                    <p className="text-gray-600 dark:text-gray-300">Success Rate</p>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setActiveSection('generator')}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium
                            transition-colors duration-300"
                  >
                    Create Your Plan Today
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'generator' && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Generate Your Personalized Diet Plan
                </h2>
                <DietPlanGenerator 
                  onSubmit={handleSubmit} 
                  loading={loading} 
                />
                
                {dietPlan && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Your Personalized Meal Plan
                    </h3>
                    <MealPlanDisplay
                      targetCalories={dietPlan.targetCalories}
                      protein={dietPlan.macros.protein}
                      carbs={dietPlan.macros.carbs}
                      fat={dietPlan.macros.fat}
                      mealFrequency={dietPlan.mealFrequency}
                      dietaryPreferences={dietPlan.dietaryPreferences}
                      allergies={dietPlan.allergies || []}
                      planDuration={planDuration}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div id="about" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <AboutSection />
            </div>
          )}

          {activeSection === 'contact' && (
            <div id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Have questions or feedback about MacroMindAI? We'd love to hear from you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Send us a message
                    </h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="input w-full"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="input w-full"
                          placeholder="Your email"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="input w-full"
                          placeholder="Your message"
                        ></textarea>
                      </div>
                      <div>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                        >
                          Send Message
                        </button>
                      </div>
                    </form>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Connect with us
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email us at</p>
                          <p className="text-gray-900 dark:text-white">contact@macromindai.com</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Call us at</p>
                          <p className="text-gray-900 dark:text-white">+1 (555) 123-4567</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Cookie consent banner */}
        <CookieConsent />
      </main>
    </>
  );
} 