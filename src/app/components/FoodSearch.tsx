import { useState } from 'react';
import { getNutritionInfo, NutritionInfo } from '../services/nutritionService';

export function FoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NutritionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getNutritionInfo(query);
      setResults(data);
    } catch (err) {
      setError('Failed to fetch nutritional information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a food item..."
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4">
          {results.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md
                       hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.name}
              </h3>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.calories}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.protein_g}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.carbohydrates_total_g}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fat</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.fat_total_g}g
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Serving size: {item.serving_size_g}g
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 