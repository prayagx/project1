import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Testimonial {
  name: string;
  text: string;
  image: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg
                            transform transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4
                                ring-4 ring-blue-100 dark:ring-blue-900">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg italic">
                  "{testimonial.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4
                   bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   transition-colors duration-200"
        aria-label="Previous testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-600 dark:text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4
                   bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   transition-colors duration-200"
        aria-label="Next testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-600 dark:text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300
                       ${
                         index === currentIndex
                           ? 'bg-blue-600 dark:bg-blue-400 w-4'
                           : 'bg-gray-300 dark:bg-gray-600'
                       }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 