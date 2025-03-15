import { useState } from 'react';
import { motion } from 'framer-motion';
import { FeatureCategory, FeatureItem } from '@/app/types/features';

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
    <div className="py-12 bg-white dark:bg-amoled-black">
      <div className="section-container">
        <div className="text-center mb-12">
          <h1 className="section-title">
            Powerful <span className="text-gradient">Features</span>
          </h1>
          <p className="section-subtitle">
            Discover how MacroMindAI's intelligent features can transform your nutrition and help you reach your health goals.
          </p>
        </div>
        
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          {features.map((feature: FeatureCategory) => (
            <motion.button
              key={feature.category}
              onClick={() => setActiveCategory(feature.category)}
              className={`px-6 py-3 rounded-full text-sm md:text-base transition-all duration-300 shadow-sm group relative
                        ${activeCategory === feature.category 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                          : 'bg-white dark:bg-amoled-card text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-amoled-gray border border-gray-200 dark:border-amoled-border'}`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {activeCategory === feature.category && (
                <span className="absolute inset-0 rounded-full bg-primary-500/30 dark:bg-primary-500/20 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-70 animate-pulse"></span>
              )}
              {feature.category}
            </motion.button>
          ))}
        </div>
        
        {/* Category Description */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <motion.h2 
            className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
            key={`${activeCategory}-title`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeCategory}
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-300 text-lg"
            key={`${activeCategory}-desc`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {features.find(f => f.category === activeCategory)?.description || ''}
          </motion.p>
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
              className="feature-card group relative p-6 hover:scale-105 transition-all duration-300"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0
                            group-hover:from-primary-500/5 group-hover:to-primary-500/10
                            dark:group-hover:from-primary-500/5 dark:group-hover:to-primary-500/10
                            rounded-2xl transition-all duration-300" />
              
              <div className="relative">
                <div className="feature-icon-container mx-auto">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  {feature.description}
                </p>
                
                {feature.details && (
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-amoled-border">
                    <ul className="space-y-2">
                      {Array.isArray(feature.details) ? (
                        feature.details.map((detail: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <svg className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.details}</p>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              className="btn btn-primary btn-lg group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 rounded-full bg-primary-500/30 dark:bg-primary-500/20 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-70 group-hover:opacity-100"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Try MacroMindAI Free
            </motion.button>
            <motion.button 
              className="btn btn-secondary btn-lg group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 rounded-full bg-gray-200/20 dark:bg-gray-500/10 blur-md group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 dark:opacity-50 group-hover:opacity-100"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Demo
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 