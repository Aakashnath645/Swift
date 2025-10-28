import React from 'react';
import { usePlatform } from '../hooks/usePlatform';
import { ChevronLeftIcon, ArrowLeftIcon } from './icons';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack }) => {
  const platform = usePlatform();

  if (platform === 'ios') {
    return (
      <header className="relative flex items-center justify-center p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <button onClick={onBack} className="absolute left-2 p-2 flex items-center rounded-full text-cyan-600 dark:text-cyan-400">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-black dark:text-white">{title}</h1>
      </header>
    );
  }

  // Android and Web default
  return (
    <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-md">
      <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        <ArrowLeftIcon className="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 className="text-xl font-bold text-black dark:text-white ml-4">{title}</h1>
    </header>
  );
};

export default PageHeader;