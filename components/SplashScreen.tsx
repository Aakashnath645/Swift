
import React from 'react';
import { Logo } from './icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white animate-fadeIn">
      <div className="flex items-center space-x-4">
        <Logo className="w-16 h-16 text-cyan-400 animate-pulse" />
        <h1 className="text-6xl font-bold tracking-tighter">Swift</h1>
      </div>
      <p className="mt-4 text-lg text-gray-400">Your ride, your way.</p>
    </div>
  );
};

export default SplashScreen;
