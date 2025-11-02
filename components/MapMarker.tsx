import React from 'react';
import { CarIcon, MapPinIcon } from './icons';

interface MapMarkerProps {
  type: 'pickup' | 'dropoff' | 'car' | 'current' | 'landmark';
}

const MapMarker: React.FC<MapMarkerProps> = ({ type }) => {
  switch (type) {
    case 'car':
      return (
          <div className="p-2 bg-black rounded-full shadow-lg transition-transform duration-500 ease-in-out">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
      );
    case 'pickup':
      return (
        <div className="w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-md" />
      );
    case 'dropoff':
      return (
        <div className="w-3 h-3 bg-red-500 border-2 border-white rounded-full shadow-md" />
      );
    case 'current':
        return (
          <div className="w-4 h-4 bg-cyan-500 border-2 border-white rounded-full shadow-lg animate-pulse" />
        );
    case 'landmark':
        return (
          <div className="relative flex items-center justify-center animate-pulse-slow">
              <MapPinIcon className="w-5 h-5 text-amber-500 dark:text-amber-400 opacity-80" />
          </div>
        );
    default:
      return null;
  }
};

export default MapMarker;