'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  required?: boolean;
}

const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      label,
      id,
      error,
      hint,
      labelClassName = '',
      inputClassName = '',
      containerClassName = '',
      errorClassName = '',
      hintClassName = '',
      required = false,
      ...props
    },
    ref
  ) => {
    const defaultLabelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
    const defaultInputClass = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ' +
      'focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ' +
      'dark:bg-gray-700 dark:border-gray-600 dark:text-white';
    const defaultErrorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';
    const defaultHintClass = 'mt-1 text-xs text-gray-500 dark:text-gray-400';
    
    const inputClasses = `${defaultInputClass} ${error ? 'border-red-300 dark:border-red-500' : ''} ${inputClassName}`;
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
        
        <input
          ref={ref}
          id={id}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          aria-required={required}
          className={inputClasses}
          {...props}
        />
        
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

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput; 