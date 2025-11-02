import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { User, Location, SavedPlace, SavedPlaceType } from '../types';
import { LocationMarkerIcon, MapPinIcon, HomeOutlineIcon, BriefcaseIcon } from './icons';
import MockMap from './MockMap';
import { mockLandmarks } from '../constants';
import { getPlaceSuggestions } from '../services/geminiService';

interface HomeScreenProps {
  user: User;
  savedPlaces: SavedPlace[];
  onLocationsSet: (pickup: Location, dropoff: Location) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, savedPlaces, onLocationsSet }) => {
  // --- Panel State & Logic ---
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const dragState = useRef({ isDragging: false, startY: 0, endY: 0, panelHeight: 0 });

  const COLLAPSED_HEIGHT = 150;
  const EXPANDED_HEIGHT_VH = 80; // 80vh
  const panelHeight = isPanelExpanded ? `${EXPANDED_HEIGHT_VH}vh` : `${COLLAPSED_HEIGHT}px`;

  // --- Location State & Logic (from SetLocationScreen) ---
  const [pickup, setPickup] = useState<Location>({ address: 'Your Current Location', lat: 0, lng: 0});
  const [dropoff, setDropoff] = useState('');
  const [selectedDropoffLocation, setSelectedDropoffLocation] = useState<Location | null>(null);

  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Panel Interaction Handlers ---
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleTogglePanel = useCallback(() => {
    if(isDesktop) return;
    setIsPanelExpanded(prev => !prev);
  }, [isDesktop]);

  const handleDragEnd = useCallback(() => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;

    const deltaY = dragState.current.startY - dragState.current.endY; // Positive is drag up
    
    if (Math.abs(deltaY) > 50) { // Drag threshold
        setIsPanelExpanded(deltaY > 0); // Expand if dragged up, collapse if dragged down
    }
    
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);
  }, []);
  
  const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!dragState.current.isDragging) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragState.current.endY = y;
  }, []);

  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (isDesktop) return;
    dragState.current.isDragging = true;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragState.current.startY = y;
    dragState.current.endY = y;

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  }, [isDesktop, handleDragMove, handleDragEnd]);


  // --- Location Logic ---
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
          setPickup({ address: 'Your Current Location', lat: position.coords.latitude, lng: position.coords.longitude });
          fetchSuggestions(position.coords);
        },
        (err) => {
          setError('Please enable location services.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported.');
      setIsLoading(false);
    }
  }, []);
  
  const handleConfirm = () => {
    if (!pickup.address || !dropoff) return;

    // If a suggestion was clicked, use it. Otherwise, create a mock location from text.
    const finalDropoffLocation = selectedDropoffLocation || {
        address: dropoff,
        // Generate mock coordinates near the pickup for a realistic simulation
        lat: pickup.lat + (Math.random() - 0.5) * 0.05,
        lng: pickup.lng + (Math.random() - 0.5) * 0.05,
    };
    onLocationsSet(pickup, finalDropoffLocation);
  };
  
  const handleSelectSuggestion = (suggestion: Location) => {
    setDropoff(suggestion.address);
    setSelectedDropoffLocation(suggestion);
  };
  
  const handleSelectSavedPlace = (place: SavedPlace) => {
    setDropoff(place.location.address);
    setSelectedDropoffLocation(place.location);
  };

  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDropoff(e.target.value);
    // If user types manually, the previously selected suggestion is no longer valid
    if (selectedDropoffLocation) {
        setSelectedDropoffLocation(null);
    }
  };

  const getIconForPlace = (type: SavedPlaceType) => {
    switch (type) {
      case 'home': return <HomeOutlineIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
      case 'work': return <BriefcaseIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
      default: return <MapPinIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
    }
  }

  const mapCenter = { lat: 37.79, lng: -122.43 };
  const showExpandedView = isPanelExpanded || isDesktop;

  return (
    <div className="h-full flex flex-col lg:flex-row bg-white dark:bg-gray-900">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex-1 relative lg:order-2 min-h-0">
        <MockMap 
          center={mapCenter} 
          landmarks={mockLandmarks}
          isAnimating={true}
        />
        <div className="absolute top-0 left-0 right-0 p-4 pt-8 bg-gradient-to-b from-white via-white/70 to-transparent dark:from-gray-900 dark:via-gray-900/70 lg:hidden">
          <h1 className="text-3xl font-bold text-black dark:text-white">Swift</h1>
        </div>
      </div>

      <div 
        style={{ height: isDesktop ? 'auto' : panelHeight }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl-top-light dark:shadow-2xl-top-dark z-10 lg:order-1 lg:w-1/3 lg:max-w-md lg:rounded-none lg:shadow-none lg:border-r lg:border-gray-200 dark:lg:border-gray-700 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out"
      >
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={handleTogglePanel}
          className="lg:hidden w-full py-3 flex-shrink-0 flex justify-center items-center cursor-grab active:cursor-grabbing"
        >
            <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        <div className="flex-1 flex flex-col p-4 pt-0 lg:p-6 overflow-hidden">
          <div className="flex-shrink-0">
             <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                { showExpandedView ? `Where to, ${user.name.split(' ')[0]}?` : `Ready to ride, ${user.name.split(' ')[0]}?` }
            </h2>
            
            {!showExpandedView ? (
              <button 
                onClick={() => setIsPanelExpanded(true)}
                className="w-full text-left p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center space-x-3 hover:border-cyan-500 transition-colors shadow-lg"
              >
                <LocationMarkerIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400"/>
                <span className="text-lg text-black dark:text-white font-semibold">Set Destination</span>
              </button>
            ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={pickup.address} onChange={(e) => setPickup({...pickup, address: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg"/>
                  </div>
                  <div className="relative">
                    <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <input type="text" placeholder="Where are you going?" value={dropoff} onChange={handleDropoffChange} className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500"/>
                  </div>
                </div>
            )}
          </div>
          
          {showExpandedView && (
            <>
              <div className="flex-1 overflow-y-auto mt-6 space-y-6 scrollbar-hide">
                 {savedPlaces.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Saved Places</h3>
                        {savedPlaces.map(place => (
                            <button key={place.id} onClick={() => handleSelectSavedPlace(place)} className="w-full text-left flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full">{getIconForPlace(place.type)}</div>
                                <div><p className="font-semibold text-black dark:text-white">{place.label}</p><p className="text-sm text-gray-500 dark:text-gray-400">{place.location.address}</p></div>
                            </button>
                        ))}
                    </div>
                 )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Suggestions</h3>
                  {isLoading && <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-t-transparent border-cyan-500 rounded-full animate-spin"></div></div>}
                  {error && <p className="text-center text-red-500 py-8">{error}</p>}
                  {!isLoading && !error && (
                    <div className="flex space-x-4 overflow-x-auto pb-4 mt-3 -mx-4 px-4 scrollbar-hide">
                        {suggestions.map((s) => (
                            <button key={s.address} onClick={() => handleSelectSuggestion(s)} className="w-36 h-36 flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
                                <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"><MapPinIcon className="w-6 h-6 text-gray-500 dark:text-gray-400"/></div>
                                <span className="text-black dark:text-white font-medium text-sm line-clamp-2 h-10">{s.address}</span>
                            </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 mt-auto">
                <button
                    onClick={handleConfirm}
                    disabled={!pickup.address || !dropoff}
                    className="w-full py-3 bg-cyan-600 text-white rounded-lg font-semibold text-lg border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:border-b-4 disabled:border-gray-500 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                    Confirm Locations
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;