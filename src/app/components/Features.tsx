import { useState } from 'react';
import { motion } from 'framer-motion';
import { FeatureCategory, FeatureItem } from '../types/features';

// Define the props interface
interface FeaturesProps {
  features: FeatureCategory[];
}

const Features: React.FC<FeaturesProps> = ({ features }) => {
  const [activeCategory, setActiveCategory] = useState<string>(features[0].category);
  
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  // Get the features for the active category
  const activeFeatures = features.find(f => f.category === activeCategory)?.items || [];
  
  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Our Features
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover how MacroMindAI's powerful features can transform your nutrition and help you reach your health goals.
          </p>
        </div>
        
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {features.map((feature: FeatureCategory) => (
            <button
              key={feature.category}
              onClick={() => setActiveCategory(feature.category)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300
                        ${activeCategory === feature.category 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
            >
              {feature.category}
            </button>
          ))}
        </div>
        
        {/* Feature Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeCategory} // This forces re-render and animation when category changes
        >
          {activeFeatures.map((feature: FeatureItem, index: number) => (
            <motion.div
              key={feature.title}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden
                        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                        hover:ring-2 hover:ring-blue-500/20 dark:hover:ring-blue-400/20"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0
                            group-hover:from-blue-500/5 group-hover:to-blue-500/10
                            dark:group-hover:from-blue-400/5 dark:group-hover:to-blue-400/10
                            rounded-xl transition-all duration-300" />
              
              <div className="relative p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg
                              flex items-center justify-center text-blue-600 dark:text-blue-300
                              mb-4 transform transition-transform duration-300
                              group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {feature.details && (
                  <ul className="mt-4 space-y-2">
                    {feature.details.map((detail: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg
                           transition-all duration-300 transform hover:scale-105">
              Try MacroMindAI Free
            </button>
            <button className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 
                           border-2 border-blue-600 dark:border-blue-500 rounded-lg shadow-lg
                           transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 dark:hover:bg-gray-700">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 