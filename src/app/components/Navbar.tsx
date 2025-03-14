import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Diet Planner Pro
            </h1>
          </div>
          <div className="flex items-center space-x-8">
            {['home', 'generator', 'about'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${
                    activeSection === section
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                  group`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400
                    transform scale-x-0 transition-transform duration-200 origin-left
                    ${
                      activeSection === section
                        ? 'scale-x-100'
                        : 'group-hover:scale-x-100'
                    }`}
                />
              </button>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 