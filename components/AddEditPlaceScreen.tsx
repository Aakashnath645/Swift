import React, { useState } from 'react';
import { SavedPlace, SavedPlaceType, Location, LatLng } from '../types';
import PageHeader from './PageHeader';
import { HomeOutlineIcon, BriefcaseIcon, MapPinIcon } from './icons';

interface AddEditPlaceScreenProps {
  placeToEdit?: SavedPlace;
  onSave: (place: SavedPlace) => void;
  onBack: () => void;
  userLocation: LatLng; // Used to generate mock coords for new addresses
}

const placeTypes: { value: SavedPlaceType; label: string; icon: React.ReactNode }[] = [
    { value: 'home', label: 'Home', icon: <HomeOutlineIcon className="w-5 h-5"/> },
    { value: 'work', label: 'Work', icon: <BriefcaseIcon className="w-5 h-5"/> },
    { value: 'pin', label: 'Other', icon: <MapPinIcon className="w-5 h-5"/> },
];

const AddEditPlaceScreen: React.FC<AddEditPlaceScreenProps> = ({ placeToEdit, onSave, onBack, userLocation }) => {
  const [label, setLabel] = useState(placeToEdit?.label || '');
  const [address, setAddress] = useState(placeToEdit?.location.address || '');
  const [type, setType] = useState<SavedPlaceType>(placeToEdit?.type || 'pin');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !address) return;

    setIsSaving(true);
    
    // Simulate API call and geocoding
    setTimeout(() => {
      const newPlace: SavedPlace = {
        id: placeToEdit?.id || new Date().toISOString(),
        label,
        type,
        location: {
          address,
          // If editing, keep old coords. If new, create mock coords near the user.
          lat: placeToEdit?.location.lat || userLocation.lat + (Math.random() - 0.5) * 0.1,
          lng: placeToEdit?.location.lng || userLocation.lng + (Math.random() - 0.5) * 0.1,
        },
      };
      onSave(newPlace);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 animate-fadeIn">
      <PageHeader title={placeToEdit ? 'Edit Place' : 'Add Place'} onBack={onBack} />
      <main className="flex-1 p-6">
        <form onSubmit={handleSave} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Icon</label>
                <div className="flex space-x-2">
                    {placeTypes.map(pt => (
                        <button
                            key={pt.value}
                            type="button"
                            onClick={() => setType(pt.value)}
                            className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                                type === pt.value
                                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                            }`}
                        >
                            {pt.icon}
                            <span>{pt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Label</label>
                <input
                    id="label"
                    type="text"
                    placeholder={type === 'home' ? 'Home' : type === 'work' ? 'Work' : 'e.g., Gym'}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-black dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
                <input
                    id="address"
                    type="text"
                    placeholder="Enter the full address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-black dark:text-white"
                />
            </div>
             <button
                type="submit"
                disabled={isSaving || !label || !address}
                className="w-full py-3 mt-4 bg-cyan-600 text-white rounded-lg font-semibold border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-900 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:border-b-4 disabled:border-gray-500 dark:disabled:border-gray-800 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center"
            >
                {isSaving ? (
                     <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                    'Save Place'
                )}
            </button>
        </form>
      </main>
    </div>
  );
};

export default AddEditPlaceScreen;
