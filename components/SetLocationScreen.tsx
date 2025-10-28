import React, { useState, useEffect, useCallback } from 'react';
import { Location, GroundingChunk } from '../types';
import { getPlaceSuggestions } from '../services/geminiService';
import { LocationMarkerIcon, MapPinIcon } from './icons';
import PageHeader from './PageHeader';

interface SetLocationScreenProps {
  onBack: () => void;
  onLocationsSet: (pickup: Location, dropoff: Location) => void;
}

const SetLocationScreen: React.FC<SetLocationScreenProps> = ({ onBack, onLocationsSet }) => {
  const [pickup, setPickup] = useState('Your Current Location');
  const [dropoff, setDropoff] = useState('');
  const [suggestions, setSuggestions] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (position: GeolocationPosition) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedSuggestions = await getPlaceSuggestions({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setSuggestions(fetchedSuggestions);
    } catch (err) {
      setError("Couldn't load suggestions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        fetchSuggestions,
        (err) => {
          console.warn(`GEO ERROR(${err.code}): ${err.message}`);
          setError('Please enable location services to see suggestions.');
          setPickup(''); // Force user to enter pickup manually
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setPickup('');
      setIsLoading(false);
    }
  }, [fetchSuggestions]);
  
  const handleConfirm = () => {
    if (pickup && dropoff) {
      onLocationsSet({ address: pickup }, { address: dropoff });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 animate-fadeIn">
      <PageHeader title="Set your route" onBack={onBack} />
      <main className="flex-1 p-6 flex flex-col">
        <div className="space-y-4">
          <div className="relative">
            <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
            />
          </div>
          <div className="relative">
            <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              placeholder="Where are you going?"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
            />
          </div>
        </div>
        
        <div className="mt-6 flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Suggestions</h3>
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                </div>
            )}
            {error && <p className="text-center text-red-400">{error}</p>}
            {!isLoading && !error && suggestions.length === 0 && (
                 <p className="text-center text-gray-500">No suggestions found nearby.</p>
            )}
            <div className="space-y-2">
                {suggestions.map((chunk, index) => chunk.maps?.title && (
                    <button 
                        key={`${chunk.maps.uri}-${index}`}
                        onClick={() => setDropoff(chunk.maps!.title)}
                        className="w-full text-left flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <div className="p-2 bg-gray-700 rounded-full mr-4">
                           <MapPinIcon className="w-5 h-5 text-gray-400"/>
                        </div>
                        <span className="text-white">{chunk.maps.title}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-auto pt-4">
            <button
                onClick={handleConfirm}
                disabled={!pickup || !dropoff}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors disabled:bg-gray-700 disabled:text-gray-400 text-lg"
                >
                Confirm Locations
            </button>
        </div>
      </main>
    </div>
  );
};

export default SetLocationScreen;
