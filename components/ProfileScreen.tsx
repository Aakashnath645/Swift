import React from 'react';
import { PersonIcon, CreditCardIcon, SettingsIcon, HelpCircleIcon, LogOutIcon, ChevronRightIcon } from './icons';

// Mock user data for demonstration
const mockUser = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/id/1027/200/200',
  memberSince: 'June 2024',
  totalRides: 42,
  rating: 4.95,
};

interface ProfileScreenProps {
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white p-6 space-y-8">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <img src={mockUser.avatarUrl} alt={mockUser.name} className="w-20 h-20 rounded-full border-2 border-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold">{mockUser.name}</h1>
          <p className="text-gray-400">{mockUser.email}</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-2xl font-bold">{mockUser.totalRides}</p>
          <p className="text-sm text-gray-400">Total Rides</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-2xl font-bold">{mockUser.rating.toFixed(2)} ★</p>
          <p className="text-sm text-gray-400">Rating</p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
            <ProfileMenuItem icon={<PersonIcon className="w-6 h-6 text-gray-400" />} label="Edit Profile" />
            <ProfileMenuItem icon={<CreditCardIcon className="w-6 h-6 text-gray-400" />} label="Payment Methods" />
            <ProfileMenuItem icon={<SettingsIcon className="w-6 h-6 text-gray-400" />} label="Settings" />
            <ProfileMenuItem icon={<HelpCircleIcon className="w-6 h-6 text-gray-400" />} label="Help & Support" />
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-red-600/20 text-red-400 rounded-lg font-semibold hover:bg-red-600/40 transition-colors mt-4"
        >
          <LogOutIcon className="w-6 h-6" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

const ProfileMenuItem: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
    <button className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
        <div className="flex items-center space-x-4">
            {icon}
            <span className="text-lg">{label}</span>
        </div>
        <ChevronRightIcon className="w-6 h-6 text-gray-500" />
    </button>
);


export default ProfileScreen;