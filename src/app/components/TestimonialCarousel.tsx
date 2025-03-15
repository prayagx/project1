import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Testimonial } from '../data/testimonialsData';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // Get unique goals for filtering
  const allGoals = ['All', ...Array.from(new Set(testimonials.map(t => t.goal || 'Other')))];
  
  // Filter testimonials based on selected goal
  const filteredTestimonials = activeFilter === 'All' 
    ? testimonials 
    : testimonials.filter(t => t.goal === activeFilter);
  
  const testimonialCount = filteredTestimonials.length;
  
  // Handle navigation
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonialCount);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentTestimonial((prev) => (prev - 1 + testimonialCount) % testimonialCount);
  };
  
  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [autoplay, currentTestimonial, testimonialCount]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };
  
  // If no testimonials after filtering
  if (testimonialCount === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-300">No testimonials found for this filter.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Goal Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {allGoals.map((goal) => (
          <button
            key={goal}
            onClick={() => {
              setActiveFilter(goal);
              setCurrentTestimonial(0); // Reset to first testimonial when filter changes
            }}
            className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300
                      ${activeFilter === goal 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
          >
            {goal}
          </button>
        ))}
      </div>
    
      <div className="relative mx-auto max-w-5xl">
        {/* Navigation buttons */}
        <button 
          onClick={prevTestimonial} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg
                   text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        
        <button 
          onClick={nextTestimonial}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg
                   text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
        
        {/* Testimonial display */}
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentTestimonial}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="relative w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                {/* Image and personal info - 2/7 width on md+ screens */}
                <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 p-6 flex flex-col items-center justify-center text-white">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white mb-4">
                    <Image
                      src={filteredTestimonials[currentTestimonial].image}
                      alt={filteredTestimonials[currentTestimonial].name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  
                  <h3 className="font-bold text-xl mb-1">
                    {filteredTestimonials[currentTestimonial].name}
                  </h3>
                  
                  {filteredTestimonials[currentTestimonial].age && 
                   filteredTestimonials[currentTestimonial].location && (
                    <p className="text-sm text-blue-100 mb-3">
                      {filteredTestimonials[currentTestimonial].age}, {filteredTestimonials[currentTestimonial].location}
                    </p>
                  )}
                  
                  {/* Goal tag */}
                  {filteredTestimonials[currentTestimonial].goal && (
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-3">
                      {filteredTestimonials[currentTestimonial].goal}
                    </span>
                  )}
                  
                  {/* Achievement */}
                  {filteredTestimonials[currentTestimonial].achievement && (
                    <div className="mt-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-blue-200 mb-1">Achievement</p>
                      <p className="font-medium text-white">
                        {filteredTestimonials[currentTestimonial].achievement}
                      </p>
                    </div>
                  )}
                  
                  {/* Star Rating */}
                  <div className="mt-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < filteredTestimonials[currentTestimonial].rating
                            ? 'text-yellow-300' 
                            : 'text-gray-400'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                
                {/* Testimonial text - 5/7 width on md+ screens */}
                <div className="md:col-span-5 p-6 md:p-8 flex items-center">
                  <div>
                    <svg 
                      className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-4" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic mb-6">
                      {filteredTestimonials[currentTestimonial].text}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        {[...Array(filteredTestimonials[currentTestimonial].rating)].map((_, i) => (
                          <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
                        ))}
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {currentTestimonial + 1} of {testimonialCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {filteredTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentTestimonial ? 1 : -1);
                setCurrentTestimonial(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel; 