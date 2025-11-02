import React from 'react';
import { AppSettings, Theme } from '../types';
import PageHeader from './PageHeader';
import { usePlatform } from '../hooks/usePlatform';
import { ChevronRightIcon } from './icons';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  onBack: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  onNavigateToLegal: (type: 'terms' | 'cancellation') => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onUpdate, onBack, theme, onThemeToggle, onNavigateToLegal }) => {

  const handleToggle = (key: keyof AppSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 animate-fadeIn">
      <PageHeader title="Settings" onBack={onBack} />
      <main className="flex-1 p-6 space-y-8">
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Appearance</h2>
            <SettingsToggle
                label="Dark Mode"
                description={theme === 'dark' ? 'Enabled' : 'Disabled'}
                isEnabled={theme === 'dark'}
                onToggle={onThemeToggle}
            />
        </div>
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Notifications</h2>
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
         <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Legal</h2>
            <SettingsLink label="Terms & Conditions" onClick={() => onNavigateToLegal('terms')} />
            <SettingsLink label="Cancellation Policy" onClick={() => onNavigateToLegal('cancellation')} />
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

const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, description, isEnabled, onToggle }) => {
    const platform = usePlatform();

    if (platform === 'ios') {
        return (
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="font-semibold">{label}</p>
                <button
                    onClick={onToggle}
                    role="switch"
                    aria-checked={isEnabled}
                    className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 ease-in-out ${
                        isEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                    <span
                        className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out shadow-lg ${
                            isEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
        );
    }

    // Android/Web
    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div>
                <p className="font-semibold">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
             <button
                onClick={onToggle}
                role="switch"
                aria-checked={isEnabled}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    isEnabled ? 'bg-cyan-500/70' : 'bg-gray-400 dark:bg-gray-600'
                }`}
            >
                 <span
                    className={`inline-block w-4 h-4 transform rounded-full transition-transform ${
                        isEnabled ? 'translate-x-6 bg-cyan-500 dark:bg-cyan-400' : 'translate-x-1 bg-gray-300'
                    }`}
                />
            </button>
        </div>
    );
};


interface SettingsLinkProps {
    label: string;
    onClick: () => void;
}

const SettingsLink: React.FC<SettingsLinkProps> = ({ label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <span className="font-semibold">{label}</span>
        <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
    </button>
);


export default SettingsScreen;
