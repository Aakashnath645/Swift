import React from 'react';
import { PersonIcon, CreditCardIcon, SettingsIcon, HelpCircleIcon, LogOutIcon, ChevronRightIcon, BookmarkIcon } from './icons';
import { User } from '../types';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onNavigateToEditProfile: () => void;
  onNavigateToPayments: () => void;
  onNavigateToSettings: () => void;
  onNavigateToHelp: () => void;
  onNavigateToSavedPlaces: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
    user,
    onLogout, 
    onNavigateToEditProfile,
    onNavigateToPayments,
    onNavigateToSettings,
    onNavigateToHelp,
    onNavigateToSavedPlaces,
}) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white p-6 lg:p-8">
      <div className="lg:grid lg:grid-cols-5 lg:gap-8 h-full">
        {/* Left Column: Profile Info & Stats */}
        <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-2 border-cyan-500 dark:border-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-2xl font-bold">{user.totalRides}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Rides</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-2xl font-bold">{user.rating.toFixed(2)} ★</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
              </div>
            </div>
        </div>

        {/* Right Column: Menu Options & Logout */}
        <div className="lg:col-span-3 flex flex-col justify-between mt-8 lg:mt-0">
          <div className="space-y-2">
              <ProfileMenuItem icon={<PersonIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />} label="Edit Profile" onClick={onNavigateToEditProfile} />
              <ProfileMenuItem icon={<BookmarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />} label="Saved Places" onClick={onNavigateToSavedPlaces} />
              <ProfileMenuItem icon={<CreditCardIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />} label="Payment Methods" onClick={onNavigateToPayments} />
              <ProfileMenuItem icon={<SettingsIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />} label="Settings" onClick={onNavigateToSettings} />
              <ProfileMenuItem icon={<HelpCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />} label="Help & Support" onClick={onNavigateToHelp} />
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-red-600 text-white rounded-lg font-semibold border-b-4 border-red-700 hover:bg-red-500 hover:border-red-600 active:border-b-0 active:translate-y-1 transition-all duration-150 ease-in-out mt-4"
          >
            <LogOutIcon className="w-6 h-6" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProfileMenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-center space-x-4">
            {icon}
            <span className="text-lg">{label}</span>
        </div>
        <ChevronRightIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
    </button>
);


export default ProfileScreen;