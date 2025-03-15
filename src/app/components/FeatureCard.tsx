import { ReactNode } from 'react';

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  details?: string;
}

export interface FeatureCardProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  category?: string;
  items?: FeatureItemProps[];
}

export function FeatureCard({ icon, title, description, category, items }: FeatureCardProps) {
  // If we have items, render as a category with multiple features
  if (category && items) {
    return (
      <div className="w-full">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{category}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <FeatureItem 
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              details={item.details}
            />
          ))}
        </div>
      </div>
    );
  }
  
  // Render as a single feature (legacy support)
  return (
    <FeatureItem icon={icon} title={title || ''} description={description || ''} />
  );
}

function FeatureItem({ icon, title, description, details }: FeatureItemProps) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg
                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                    hover:ring-2 hover:ring-blue-500/20 dark:hover:ring-blue-400/20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0
                      group-hover:from-blue-500/5 group-hover:to-blue-500/5
                      dark:group-hover:from-blue-400/5 dark:group-hover:to-blue-400/5
                      rounded-xl transition-all duration-300" />
      
      <div className="relative">
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl
                        flex items-center justify-center text-blue-600 dark:text-blue-300
                        mb-6 transform transition-transform duration-300
                        group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {description}
        </p>
        
        {details && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {details}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 