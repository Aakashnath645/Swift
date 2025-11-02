import React from 'react';
import { Page } from '../types';
import { HomeIcon, ReceiptIcon, PersonIcon, Logo } from './icons';

interface SideNavBarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { page: Page.HOME, label: 'Home', icon: HomeIcon },
  { page: Page.ACTIVITY, label: 'Activity', icon: ReceiptIcon },
  { page: Page.PROFILE, label: 'Profile', icon: PersonIcon },
];

const SideNavBar: React.FC<SideNavBarProps> = ({ activePage, onNavigate }) => {
  return (
    <nav className="hidden lg:flex flex-col w-20 bg-gray-900 dark:bg-black p-4 justify-between items-center" aria-label="Main navigation">
      <div>
        <div className="p-2 mb-8">
            <Logo className="w-10 h-10 text-cyan-400" />
        </div>
        <div className="space-y-4">
          {navItems.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 ${
                  isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
                title={item.label}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full"></div>}
                <item.icon className="w-7 h-7" />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default SideNavBar;
