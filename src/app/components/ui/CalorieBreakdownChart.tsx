'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CalorieBreakdownChartProps {
  mealData: {
    mealName: string;
    calories: number;
  }[];
}

export default function CalorieBreakdownChart({ mealData }: CalorieBreakdownChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Calories: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgba(107, 114, 128, 0.8)',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        title: {
          display: true,
          text: 'Calories',
          font: {
            size: 14,
          },
          color: 'rgba(107, 114, 128, 0.8)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgba(107, 114, 128, 0.8)',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: mealData.map(meal => meal.mealName),
    datasets: [
      {
        label: 'Calories',
        data: mealData.map(meal => meal.calories),
        backgroundColor: [
          'rgba(14, 184, 166, 0.6)',
          'rgba(79, 70, 229, 0.6)', 
          'rgba(249, 115, 22, 0.6)',
          'rgba(217, 70, 239, 0.6)',
          'rgba(2, 132, 199, 0.6)',
        ],
        borderColor: [
          'rgba(14, 184, 166, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(217, 70, 239, 1)',
          'rgba(2, 132, 199, 1)',
        ],
        borderWidth: 1,
        borderRadius: 8,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <motion.div 
      className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Calorie Breakdown by Meal</h3>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </motion.div>
  );
} 