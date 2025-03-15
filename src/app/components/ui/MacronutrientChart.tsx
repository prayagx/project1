'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MacronutrientChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

export default function MacronutrientChart({ protein, carbs, fat }: MacronutrientChartProps) {
  const data = {
    labels: ['Protein', 'Carbohydrates', 'Fat'],
    datasets: [
      {
        data: [protein, carbs, fat],
        backgroundColor: [
          'rgba(45, 212, 191, 0.8)',  // Primary-400 color
          'rgba(99, 102, 241, 0.8)',  // Indigo-500 color
          'rgba(251, 146, 60, 0.8)',  // Orange-400 color
        ],
        borderColor: [
          'rgba(45, 212, 191, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(251, 146, 60, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value}g (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <motion.div 
      className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Macronutrient Distribution</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </motion.div>
  );
} 