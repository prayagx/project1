'use client';

import React, { useState, useEffect, Suspense } from 'react';
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

// Create a SearchParamsHandler component that uses the useSearchParams hook
function SearchParamsHandler({ onParamsProcessed }: { onParamsProcessed: (formData: any, planDuration: 'day' | 'week', dietaryPreferences: string[]) => void }) {
  const searchParams = useSearchParams();
  const [processed, setProcessed] = useState(false);
  
  useEffect(() => {
    if (!processed && searchParams) {
      const weight = searchParams.get('weight');
      const height = searchParams.get('height');
      const age = searchParams.get('age');
      const gender = searchParams.get('gender');
      const activityLevel = searchParams.get('activityLevel');
      const goal = searchParams.get('goal');
      const duration = searchParams.get('planDuration');
      const preferences = searchParams.get('dietaryPreferences');
      
      // Create form data from URL parameters
      const formData = {
        weight: weight || '',
        height: height || '',
        age: age || '',
        gender: (gender === 'male' || gender === 'female') ? gender : 'male',
        activityLevel: (activityLevel && ['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(activityLevel)) 
          ? activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
          : 'moderate',
        goal: (goal && ['lose', 'maintain', 'gain'].includes(goal))
          ? goal as 'lose' | 'maintain' | 'gain'
          : 'maintain',
      };
      
      // Set plan duration
      const planDuration = (duration === 'day' || duration === 'week') ? duration as 'day' | 'week' : 'day';
      
      // Set dietary preferences
      const dietaryPreferences = preferences ? preferences.split(',') : [];
      
      // Pass the processed data up to the parent component
      onParamsProcessed(formData, planDuration, dietaryPreferences);
      setProcessed(true);
    }
  }, [searchParams, processed, onParamsProcessed]);
  
  return null; // This component doesn't render anything
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
  const [activeSection, setActiveSection] = useState<string>('home');
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [planDuration, setPlanDuration] = useState<'day' | 'week'>('day');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [paramsProcessed, setParamsProcessed] = useState(false);
  
  const pathname = usePathname();

  // Only show the theme toggle button after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle processed search params
  const handleProcessedParams = (newFormData: any, newPlanDuration: 'day' | 'week', newDietaryPreferences: string[]) => {
    setFormData(newFormData);
    setPlanDuration(newPlanDuration);
    setDietaryPreferences(newDietaryPreferences);
    setParamsProcessed(true);
    
    // If we have essential parameters (weight, height, age), automatically generate the plan
    if (newFormData.weight && newFormData.height && newFormData.age) {
      const dietPlanFormData: DietPlanFormData = {
        weight: newFormData.weight,
        height: newFormData.height,
        age: newFormData.age,
        gender: newFormData.gender,
        activityLevel: newFormData.activityLevel,
        goal: newFormData.goal,
        dietaryPreferences: newDietaryPreferences,
        allergies: [],
        planDuration: newPlanDuration
      };
      
      // Generate plan with URL parameters
      handleSubmit(dietPlanFormData);
    }
  };
  
  // Track section changes for analytics
  useEffect(() => {
    if (mounted && activeSection) {
      trackSectionNavigation(activeSection);
    }
  }, [activeSection, mounted]);

  // Load section from URL hash on initial load
  useEffect(() => {
    if (mounted) {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'generator', 'features', 'testimonials', 'about'].includes(hash)) {
        setActiveSection(hash);
      } else if (!hash) {
        setActiveSection('home');
      }
    }
  }, [mounted]);

  // Function to handle section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Update URL for better SEO
    window.history.pushState({}, '', `#${section}`);
  };

  const handleSubmit = async (formData: DietPlanFormData) => {
    if (!formData.weight || !formData.height || !formData.age) {
      alert('Please fill in all required fields: weight, height, and age.');
      return;
    }
    
    setLoading(true);
    try {
      const plan = await generateDietPlan(
        parseInt(formData.weight),
        parseInt(formData.height),
        parseInt(formData.age),
        formData.gender,
        formData.activityLevel,
        formData.goal,
        formData.dietaryPreferences || dietaryPreferences,
        formData.planDuration || planDuration
      );
      
      setDietPlan({
        ...plan,
        allergies: formData.allergies || allergies,
        planDuration: formData.planDuration || planDuration
      });
      
      // Scroll to generator section when plan is loaded
      const generatorElement = document.getElementById('generator');
      if (generatorElement) {
        generatorElement.scrollIntoView({ behavior: 'smooth' });
      }
      
      setActiveSection('generator');
      setInitialDataLoaded(true);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      // Use a more user-friendly error approach
      alert('Failed to generate diet plan. Please check your inputs and try again.');
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
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

  // Render the component only when mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-amoled-black dark:to-amoled-dark">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={seoConfig.defaultTitle}
        description={seoConfig.defaultDescription}
        canonical={seoConfig.siteUrl}
      />
      
      {/* Wrap the SearchParamsHandler in a Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsHandler onParamsProcessed={handleProcessedParams} />
      </Suspense>
      
      <main className="bg-white dark:bg-amoled-black min-h-screen flex flex-col">
        <Navbar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
          theme={theme} 
          onThemeChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
        />
        
        {/* Hero Section with generator */}
        <section id="home" className={`pt-24 pb-16 px-4 ${activeSection === 'home' ? 'block' : 'hidden'}`}>
          <div className="section-container">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                  <span className="text-gradient">AI-Powered</span> Personalized<br />Diet Plans
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Get a personalized diet plan based on your body metrics, activity level, and goals.
                  Optimize your nutrition with our AI-driven recommendations.
                </p>
                
                <div className="flex gap-4">
                  <button 
                    className="btn btn-primary btn-lg group relative"
                    onClick={() => handleSectionChange('generator')}
                  >
                    <span className="absolute inset-0 rounded-full bg-primary-500/30 dark:bg-primary-500/20 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-70 group-hover:opacity-100"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Create Diet Plan
                  </button>
                  <button 
                    className="btn btn-secondary btn-lg group relative"
                    onClick={() => handleSectionChange('features')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Learn More
                  </button>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-amoled-border bg-white dark:bg-amoled-card">
                  <DietPlanGenerator 
                    onSubmit={handleSubmit} 
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Generated Plan Display */}
        <section id="generator" className={`pt-24 pb-16 px-4 ${activeSection === 'generator' ? 'block' : 'hidden'}`}>
          <div className="section-container">
            <h2 className="section-title text-center">
              Your <span className="text-gradient">Personalized</span> Diet Plan
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 dark:text-gray-400">Generating your personalized diet plan...</p>
                </div>
              </div>
            ) : dietPlan ? (
              <div className="bg-white dark:bg-amoled-card shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-amoled-border">
                <MealPlanDisplay 
                  targetCalories={dietPlan.targetCalories}
                  protein={dietPlan.macros.protein}
                  carbs={dietPlan.macros.carbs}
                  fat={dietPlan.macros.fat}
                  mealFrequency={dietPlan.mealFrequency}
                  dietaryPreferences={dietPlan.dietaryPreferences}
                  allergies={dietPlan.allergies || []}
                  planDuration={dietPlan.planDuration || planDuration}
                />
                
                <div className="mt-8 flex justify-center gap-4">
                  <ShareButton 
                    url={window?.location?.href}
                    title="My Personalized Diet Plan from MacroMindAI"
                    description={`Check out my personalized meal plan with ${dietPlan.targetCalories} calories per day!`}
                  />
                  <button 
                    className="btn btn-secondary group relative"
                    onClick={() => handleSectionChange('home')}
                  >
                    <span className="absolute inset-0 rounded-full bg-gray-200/20 dark:bg-gray-500/10 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-50 group-hover:opacity-100"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Edit Parameters
                  </button>
                </div>
              </div>
            ) : initialDataLoaded ? (
              <div className="text-center p-8 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                <p className="text-red-600 dark:text-red-300">
                  Failed to generate meal plan. Please check your inputs and try again.
                </p>
                <button 
                  className="mt-4 btn btn-accent group relative"
                  onClick={() => handleSectionChange('home')}
                >
                  <span className="absolute inset-0 rounded-full bg-indigo-500/30 dark:bg-indigo-500/20 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-70 group-hover:opacity-100"></span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Generator
                </button>
              </div>
            ) : (
              <div className="text-center p-8 glass-effect">
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  Enter your details in the form above to generate a personalized diet plan.
                </p>
                <button 
                  className="btn btn-special btn-lg group relative"
                  onClick={() => handleSectionChange('home')}
                >
                  <span className="absolute inset-0 rounded-full bg-blue-500/30 dark:bg-blue-500/20 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-70 group-hover:opacity-100"></span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Go to Generator
                </button>
              </div>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className={`pt-24 pb-16 px-4 bg-gray-50 dark:bg-amoled-dark ${activeSection === 'features' ? 'block' : 'hidden'}`}>
          <Features features={featuresData} />
        </section>
        
        {/* Feature Highlights (Visible on Home) */}
        <section className={`py-16 px-4 bg-gray-50 dark:bg-amoled-dark ${activeSection === 'home' ? 'block' : 'hidden'}`}>
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="section-title">
                Key <span className="text-gradient">Features</span>
              </h2>
              <p className="section-subtitle">
                Discover what makes MacroMindAI the most advanced nutrition planning tool
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuresData.slice(0, 1).map((category) => (
                category.items.slice(0, 3).map((feature, index) => (
                  <div key={index} className="feature-card p-6 group hover:scale-105 transition-all duration-300">
                    <div className="feature-icon-container">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button
                onClick={() => handleSectionChange('features')}
                className="btn btn-primary btn-lg group relative"
              >
                <span className="absolute inset-0 rounded-full bg-primary-500/30 dark:bg-primary-500/20 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-70 group-hover:opacity-100"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Explore All Features
              </button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className={`pt-24 pb-16 px-4 ${activeSection === 'testimonials' ? 'block' : 'hidden'}`}>
          <TestimonialCarousel testimonials={testimonials} />
        </section>
        
        {/* About Section */}
        <section id="about" className={`pt-24 pb-16 px-4 bg-gray-50 dark:bg-amoled-dark ${activeSection === 'about' ? 'block' : 'hidden'}`}>
          <AboutSection />
        </section>
        
        {/* Contact Section */}
        <section id="contact" className={`pt-24 pb-16 px-4 ${activeSection === 'contact' ? 'block' : 'hidden'}`}>
          <div className="section-container">
            <h2 className="section-title text-center">
              Contact <span className="text-gradient">Us</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass-effect p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Get in Touch</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input type="text" id="name" name="name" className="mt-1 input-field" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" id="email" name="email" className="mt-1 input-field" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                    <textarea id="message" name="message" rows={4} className="mt-1 input-field"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary group relative">
                    <span className="absolute inset-0 rounded-full bg-primary-500/30 dark:bg-primary-500/20 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-70 group-hover:opacity-100"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message
                  </button>
                </form>
              </div>
              
              <div className="glass-effect p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Our Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Address</h4>
                      <p className="text-gray-600 dark:text-gray-400">1234 Nutrition Avenue, Health City, HC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                      <p className="text-gray-600 dark:text-gray-400">contact@macromindai.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Phone</h4>
                      <p className="text-gray-600 dark:text-gray-400">(123) 456-7890</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary-500 hover:text-primary-600 transition-colors" aria-label="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a href="#" className="text-primary-500 hover:text-primary-600 transition-colors" aria-label="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                      </svg>
                    </a>
                    <a href="#" className="text-primary-500 hover:text-primary-600 transition-colors" aria-label="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259-.012 3.668-.07 4.948-.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="bg-gray-900 dark:bg-amoled-black text-white py-8 px-4 border-t border-gray-800">
          <div className="section-container flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-gradient">MacroMindAI</span>
              <p className="text-gray-400 mt-2">The intelligent diet planning solution</p>
            </div>
            
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} MacroMindAI. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
      
      <CookieConsent />
    </>
  );
} 