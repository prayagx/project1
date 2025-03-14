import Image from 'next/image';
import { useState } from 'react';

export function AboutSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none">
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          MacroMindAI was founded in 2024 with a mission to revolutionize personalized nutrition 
          through artificial intelligence. Our platform combines cutting-edge AI technology with 
          comprehensive nutritional data to create truly customized meal plans that fit your 
          lifestyle, preferences, and goals.
        </p>
        
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          Powered by advanced nutritional APIs and machine learning algorithms, our system 
          analyzes dozens of factors to create optimal meal plans. We consider your unique 
          characteristics, dietary preferences, and health goals to ensure your nutrition plan 
          is both effective and sustainable.
        </p>
      </div>

      <div className="relative h-[250px] sm:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl
                    transform transition-transform duration-300 hover:scale-[1.02]">
        {!imageError ? (
          <Image 
            src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Team working together" 
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            priority
            onError={() => setImageError(true)}
            quality={90}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-400 dark:text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Our Approach</h3>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300">
          Unlike one-size-fits-all diet plans, our system considers your unique characteristics:
        </p>
        
        <ul className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          {[
            'Metabolic factors like age, weight, height, and gender',
            'Activity level and exercise routines',
            'Dietary preferences and restrictions',
            'Health conditions and nutritional needs',
            'Long-term sustainability and lifestyle compatibility'
          ].map((item, index) => (
            <li key={index} className="flex items-start space-x-2 sm:space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-1 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-base sm:text-xl text-gray-600 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
        
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mt-6 sm:mt-8">
          The result? Diet plans that not only help you achieve your goals but are also enjoyable 
          and sustainable for the long term.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12">
        {[
          {
            title: 'Expert Team',
            description: 'Our team includes certified nutritionists and dietitians with years of experience.',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            )
          },
          {
            title: 'AI-Powered',
            description: 'Advanced algorithms and nutritional APIs analyze your data to create optimal meal plans.',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            )
          },
          {
            title: 'Continuous Support',
            description: 'Regular updates and adjustments to keep you on track with your goals.',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.027 9.027 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288" />
              </svg>
            )
          }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg
                     transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg
                          flex items-center justify-center text-blue-600 dark:text-blue-300 mb-3 sm:mb-4">
              {item.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 