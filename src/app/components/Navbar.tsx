import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';

interface NavbarProps {
  activeSection: string;
  onSectionChange?: (section: string) => void;
  setActiveSection?: (section: string) => void; // Keep for backward compatibility
  onThemeChange?: () => void;
  theme?: string;
}

export function Navbar({ 
  activeSection, 
  onSectionChange, 
  setActiveSection, 
  onThemeChange,
  theme = 'light'
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use either onSectionChange or setActiveSection for compatibility
  const handleSectionChange = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    } else if (setActiveSection) {
      setActiveSection(section);
    }
  };

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

  const navItems = [
    { name: 'Home', section: 'home', icon: <HomeIcon className="h-5 w-5" /> },
    { name: 'Features', section: 'features', icon: <ChartBarIcon className="h-5 w-5" /> },
    { name: 'About', section: 'about', icon: <InformationCircleIcon className="h-5 w-5" /> },
    { name: 'Testimonials', section: 'testimonials', icon: <UserGroupIcon className="h-5 w-5" /> },
    { name: 'Contact', section: 'contact', icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5" /> },
  ];

  return (
    <motion.nav 
      id="navbar"
      className={`fixed top-0 left-0 right-0 bg-white dark:bg-amoled-black border-b border-gray-200 dark:border-amoled-border z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md backdrop-blur-sm bg-white/90 dark:bg-amoled-black/95' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl font-bold text-gradient">
                MacroMindAI
              </span>
            </motion.div>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8 items-center">
              {navItems.map((item) => (
                <motion.a
                  key={item.section}
                  href={`#${item.section}`}
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium transition-all duration-300 rounded-full ${
                    activeSection === item.section
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/30'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-amoled-card'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionChange(item.section);
                    const element = document.getElementById(item.section);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle currentTheme={theme} onChange={onThemeChange} />
            
            <div className="sm:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-white dark:bg-amoled-card p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 shadow-sm"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="sm:hidden bg-white dark:bg-amoled-card border-b border-gray-200 dark:border-amoled-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.section}
                  href={`#${item.section}`}
                  className={`block px-4 py-2 rounded-full text-base font-medium flex items-center ${
                    activeSection === item.section
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-amoled-gray'
                  } transition-all duration-300`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionChange(item.section);
                    const element = document.getElementById(item.section);
                    element?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 5 }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 