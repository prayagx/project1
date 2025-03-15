'use client';

import React, { Fragment, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface TooltipProps {
  content: ReactNode;
  children?: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  icon?: boolean;
}

export default function Tooltip({ 
  content, 
  children, 
  position = 'top',
  icon = false
}: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  };

  return (
    <Popover className="relative inline-block">
      {({ open }) => (
        <>
          <Popover.Button 
            className={`${icon ? 'inline-flex items-center justify-center' : 'inline'} 
              focus:outline-none transition-all duration-300 hover:opacity-80`}
          >
            {children || (
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center justify-center h-5 w-5 text-gray-400 hover:text-gray-500 ml-1"
              >
                <InformationCircleIcon className="h-5 w-5" />
              </motion.div>
            )}
          </Popover.Button>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className={`absolute z-10 ${positionClasses[position]}`}>
              <div className="bg-white dark:bg-dark-card border dark:border-dark-border p-2 rounded-md shadow-lg max-w-xs text-sm text-gray-700 dark:text-gray-200">
                {content}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
} 