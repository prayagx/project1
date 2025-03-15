import { StaticImageData } from 'next/image';

export interface Testimonial {
  id: number;
  name: string;
  image: string | StaticImageData;
  age?: number;
  location?: string;
  text: string;
  goal?: string;
  achievement?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/images/testimonials/testimonial-1.jpg",
    age: 34,
    location: "Denver, CO",
    text: "MacroMindAI completely changed my relationship with food. Instead of restrictive dieting, I now have a balanced meal plan that's actually sustainable. I've lost weight without feeling like I'm constantly hungry, and I have so much more energy throughout the day!",
    goal: "Weight Loss",
    achievement: "Lost 23 lbs in 4 months",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    image: "/images/testimonials/testimonial-2.jpg",
    age: 28,
    location: "Seattle, WA",
    text: "As an athlete, I needed a nutrition plan that would fuel my workouts while helping me build lean muscle. MacroMindAI delivered exactly what I needed - a high-protein plan with the right balance of carbs for energy. My recovery time has improved significantly!",
    goal: "Muscle Gain",
    achievement: "Gained 12 lbs of muscle in 3 months",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Chen",
    image: "/images/testimonials/testimonial-3.jpg",
    age: 42,
    location: "Chicago, IL",
    text: "I've tried so many diet apps, but none of them catered to my dietary restrictions. MacroMindAI created a gluten-free, dairy-free plan that's actually delicious and varied. For the first time, I don't feel limited by my food allergies!",
    goal: "Health Management",
    achievement: "Eliminated digestive issues",
    rating: 4
  },
  {
    id: 4,
    name: "David Patel",
    image: "/images/testimonials/testimonial-4.jpg",
    age: 51,
    location: "Austin, TX",
    text: "After my doctor warned me about my cholesterol levels, I knew I needed to make a change. The heart-healthy meal plan from MacroMindAI was easy to follow and actually enjoyable. My last checkup showed significantly improved numbers!",
    goal: "Heart Health",
    achievement: "Lowered cholesterol by 42 points",
    rating: 5
  },
  {
    id: 5,
    name: "Jessica Wong",
    image: "/images/testimonials/testimonial-5.jpg",
    age: 31,
    location: "New York, NY",
    text: "As a busy professional, I never had time to plan healthy meals. MacroMindAI's weekly planning feature saved me hours of time and eliminated my daily stress about what to eat. The meal prep suggestions have been a game-changer!",
    goal: "Convenience",
    achievement: "Saves 5+ hours weekly on meal planning",
    rating: 4
  },
  {
    id: 6,
    name: "Robert Smith",
    image: "/images/testimonials/testimonial-6.jpg",
    age: 45,
    location: "Portland, OR",
    text: "I've been following a plant-based diet for years but always struggled with getting enough protein. The vegan meal plan from MacroMindAI is protein-packed and creative - no more boring tofu dishes! I feel stronger and have more sustained energy.",
    goal: "Vegan Nutrition",
    achievement: "Improved strength and energy levels",
    rating: 5
  },
  {
    id: 7,
    name: "Aisha Johnson",
    image: "/images/testimonials/testimonial-7.jpg",
    age: 38,
    location: "Atlanta, GA",
    text: "Managing my type 2 diabetes used to be a daily struggle. MacroMindAI created a low-glycemic meal plan that keeps my blood sugar stable while still being delicious. My doctor is amazed at my improved A1C levels!",
    goal: "Diabetes Management",
    achievement: "Reduced A1C from 8.2 to 6.4",
    rating: 5
  },
  {
    id: 8,
    name: "Chris Taylor",
    image: "/images/testimonials/testimonial-8.jpg",
    age: 33,
    location: "San Francisco, CA",
    text: "Training for my first marathon was demanding, and I kept hitting energy walls. The endurance nutrition plan from MacroMindAI properly fueled my training with the right carb timing and recovery meals. I finished my marathon and felt great!",
    goal: "Athletic Performance",
    achievement: "Completed first marathon",
    rating: 4
  }
];

export default testimonials; 