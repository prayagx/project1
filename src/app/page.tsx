'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Navbar } from './components/Navbar';
import { FeatureCard } from './components/FeatureCard';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { DietPlanGenerator, FormData } from './components/DietPlanGenerator';
import { AboutSection } from './components/AboutSection';

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

  // Only show the theme toggle button after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setGeneratedPlan(`
        Here's your personalized diet plan:

        Daily Calorie Target: 2000-2200 calories
        
        Breakfast:
        - Oatmeal with fruits
        - Greek yogurt
        - Almonds
        
        Lunch:
        - Grilled chicken salad
        - Brown rice
        - Mixed vegetables
        
        Dinner:
        - Salmon
        - Sweet potato
        - Steamed broccoli
        
        Snacks:
        - Apple with peanut butter
        - Mixed nuts
      `);
      setLoading(false);
    }, 1500);
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
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Home Section */}
      {activeSection === 'home' && (
        <section className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Personalized Nutrition for Your Lifestyle
                </h2>
                <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our AI-powered diet planner creates customized meal plans based on your unique needs, 
                  preferences, and goals. Whether you're looking to lose weight, build muscle, or just 
                  maintain a healthy lifestyle, we've got you covered.
                </p>
                <div className="mt-8">
                  <button 
                    onClick={() => setActiveSection('generator')}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white
                             bg-green-600 hover:bg-green-500 rounded-lg shadow-lg transition-all duration-300
                             hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                             dark:focus:ring-offset-gray-900"
                  >
                    Create Your Diet Plan
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl
                            transform transition-transform duration-300 hover:scale-105">
                <Image 
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Healthy food arrangement" 
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Features */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>

            {/* Testimonials */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                What Our Users Say
              </h2>
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </div>
        </section>
      )}

      {/* Generator Section */}
      {activeSection === 'generator' && (
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create Your Diet Plan</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <DietPlanGenerator
                onSubmit={handleSubmit}
                loading={loading}
              />

              {generatedPlan && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Your Personalized Diet Plan
                  </h2>
                  <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                    {generatedPlan}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About Us</h2>
            <AboutSection />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Diet Planner Pro</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Personalized nutrition made simple
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resources
                </h3>
                <div className="mt-4 space-y-4">
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Blog
                  </a>
                  <div className="block"></div>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Guides
                  </a>
                  <div className="block"></div>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Recipes
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </h3>
                <div className="mt-4 space-y-4">
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    About
                  </a>
                  <div className="block"></div>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Team
                  </a>
                  <div className="block"></div>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Careers
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Legal
                </h3>
                <div className="mt-4 space-y-4">
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Privacy
                  </a>
                  <div className="block"></div>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; 2023 Diet Planner Pro. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 