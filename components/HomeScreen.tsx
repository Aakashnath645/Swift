import React, 'react';
import type { User } from '../types';
import { LocationMarkerIcon } from './icons';
import MockMap from './MockMap';
import { mockLandmarks } from '../constants';

interface HomeScreenProps {
  user: User;
  onNavigateToSetLocation: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onNavigateToSetLocation }) => {
  // Center the map around the landmarks for a consistent home screen view
  const mapCenter = { lat: 37.79, lng: -122.43 };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-white dark:bg-gray-900">
      <style>{`
        .shadow-2xl-top-light { box-shadow: 0 -20px 25px -5px rgb(0 0 0 / 0.05), 0 -8px 10px -6px rgb(0 0 0 / 0.05); }
        .shadow-2xl-top-dark { box-shadow: 0 -20px 25px -5px rgb(0 0 0 / 0.1), 0 -8px 10px -6px rgb(0 0 0 / 0.1); }
      `}</style>
      
      <div className="flex-1 relative lg:order-2">
        <div className="absolute inset-0">
          <MockMap 
            center={mapCenter} 
            landmarks={mockLandmarks}
            isAnimating={true}
          />
        </div>
        <div className="absolute top-0 left-0 right-0 p-4 pt-8 bg-gradient-to-b from-white via-white/70 to-transparent dark:from-gray-900 dark:via-gray-900/70 lg:hidden">
          <h1 className="text-3xl font-bold text-black dark:text-white">Swift</h1>
        </div>
      </div>

      <div className="p-4 pt-6 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl-top-light dark:shadow-2xl-top-dark z-10 lg:order-1 lg:w-1/3 lg:max-w-md lg:rounded-none lg:shadow-none lg:border-r lg:border-gray-200 dark:lg:border-gray-700 flex flex-col justify-center">
        <div className="w-full mx-auto">
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white">Swift</h1>
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
            Ready to ride, {user.name.split(' ')[0]}?
          </h2>
          <button 
            onClick={onNavigateToSetLocation}
            className="w-full text-left p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center space-x-3 hover:border-cyan-500 transition-colors shadow-lg"
          >
            <LocationMarkerIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400"/>
            <span className="text-lg text-black dark:text-white font-semibold">Where to?</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;