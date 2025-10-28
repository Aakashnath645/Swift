import React, { useState, useEffect, useCallback } from 'react';
import type { Location, GroundingChunk } from '../types';
import { LocationMarkerIcon, ArrowRightIcon } from './icons';
import { findNearbyPlaces } from '../services/geminiService';
import AnimatedMapPlaceholder from './AnimatedMapPlaceholder';

interface HomeScreenProps {
  onLocationsSet: (pickup: Location, dropoff: Location) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLocationsSet }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [nearbyPlaces, setNearbyPlaces] = useState<GroundingChunk[]>([]);
  const [isFindingPlaces, setIsFindingPlaces] = useState(false);
  const [geminiResponseText, setGeminiResponseText] = useState('');

  const handleRequestRide = () => {
    if (pickup && dropoff) {
      onLocationsSet({ address: pickup }, { address: dropoff });
    }
  };

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position.coords);
          setPickup('Your Current Location');
          setError(null);
        },
        () => {
          setError('Unable to retrieve your location. Please enter it manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFindPlaces = async () => {
    if (!currentLocation) {
        setError('Could not get your location to find nearby places.');
        return;
    }
    setIsFindingPlaces(true);
    setNearbyPlaces([]);
    setGeminiResponseText('');
    const { text, places } = await findNearbyPlaces('popular restaurants', {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    });
    setGeminiResponseText(text);
    setNearbyPlaces(places as GroundingChunk[]);
    setIsFindingPlaces(false);
  };
  
  return (
    <div className="flex-1 flex flex-col bg-gray-900">
        <div className="h-3/5">
            <AnimatedMapPlaceholder status="idle" />
        </div>
        <div className="absolute top-0 left-0 right-0 p-4 pt-8 bg-gradient-to-b from-gray-900 to-transparent">
             <h1 className="text-3xl font-bold text-white">Where to?</h1>
        </div>

        <div className="flex-1 p-4 -mt-24 rounded-t-3xl bg-gray-900 flex flex-col justify-between">
            <div>
                <div className="space-y-3">
                    <div className="relative">
                        <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="From: Pickup location"
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        />
                    </div>
                    <div className="relative">
                        <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400"/>
                        <input
                            type="text"
                            placeholder="To: Where are you going?"
                            value={dropoff}
                            onChange={(e) => setDropoff(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        />
                    </div>
                </div>
                 {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                    <button onClick={handleFindPlaces} disabled={isFindingPlaces} className="text-cyan-400 text-sm font-semibold disabled:text-gray-500">
                       {isFindingPlaces ? 'Finding places...' : '✨ Find Restaurants Nearby (Gemini)'}
                    </button>
                    {isFindingPlaces && <div className="mt-2 h-1 w-full bg-gray-700 rounded-full overflow-hidden"><div className="h-1 bg-cyan-500 animate-pulse w-1/3"></div></div>}
                    {geminiResponseText && (
                        <div className="mt-2 text-sm text-gray-300 space-y-2">
                          <p>{geminiResponseText}</p>
                           {nearbyPlaces.length > 0 && <p className="font-bold">Check them out:</p>}
                           <div className="flex flex-wrap gap-2">
                            {nearbyPlaces.map((place, index) => (
                                place.maps && (
                                    <a key={index} href={place.maps.uri} target="_blank" rel="noopener noreferrer" className="bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded-md text-xs hover:bg-cyan-800/50">
                                        {place.maps.title}
                                    </a>
                                )
                            ))}
                           </div>
                        </div>
                    )}
                </div>
            </div>
            
            <button
                onClick={handleRequestRide}
                disabled={!pickup || !dropoff}
                className="w-full py-4 mt-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors disabled:bg-gray-700 disabled:text-gray-400 flex items-center justify-center text-lg"
            >
                Request Ride <ArrowRightIcon className="w-6 h-6 ml-2" />
            </button>
        </div>
    </div>
  );
};

export default HomeScreen;