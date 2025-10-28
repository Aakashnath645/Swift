import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from './icons';
import { User } from '../types';

interface EditProfileScreenProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onBack, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        onSave({ ...user, name, email });
        setIsSaving(false);
        onBack();
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 animate-fadeIn">
      <header className="flex items-center p-4 border-b border-gray-700">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1 text-center mr-8">Edit Profile</h1>
      </header>
      <main className="flex-1 p-6">
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col items-center">
                <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full border-2 border-cyan-400" />
                <button type="button" className="mt-2 text-sm text-cyan-400 hover:underline">Change Photo</button>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
            </div>
             <button
                type="submit"
                disabled={isSaving || !name || !email}
                className="w-full py-3 mt-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors disabled:bg-gray-500 flex items-center justify-center"
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