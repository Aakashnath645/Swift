import React from 'react';
import { Page } from '../types';
import { HomeIcon, ReceiptIcon, PersonIcon } from './icons';
import { usePlatform } from '../hooks/usePlatform';

interface BottomNavBarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { page: Page.HOME, label: 'Home', icon: HomeIcon },
  { page: Page.ACTIVITY, label: 'Activity', icon: ReceiptIcon },
  { page: Page.PROFILE, label: 'Profile', icon: PersonIcon },
];

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activePage, onNavigate }) => {
  const platform = usePlatform();
  const navBarClass = platform === 'ios'
      ? 'bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50'
      : 'bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg';

  return (
    <nav className={`flex justify-around items-center ${navBarClass} py-2`} aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = activePage === item.page;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center w-1/3 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 rounded-md py-1 ${
              isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;