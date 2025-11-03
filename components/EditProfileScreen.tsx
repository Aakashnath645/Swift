
import React, { useState, useRef } from 'react';
import { User } from '../types';
import PageHeader from './PageHeader';

interface EditProfileScreenProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onBack, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        onSave({ ...user, name, email, avatarUrl });
        setIsSaving(false);
        onBack();
    }, 1000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 animate-fadeIn">
      <PageHeader title="Edit Profile" onBack={onBack} />
      <main className="flex-1 p-6">
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col items-center">
                <img src={avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full border-2 border-cyan-500 dark:border-cyan-400 object-cover" />
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    className="hidden"
                    accept="image/*"
                />
                <button type="button" onClick={handleChangePhotoClick} className="mt-2 text-sm text-cyan-600 dark:text-cyan-400 hover:underline">Change Photo</button>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black dark:text-white"
                />
            </div>
             <button
                type="submit"
                disabled={isSaving || !name || !email}
                className="w-full py-3 mt-4 bg-cyan-600 text-white rounded-lg font-semibold border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-900 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:border-b-4 disabled:border-gray-500 dark:disabled:border-gray-800 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center"
            >
                {isSaving ? (
                     <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                    'Save Changes'
                )}
            </button>
        </form>
      </main>
    </div>
  );
};

export default EditProfileScreen;
