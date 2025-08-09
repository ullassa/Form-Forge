import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Rss as FormIcon } from 'lucide-react';

const Navigation: React.FC = () => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { path: '/create', label: 'Create', icon: '✚' },
    { path: '/preview', label: 'Preview', icon: '👁' },
    { path: '/myforms', label: 'My Forms', icon: '📁' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 min-w-0 flex-1 sm:flex-initial">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FormIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white truncate">
                Professional Form Builder
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Dynamic Form Creation Platform
              </p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "default" : "ghost"}
                  className="px-3 lg:px-4 py-2 text-sm font-medium"
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "default" : "ghost"}
                  size="sm"
                  className="px-2 py-2"
                  title={item.label}
                >
                  <span>{item.icon}</span>
                </Button>
              </Link>
            ))}
          </nav>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 ml-2"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
