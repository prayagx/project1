'use client';

import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface AccessibleSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  labelClassName?: string;
  selectClassName?: string;
  containerClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  required?: boolean;
}

const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  (
    {
      label,
      id,
      options,
      error,
      hint,
      labelClassName = '',
      selectClassName = '',
      containerClassName = '',
      errorClassName = '',
      hintClassName = '',
      required = false,
      ...props
    },
    ref
  ) => {
    const defaultLabelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
    const defaultSelectClass = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ' +
      'focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ' +
      'dark:bg-gray-700 dark:border-gray-600 dark:text-white';
    const defaultErrorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';
    const defaultHintClass = 'mt-1 text-xs text-gray-500 dark:text-gray-400';
    
    const selectClasses = `${defaultSelectClass} ${error ? 'border-red-300 dark:border-red-500' : ''} ${selectClassName}`;
    const ariaInvalid = error ? true : undefined;
    const ariaDescribedby = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
    
    return (
      <div className={`mb-4 ${containerClassName}`}>
        <label 
          htmlFor={id} 
          className={`${defaultLabelClass} ${labelClassName}`}
        >
          {label}
          {required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
          {required && <span className="sr-only">(required)</span>}
        </label>
        
        <select
          ref={ref}
          id={id}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          aria-required={required}
          className={selectClasses}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <div 
            id={`${id}-error`} 
            className={`${defaultErrorClass} ${errorClassName}`}
            role="alert"
          >
            {error}
          </div>
        )}
        
        {hint && !error && (
          <div 
            id={`${id}-hint`} 
            className={`${defaultHintClass} ${hintClassName}`}
          >
            {hint}
          </div>
        )}
      </div>
    );
  }
);

AccessibleSelect.displayName = 'AccessibleSelect';

export default AccessibleSelect; 