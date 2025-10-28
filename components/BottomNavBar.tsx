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
    <nav className="flex justify-around items-center bg-gray-900 border-t border-gray-700 py-2" aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = activePage === item.page;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center w-1/3 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 rounded-md ${
              isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
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
