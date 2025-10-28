import React from 'react';
import { ArrowLeftIcon } from './icons';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onUpdate, onBack }) => {

  const handleToggle = (key: keyof AppSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 animate-fadeIn">
      <header className="flex items-center p-4 border-b border-gray-700">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1 text-center mr-8">Settings</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2">Notifications</h2>
            <SettingsToggle
                label="Push Notifications"
                description="Receive updates about your ride status."
                isEnabled={settings.pushNotifications}
                onToggle={() => handleToggle('pushNotifications')}
            />
            <SettingsToggle
                label="Email Notifications"
                description="Get promotional offers and receipts."
                isEnabled={settings.emailNotifications}
                onToggle={() => handleToggle('emailNotifications')}
            />
        </div>
      </main>
    </div>
  );
};

interface SettingsToggleProps {
    label: string;
    description: string;
    isEnabled: boolean;
    onToggle: () => void;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, description, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                isEnabled ? 'bg-cyan-500' : 'bg-gray-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);


export default SettingsScreen;