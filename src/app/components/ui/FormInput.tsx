'use client';

import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

type ValidationState = 'default' | 'valid' | 'invalid';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  helper?: string;
  tooltip?: ReactNode;
  required?: boolean;
  validation?: (value: string | number) => boolean;
  errorMessage?: string;
  min?: number;
  max?: number;
  className?: string;
}

export default function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  helper,
  tooltip,
  required = false,
  validation,
  errorMessage = 'Invalid input',
  min,
  max,
  className = ''
}: FormInputProps) {
  const [validationState, setValidationState] = useState<ValidationState>('default');
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    
    if (validation && value) {
      setValidationState(validation(value) ? 'valid' : 'invalid');
    } else if (required && !value) {
      setValidationState('invalid');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setValidationState('default');
  };

  const validationIcon = () => {
    if (validationState === 'valid') {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else if (validationState === 'invalid') {
      return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  const inputClasses = `
    px-4 py-2 w-full rounded-md bg-white dark:bg-dark-bg border
    focus:ring-2 focus:outline-none transition-all duration-300
    ${validationState === 'valid' 
      ? 'border-green-500 focus:border-green-500 focus:ring-green-200 dark:focus:ring-green-900' 
      : validationState === 'invalid' 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900' 
        : 'border-gray-300 dark:border-dark-border focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-900'
    }
    ${className}
  `;

  return (
    <div className="mb-4">
      <div className="flex items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltip && (
          <div className="ml-1">
            <Tooltip content={tooltip} position="top" icon />
          </div>
        )}
      </div>
      
      <div className="relative">
        <motion.input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          className={inputClasses}
          required={required}
          initial={false}
          animate={isFocused ? { scale: 1.005 } : { scale: 1 }}
          whileTap={{ scale: 0.995 }}
        />
        
        {validationState !== 'default' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {validationIcon()}
          </div>
        )}
      </div>
      
      {helper && validationState === 'default' && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helper}</p>
      )}
      
      {validationState === 'invalid' && (
        <motion.p 
          className="mt-1 text-xs text-red-500" 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {errorMessage}
        </motion.p>
      )}
    </div>
  );
} 