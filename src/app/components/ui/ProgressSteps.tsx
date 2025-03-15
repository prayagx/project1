'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

interface ProgressStepsProps {
  steps: number | string[];
  currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  // If steps is an array, use its length, otherwise use the number directly
  const stepCount = Array.isArray(steps) ? steps.length : steps;
  const stepLabels = Array.isArray(steps) ? steps : Array.from({ length: stepCount }, (_, i) => `Step ${i + 1}`);
  
  return (
    <div className="flex flex-col mb-8">
      <div className="flex justify-center">
        {Array.from({ length: stepCount }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          
          return (
            <div 
              key={stepNumber}
              className={`relative flex items-center ${stepNumber < stepCount ? 'flex-1' : ''}`}
            >
              {/* Step Circle */}
              <motion.div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center z-10
                  font-medium text-sm shadow-md
                  ${isActive 
                    ? 'bg-primary-500 text-white' 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 dark:bg-dark-card text-gray-600 dark:text-gray-300'}
                `}
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  transition: { duration: 0.3 }
                }}
              >
                {isCompleted ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  stepNumber
                )}
              </motion.div>
              
              {/* Progress Line */}
              {stepNumber < stepCount && (
                <div className="w-full mx-2 relative">
                  <div className="h-1 bg-gray-200 dark:bg-dark-border absolute w-full top-0 left-0" />
                  {(isCompleted || isActive) && (
                    <motion.div 
                      className="h-1 bg-primary-500 absolute top-0 left-0"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isCompleted ? '100%' : '50%',
                        transition: { duration: 0.3 }
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Step Labels */}
      <div className="flex justify-center mt-2">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          
          return (
            <div 
              key={stepNumber}
              className={`text-xs font-medium ${stepNumber < stepCount ? 'flex-1 text-center' : 'text-center'} px-1
                ${isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : isCompleted 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-400'}`}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
} 