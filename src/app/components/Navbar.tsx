import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('navbar');
      if (nav && !nav.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-dark-text">
                MacroMindAI
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => setActiveSection('home')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeSection === 'home'
                    ? 'border-blue-500 text-gray-900 dark:text-dark-text'
                    : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:border-gray-300 dark:hover:border-dark-border hover:text-gray-700 dark:hover:text-dark-text'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveSection('generator')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeSection === 'generator'
                    ? 'border-blue-500 text-gray-900 dark:text-dark-text'
                    : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:border-gray-300 dark:hover:border-dark-border hover:text-gray-700 dark:hover:text-dark-text'
                }`}
              >
                Diet Generator
              </button>
              <button
                onClick={() => setActiveSection('about')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeSection === 'about'
                    ? 'border-blue-500 text-gray-900 dark:text-dark-text'
                    : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:border-gray-300 dark:hover:border-dark-border hover:text-gray-700 dark:hover:text-dark-text'
                }`}
              >
                About
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-dark-card">
          <button
            onClick={() => {
              setActiveSection('home');
              setIsMobileMenuOpen(false);
            }}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              activeSection === 'home'
                ? 'bg-blue-50 dark:bg-dark-bg border-blue-500 text-blue-700 dark:text-dark-text'
                : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-bg hover:border-gray-300 dark:hover:border-dark-border hover:text-gray-700 dark:hover:text-dark-text'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveSection('generator');
              setIsMobileMenuOpen(false);
            }}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              activeSection === 'generator'
                ? 'bg-blue-50 dark:bg-dark-bg border-blue-500 text-blue-700 dark:text-dark-text'
                : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-bg hover:border-gray-300 dark:hover:border-dark-border hover:text-gray-700 dark:hover:text-dark-text'
            }`}
          >
            Diet Generator
          </button>
          <button
            onClick={() => {
              setActiveSection('about');
              setIsMobileMenuOpen(false);
            }}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              activeSection === 'about'
                ? 'bg-blue-50 dark:bg-dark-bg border-blue-500 text-blue-700 dark:text-dark-text'
                : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-bg hover:border-gray-300 dark:hover:border-dark-border hover:text-gray-700 dark:hover:text-dark-text'
            }`}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  );
} 