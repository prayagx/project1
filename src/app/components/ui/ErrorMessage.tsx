import React from 'react';

interface ErrorMessageProps {
  message: string;
  code?: string;
  details?: string;
  onRetry?: () => void;
  retryLabel?: string;
  severity?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({
  message,
  code,
  details,
  onRetry,
  retryLabel = 'Try Again',
  severity = 'error'
}: ErrorMessageProps) {
  // Define styles based on severity
  const getSeverityStyles = () => {
    switch (severity) {
      case 'error':
        return {
          container: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200',
          button: 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700',
          icon: 'text-red-500 dark:text-red-400'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200',
          button: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700',
          icon: 'text-yellow-500 dark:text-yellow-400'
        };
      case 'info':
        return {
          container: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200',
          button: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700',
          icon: 'text-blue-500 dark:text-blue-400'
        };
      default:
        return {
          container: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200',
          button: 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700',
          icon: 'text-red-500 dark:text-red-400'
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`rounded-lg p-4 ${styles.container}`}>
      <div className="flex items-start">
        <div className={`mr-3 ${styles.icon}`}>
          {severity === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {severity === 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {severity === 'info' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium">{message}</div>
          {code && <div className="mt-1 text-sm opacity-75">Error code: {code}</div>}
          {details && <div className="mt-2 text-sm">{details}</div>}
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className={`ml-4 px-3 py-1 rounded-md transition-colors text-sm ${styles.button}`}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
} 