import React, { useState, useEffect } from 'react';
import { Location } from '../types';
import { LocationMarkerIcon, MapPinIcon } from './icons';
import PageHeader from './PageHeader';
import { getPlaceSuggestions } from '../services/geminiService';

interface SetLocationScreenProps {
  onBack: () => void;
  onLocationsSet: (pickup: Location, dropoff: Location) => void;
}

const SetLocationScreen: React.FC<SetLocationScreenProps> = ({ onBack, onLocationsSet }) => {
  const [pickup, setPickup] = useState<Location>({ address: 'Your Current Location', lat: 0, lng: 0});
  const [dropoff, setDropoff] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async (coords: { latitude: number, longitude: number }) => {
        try {
            const geminiSuggestions = await getPlaceSuggestions({ lat: coords.latitude, lng: coords.longitude });
            setSuggestions(geminiSuggestions);
        } catch (err) {
            setError('Could not fetch suggestions.');
        } finally {
            setIsLoading(false);
        }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickup({
              address: 'Your Current Location',
              lat: position.coords.latitude,
              lng: position.coords.longitude
          });
          fetchSuggestions(position.coords);
        },
        (err) => {
          console.warn(`GEO ERROR(${err.code}): ${err.message}`);
          setError('Please enable location services to get suggestions.');
          setPickup({ address: '', lat: 0, lng: 0}); // Force user to enter pickup manually
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setPickup({ address: '', lat: 0, lng: 0});
      setIsLoading(false);
    }
  }, []);
  
  const handleConfirm = () => {
    if (pickup.address && dropoff) {
        // Find the selected suggestion to pass its coords
        const selectedDropoff = suggestions.find(s => s.address === dropoff) || { address: dropoff, lat: pickup.lat + 0.05, lng: pickup.lng + 0.05 }; // Fallback coords
        onLocationsSet(pickup, selectedDropoff);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 animate-fadeIn">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <PageHeader title="Set your route" onBack={onBack} />
      <main className="flex-1 p-6 flex flex-col">
        <div className="space-y-4">
          <div className="relative">
            <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pickup location"
              value={pickup.address}
              onChange={(e) => setPickup({...pickup, address: e.target.value})}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-black dark:text-white"
            />
          </div>
          <div className="relative">
            <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <input
              type="text"
              placeholder="Where are you going?"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-black dark:text-white"
            />
          </div>
        </div>
        
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Suggestions</h3>
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-2 border-t-transparent border-cyan-500 dark:border-cyan-400 rounded-full animate-spin"></div>
                </div>
            )}
            {error && <p className="text-center text-red-500 dark:text-red-400 py-8">{error}</p>}
            {!isLoading && !error && suggestions.length === 0 && (
                 <p className="text-center text-gray-400 dark:text-gray-500 py-8">No suggestions found nearby.</p>
            )}
            {!isLoading && !error && suggestions.length > 0 && (
              <div className="flex space-x-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                  {suggestions.map((suggestion) => (
                      <button 
                          key={suggestion.address}
                          onClick={() => setDropoff(suggestion.address)}
                          className="w-36 h-36 flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex flex-col items-center justify-center text-center space-y-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                          <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                             <MapPinIcon className="w-6 h-6 text-gray-500 dark:text-gray-400"/>
                          </div>
                          <span className="text-black dark:text-white font-medium text-sm line-clamp-2 h-10 flex items-center justify-center">{suggestion.address}</span>
                      </button>
                  ))}
              </div>
            )}
        </div>

        <div className="mt-auto pt-4">
            <button
                onClick={handleConfirm}
                disabled={!pickup.address || !dropoff}
                className="w-full py-3 bg-cyan-600 text-white rounded-lg font-semibold text-lg border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-900 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:border-b-4 disabled:border-gray-500 dark:disabled:border-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                Confirm Locations
            </button>
        </div>
      </main>
    </div>
  );
};

export default SetLocationScreen;