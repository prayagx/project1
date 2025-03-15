import { FeatureCategory } from '../types/features';
import { 
  UserIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  BeakerIcon,
  HeartIcon,
  PuzzlePieceIcon,
  ClockIcon,
  CakeIcon,
  PaperAirplaneIcon,
  PrinterIcon,
  ArrowPathIcon,
  DevicePhoneMobileIcon,
  FingerPrintIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const featuresData: FeatureCategory[] = [
  {
    category: "Personalization",
    description: "Tailored diet plans that adapt to your unique needs and preferences",
    items: [
      {
        title: "Smart Profile Analysis",
        description: "Our AI analyzes your profile data to create a diet plan that's uniquely tailored to your body type, fitness level, and health goals.",
        icon: <UserIcon className="h-6 w-6" />,
        details: [
          "Body metrics analysis (BMI, weight, height)",
          "Age and gender considerations",
          "Activity level adjustments",
          "Health goals alignment"
        ]
      },
      {
        title: "Dietary Preference Support",
        description: "Whether you're vegan, keto, paleo, or have specific allergies, our system accommodates all dietary preferences and restrictions.",
        icon: <HeartIcon className="h-6 w-6" />,
        details: [
          "Support for 10+ diet types (keto, vegan, paleo, etc.)",
          "Allergy and food sensitivity options",
          "Religious dietary considerations",
          "Ingredient exclusion flexibility"
        ]
      },
      {
        title: "Adaptive Meal Planning",
        description: "Your meal plan evolves based on your feedback, progress, and changes in your routine or preferences.",
        icon: <ArrowPathIcon className="h-6 w-6" />,
        details: [
          "Weekly plan adjustments based on feedback",
          "Progress-driven modifications",
          "Seasonal ingredient adaptation",
          "Taste preference learning"
        ]
      },
      {
        title: "Goal-Based Customization",
        description: "Set weight loss, muscle gain, or maintenance goals and get a plan optimized for your specific objectives.",
        icon: <FingerPrintIcon className="h-6 w-6" />,
        details: [
          "Weight loss optimization",
          "Muscle building support",
          "Athletic performance enhancement",
          "Health maintenance plans"
        ]
      }
    ]
  },
  {
    category: "Nutrition Science",
    description: "Evidence-based diet planning backed by the latest nutritional research",
    items: [
      {
        title: "Macro & Micronutrient Balancing",
        description: "Each meal plan is precisely calculated to provide the optimal balance of proteins, carbs, fats, vitamins, and minerals.",
        icon: <ChartPieIcon className="h-6 w-6" />,
        details: [
          "Precise macro ratio calculations",
          "Essential micronutrient tracking",
          "Vitamin and mineral balance",
          "Fiber intake optimization"
        ]
      },
      {
        title: "Calorie Optimization",
        description: "Get scientifically calculated calorie targets based on your metabolic rate, activity level, and goals.",
        icon: <ChartBarIcon className="h-6 w-6" />,
        details: [
          "BMR (Basal Metabolic Rate) calculations",
          "TDEE (Total Daily Energy Expenditure) adjustment",
          "Calorie deficit/surplus precision",
          "Activity-based calorie allocation"
        ]
      },
      {
        title: "Nutritional Analysis",
        description: "Detailed breakdown of your meal plan's nutritional value, helping you understand the science behind your diet.",
        icon: <BeakerIcon className="h-6 w-6" />,
        details: [
          "Comprehensive nutrient breakdowns",
          "Daily nutritional goal tracking",
          "Meal-by-meal nutritional analysis",
          "Health biomarker predictions"
        ]
      },
      {
        title: "Evidence-Based Recommendations",
        description: "All nutritional advice is backed by peer-reviewed research and updated as new discoveries emerge.",
        icon: <ShieldCheckIcon className="h-6 w-6" />,
        details: [
          "Research-backed meal suggestions",
          "Regular updates from nutritional studies",
          "Expert-reviewed recommendations",
          "Scientific citation availability"
        ]
      }
    ]
  },
  {
    category: "Meal Planning",
    description: "Flexible and practical meal planning tools to simplify your nutrition",
    items: [
      {
        title: "Weekly Meal Schedules",
        description: "Plan your nutrition for an entire week with diverse, balanced meals that prevent diet fatigue.",
        icon: <CalendarIcon className="h-6 w-6" />,
        details: [
          "7-day comprehensive planning",
          "Meal variety algorithms",
          "Balanced nutrition across the week",
          "Special occasions accommodation"
        ]
      },
      {
        title: "Quick Meal Generation",
        description: "Need a meal now? Generate single meal recommendations based on what you've already eaten today.",
        icon: <ClockIcon className="h-6 w-6" />,
        details: [
          "On-demand meal suggestions",
          "Nutritional gap filling",
          "Time-based recommendations",
          "Quick preparation options"
        ]
      },
      {
        title: "Recipe Variety",
        description: "Access thousands of delicious recipes that match your dietary preferences and nutritional needs.",
        icon: <CakeIcon className="h-6 w-6" />,
        details: [
          "5,000+ recipe database",
          "Cuisine diversity from around the world",
          "Seasonal recipe suggestions",
          "Flavor profile matching"
        ]
      },
      {
        title: "Flexible Meal Components",
        description: "Mix and match meal components to create custom combinations that fit your taste and macros.",
        icon: <PuzzlePieceIcon className="h-6 w-6" />,
        details: [
          "Modular meal building",
          "Protein/carb/fat component swapping",
          "Flavor profile preservation",
          "Nutritional equivalence maintenance"
        ]
      }
    ]
  },
  {
    category: "Usability",
    description: "User-friendly features that make managing your nutrition effortless",
    items: [
      {
        title: "One-Click Export",
        description: "Export your meal plan to PDF, print it, or send it to your email for easy reference throughout the week.",
        icon: <PaperAirplaneIcon className="h-6 w-6" />,
        details: [
          "Multiple export formats (PDF, Excel, CSV)",
          "Email delivery option",
          "Cloud storage integration",
          "Social sharing capabilities"
        ]
      },
      {
        title: "Print-Friendly Layouts",
        description: "Print your meal plan with a clean, easy-to-read layout that includes all the information you need.",
        icon: <PrinterIcon className="h-6 w-6" />,
        details: [
          "Optimized print layouts",
          "Shopping list printing",
          "Recipe card formatting",
          "Ink-saving design options"
        ]
      },
      {
        title: "Mobile Optimization",
        description: "Access your meal plan on any device with our responsive design that works perfectly on phones and tablets.",
        icon: <DevicePhoneMobileIcon className="h-6 w-6" />,
        details: [
          "Fully responsive interface",
          "Offline access capability",
          "Push notification support",
          "Touch-optimized controls"
        ]
      },
      {
        title: "Customization Controls",
        description: "Fine-tune every aspect of your meal plan with intuitive controls and settings.",
        icon: <CogIcon className="h-6 w-6" />,
        details: [
          "Portion size adjustments",
          "Meal frequency settings",
          "Ingredient substitution options",
          "Preparation time preferences"
        ]
      }
    ]
  }
];

export default featuresData; 