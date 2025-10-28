import React, { useState, useEffect } from 'react';
import type { RideOption, Location } from '../types';
import { ArrowRightIcon, PersonIcon } from './icons';
import { formatCurrency } from '../utils/formatting';

interface RideSelectionScreenProps {
  pickup: Location;
  dropoff: Location;
  rideOptions: RideOption[];
  onRideSelected: (ride: RideOption) => void;
  onCancel: () => void;
}

const RideSelectionScreen: React.FC<RideSelectionScreenProps> = ({
  pickup,
  dropoff,
  rideOptions,
  onRideSelected,
  onCancel,
}) => {
  const [selectedRideId, setSelectedRideId] = useState<string | null>(rideOptions[0]?.id || null);
  const [isConfirming, setIsConfirming] = useState(false);
  const baseFare = 12.5; // Simulated base fare

  useEffect(() => {
    // Prevent leaving page while confirming
    if (isConfirming) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isConfirming]);

  const handleConfirmRide = () => {
    const selectedRide = rideOptions.find(r => r.id === selectedRideId);
    if (selectedRide) {
      setIsConfirming(true);
      onRideSelected(selectedRide);
    }
  };

  if (isConfirming) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900 text-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold">Finding your driver...</h2>
            <p className="text-gray-400 mt-2">This should only take a moment.</p>
            {/* The cancel button here is tricky UX-wise. In a real app, it would cancel the backend request. Here we'll just go back. */}
             <button onClick={onCancel} className="mt-8 text-gray-400 hover:text-white">Cancel Search</button>
        </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-4 bg-gray-900 animate-fadeIn">
        <div className="mb-4">
             <h1 className="text-2xl font-bold">Choose a ride</h1>
             <div className="text-sm text-gray-400 mt-2 p-3 bg-gray-800 rounded-lg">
                <p><strong>From:</strong> {pickup.address}</p>
                <p><strong>To:</strong> {dropoff.address}</p>
             </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
            {rideOptions.map((ride) => {
                const isSelected = ride.id === selectedRideId;
                return (
                    <div
                        key={ride.id}
                        onClick={() => setSelectedRideId(ride.id)}
                        className={`p-4 border-2 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                            isSelected ? 'bg-cyan-900/50 border-cyan-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        }`}
                    >
                        <div className="flex items-center space-x-4">
                            {ride.icon}
                            <div>
                                <h3 className="font-bold text-lg">{ride.name}</h3>
                                <p className="text-sm text-gray-400">{ride.description}</p>
                                <div className="flex items-center text-sm text-gray-400 mt-1">
                                    <PersonIcon className="w-4 h-4 mr-1"/> {ride.capacity}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lg">{formatCurrency(baseFare * ride.multiplier)}</p>
                           <p className="text-sm text-gray-400">Est. fare</p>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="mt-4">
             <button
                onClick={handleConfirmRide}
                disabled={!selectedRideId}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors disabled:bg-gray-700 disabled:text-gray-400 flex items-center justify-center text-lg"
            >
                Confirm {rideOptions.find(r => r.id === selectedRideId)?.name || 'Ride'}
                <ArrowRightIcon className="w-6 h-6 ml-2" />
            </button>
             <button onClick={onCancel} className="w-full text-center mt-3 text-gray-400 hover:text-white">Cancel</button>
        </div>

    </div>
  );
};

export default RideSelectionScreen;