// Database of Indian and Asian foods with nutritional information
// All nutritional values are per serving size
export interface FoodItem {
  name: string;
  calories: number;
  protein_g: number;
  carbohydrates_total_g: number;
  fat_total_g: number;
  serving_size_g: number;
  cuisine: 'indian' | 'asian' | 'general';
  category: 'protein' | 'carb' | 'fat' | 'mixed';
  description: string;
  portion_description: string;
}

export const foodDatabase: FoodItem[] = [
  // Indian Protein Sources
  {
    name: 'Paneer',
    calories: 265,
    protein_g: 18.3,
    carbohydrates_total_g: 1.2,
    fat_total_g: 20.8,
    serving_size_g: 100,
    cuisine: 'indian',
    category: 'protein',
    description: 'Indian cottage cheese, high in protein and calcium',
    portion_description: '100g (approx. 4 inch square piece)',
  },
  {
    name: 'Dal (Lentils)',
    calories: 116,
    protein_g: 9,
    carbohydrates_total_g: 20,
    fat_total_g: 0.4,
    serving_size_g: 100,
    cuisine: 'indian',
    category: 'protein',
    description: 'Cooked lentils, high in plant protein and fiber',
    portion_description: '100g (approx. 1/2 cup cooked)',
  },
  {
    name: 'Chana Masala',
    calories: 180,
    protein_g: 10,
    carbohydrates_total_g: 30,
    fat_total_g: 5,
    serving_size_g: 150,
    cuisine: 'indian',
    category: 'protein',
    description: 'Spicy chickpea curry, rich in protein and fiber',
    portion_description: '150g (approx. 3/4 cup)',
  },
  {
    name: 'Tandoori Chicken',
    calories: 165,
    protein_g: 25,
    carbohydrates_total_g: 2,
    fat_total_g: 6.5,
    serving_size_g: 100,
    cuisine: 'indian',
    category: 'protein',
    description: 'Marinated and roasted chicken, high in protein and low in carbs',
    portion_description: '100g (approx. 1 medium piece)',
  },

  // Indian Carb Sources
  {
    name: 'Basmati Rice',
    calories: 150,
    protein_g: 3.5,
    carbohydrates_total_g: 32,
    fat_total_g: 0.2,
    serving_size_g: 100,
    cuisine: 'indian',
    category: 'carb',
    description: 'Aromatic long-grain rice, staple in Indian cuisine',
    portion_description: '100g (approx. 1/2 cup cooked)',
  },
  {
    name: 'Roti/Chapati',
    calories: 120,
    protein_g: 3.5,
    carbohydrates_total_g: 18,
    fat_total_g: 3.5,
    serving_size_g: 30,
    cuisine: 'indian',
    category: 'carb',
    description: 'Whole wheat Indian flatbread',
    portion_description: '30g (1 medium roti)',
  },
  {
    name: 'Paratha',
    calories: 180,
    protein_g: 4,
    carbohydrates_total_g: 20,
    fat_total_g: 9,
    serving_size_g: 45,
    cuisine: 'indian',
    category: 'carb',
    description: 'Layered Indian flatbread cooked with ghee',
    portion_description: '45g (1 medium paratha)',
  },

  // Indian Mixed Dishes
  {
    name: 'Rajma (Kidney Bean Curry)',
    calories: 160,
    protein_g: 8,
    carbohydrates_total_g: 28,
    fat_total_g: 3,
    serving_size_g: 150,
    cuisine: 'indian',
    category: 'mixed',
    description: 'Kidney beans in a spiced tomato gravy',
    portion_description: '150g (approx. 3/4 cup)',
  },
  {
    name: 'Aloo Gobi',
    calories: 120,
    protein_g: 3,
    carbohydrates_total_g: 18,
    fat_total_g: 5,
    serving_size_g: 150,
    cuisine: 'indian',
    category: 'mixed',
    description: 'Potato and cauliflower curry',
    portion_description: '150g (approx. 3/4 cup)',
  },
  {
    name: 'Palak Paneer',
    calories: 190,
    protein_g: 11,
    carbohydrates_total_g: 6,
    fat_total_g: 14,
    serving_size_g: 150,
    cuisine: 'indian',
    category: 'mixed',
    description: 'Cottage cheese in spinach gravy',
    portion_description: '150g (approx. 3/4 cup)',
  },

  // Asian Protein Sources
  {
    name: 'Tofu',
    calories: 80,
    protein_g: 8,
    carbohydrates_total_g: 2,
    fat_total_g: 4.5,
    serving_size_g: 100,
    cuisine: 'asian',
    category: 'protein',
    description: 'Versatile soy-based protein source',
    portion_description: '100g (approx. 1/2 cup firm tofu)',
  },
  {
    name: 'Steamed Fish',
    calories: 120,
    protein_g: 22,
    carbohydrates_total_g: 0,
    fat_total_g: 3,
    serving_size_g: 100,
    cuisine: 'asian',
    category: 'protein',
    description: 'Light, protein-rich steamed fish often with ginger and scallions',
    portion_description: '100g (approx. 1 small fillet)',
  },
  {
    name: 'Miso Soup with Tofu',
    calories: 70,
    protein_g: 5,
    carbohydrates_total_g: 5,
    fat_total_g: 3,
    serving_size_g: 150,
    cuisine: 'asian',
    category: 'protein',
    description: 'Traditional Japanese soup with fermented soybean paste',
    portion_description: '150g (approx. 1 small bowl)',
  },

  // Asian Carb Sources
  {
    name: 'Brown Jasmine Rice',
    calories: 150,
    protein_g: 3,
    carbohydrates_total_g: 32,
    fat_total_g: 1,
    serving_size_g: 100,
    cuisine: 'asian',
    category: 'carb',
    description: 'Fragrant whole grain rice',
    portion_description: '100g (approx. 1/2 cup cooked)',
  },
  {
    name: 'Soba Noodles',
    calories: 110,
    protein_g: 5,
    carbohydrates_total_g: 24,
    fat_total_g: 0.5,
    serving_size_g: 100,
    cuisine: 'asian',
    category: 'carb',
    description: 'Japanese buckwheat noodles',
    portion_description: '100g (approx. 1 cup cooked)',
  },
  {
    name: 'Rice Noodles',
    calories: 190,
    protein_g: 2,
    carbohydrates_total_g: 44,
    fat_total_g: 0.5,
    serving_size_g: 100,
    cuisine: 'asian',
    category: 'carb',
    description: 'Thin, delicate noodles made from rice flour',
    portion_description: '100g (approx. 1 cup cooked)',
  },

  // Asian Mixed Dishes
  {
    name: 'Stir-Fried Vegetables with Tofu',
    calories: 150,
    protein_g: 10,
    carbohydrates_total_g: 12,
    fat_total_g: 7,
    serving_size_g: 200,
    cuisine: 'asian',
    category: 'mixed',
    description: 'Colorful vegetable stir-fry with tofu in light sauce',
    portion_description: '200g (approx. 1 cup)',
  },
  {
    name: 'Vegetable Curry',
    calories: 180,
    protein_g: 5,
    carbohydrates_total_g: 20,
    fat_total_g: 10,
    serving_size_g: 200,
    cuisine: 'asian',
    category: 'mixed',
    description: 'Mixed vegetables in coconut curry sauce',
    portion_description: '200g (approx. 1 cup)',
  },
  {
    name: 'Tom Yum Soup',
    calories: 90,
    protein_g: 8,
    carbohydrates_total_g: 7,
    fat_total_g: 3,
    serving_size_g: 200,
    cuisine: 'asian',
    category: 'mixed',
    description: 'Thai hot and sour soup with shrimp',
    portion_description: '200g (approx. 1 bowl)',
  },

  // Breakfast Options
  {
    name: 'Idli Sambar',
    calories: 150,
    protein_g: 5,
    carbohydrates_total_g: 28,
    fat_total_g: 2,
    serving_size_g: 150,
    cuisine: 'indian',
    category: 'mixed',
    description: 'Steamed rice cakes with lentil soup',
    portion_description: '2 medium idlis with 1/2 cup sambar',
  },
  {
    name: 'Masala Dosa',
    calories: 250,
    protein_g: 5,
    carbohydrates_total_g: 40,
    fat_total_g: 8,
    serving_size_g: 150,
    cuisine: 'indian',
    category: 'mixed',
    description: 'Crispy rice crepe filled with spiced potatoes',
    portion_description: '1 medium dosa with potato filling',
  },
  {
    name: 'Congee (Rice Porridge)',
    calories: 100,
    protein_g: 3,
    carbohydrates_total_g: 22,
    fat_total_g: 0.5,
    serving_size_g: 200,
    cuisine: 'asian',
    category: 'carb',
    description: 'Comforting rice porridge, often served with toppings',
    portion_description: '200g (approx. 1 small bowl)',
  }
];

// Helper function to get foods by cuisine and category
export function getFoodsByCategory(
  cuisine: 'indian' | 'asian' | 'general' | 'all',
  category: 'protein' | 'carb' | 'fat' | 'mixed' | 'all'
): FoodItem[] {
  return foodDatabase.filter(food => 
    (cuisine === 'all' || food.cuisine === cuisine) && 
    (category === 'all' || food.category === category)
  );
}

// Helper function to calculate portion size based on calorie target
export function calculatePortion(food: FoodItem, targetCalories: number): number {
  // Returns portion in grams
  return (targetCalories / food.calories) * food.serving_size_g;
}

// Helper function to get formatted portion description
export function getPortionDescription(food: FoodItem, calculatedPortion: number): string {
  const ratio = calculatedPortion / food.serving_size_g;
  const rounded = Math.round(ratio * 10) / 10; // Round to 1 decimal place
  
  if (rounded === 1) {
    return food.portion_description;
  } else {
    return `${rounded}× (${Math.round(calculatedPortion)}g) of ${food.portion_description}`;
  }
} 