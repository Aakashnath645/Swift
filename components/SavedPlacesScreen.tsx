import React from 'react';
import { SavedPlace, SavedPlaceType } from '../types';
import PageHeader from './PageHeader';
import { HomeOutlineIcon, BriefcaseIcon, MapPinIcon, TrashIcon, AddIcon } from './icons';

interface SavedPlacesScreenProps {
  savedPlaces: SavedPlace[];
  onAdd: () => void;
  onEdit: (place: SavedPlace) => void;
  onDelete: (placeId: string) => void;
  onBack: () => void;
}

const getIconForPlace = (type: SavedPlaceType) => {
    switch (type) {
        case 'home': return <HomeOutlineIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
        case 'work': return <BriefcaseIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
        default: return <MapPinIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
    }
}

const SavedPlacesScreen: React.FC<SavedPlacesScreenProps> = ({ savedPlaces, onAdd, onEdit, onDelete, onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 animate-fadeIn">
      <PageHeader title="Saved Places" onBack={onBack} />
      <main className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-4">
            {savedPlaces.length > 0 ? (
                savedPlaces.map(place => (
                    <div key={place.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                        <button onClick={() => onEdit(place)} className="flex-1 text-left flex items-center space-x-4">
                            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full">{getIconForPlace(place.type)}</div>
                            <div>
                                <p className="font-semibold text-black dark:text-white">{place.label}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{place.location.address}</p>
                            </div>
                        </button>
                        <button onClick={() => onDelete(place.id)} className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-full ml-2">
                            <TrashIcon className="w-6 h-6" />
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-400 dark:text-gray-500 py-16">
                    <MapPinIcon className="w-12 h-12 mx-auto mb-2"/>
                    <h2 className="text-xl font-bold text-black dark:text-white">No Saved Places</h2>
                    <p>Add your home, work, and other favorite spots for faster bookings.</p>
                </div>
            )}
        </div>
        <button
            onClick={onAdd}
            className="w-full py-3 mt-4 bg-cyan-600 text-white rounded-lg font-semibold border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all duration-150 ease-in-out flex items-center justify-center space-x-2"
        >
            <AddIcon className="w-6 h-6" />
            <span>Add a New Place</span>
        </button>
      </main>
    </div>
  );
};

export default SavedPlacesScreen;
