import React from 'react';
import { Page } from '../types';
import { HomeIcon, ReceiptIcon, PersonIcon } from './icons';

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
  return (
    <nav
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex justify-around items-center border-t border-gray-200/50 dark:border-gray-700/50 z-30 lg:hidden"
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const isActive = activePage === item.page;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full w-1/3 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 rounded-lg ${
              isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <div className={`absolute top-0 bottom-0 left-2 right-2 rounded-lg transition-colors ${isActive ? 'bg-cyan-500/10' : ''}`} />
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-bold mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;