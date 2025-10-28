import React from 'react';
import { PersonIcon } from './icons';

const ProfileScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500 bg-gray-900">
      <PersonIcon className="w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold text-white">Your Profile</h2>
      <p className="mt-2">Account settings and information.</p>
    </div>
  );
};

export default ProfileScreen;
