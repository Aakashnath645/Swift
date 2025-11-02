import React, { useState, useEffect, useCallback } from 'react';
import type { RideOption, Location, Driver } from '../types';
import { ArrowRightIcon, PersonIcon } from './icons';
import { formatCurrency } from '../utils/formatting';
import { calculateFare } from '../services/geminiService';
import { mockDrivers } from '../constants';

interface RideSelectionScreenProps {
  pickup: Location;
  dropoff: Location;
  rideOptions: RideOption[];
  onRideSelected: (ride: RideOption, fare: number, eta: number) => void;
  onCancel: () => void;
}

type FareInfo = {
    fare: number;
    distance: string;
    reasoning: string;
    eta: number;
    isLoading: boolean;
};

const RideSelectionScreen: React.FC<RideSelectionScreenProps> = ({
  pickup,
  dropoff,
  rideOptions,
  onRideSelected,
  onCancel,
}) => {
  const [selectedRideId, setSelectedRideId] = useState<string | null>(rideOptions[0]?.id || null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [fares, setFares] = useState<Record<string, FareInfo>>({});
  
  // A random driver is chosen just for calculation purposes. The final driver is assigned in App.tsx.
  const calculationDriver = React.useMemo(() => mockDrivers[Math.floor(Math.random() * mockDrivers.length)], []);

  const getFares = useCallback(async () => {
    const initialFares: Record<string, FareInfo> = {};
    rideOptions.forEach(ride => {
        initialFares[ride.id] = { fare: 0, distance: '', reasoning: '', eta: 0, isLoading: true };
    });
    setFares(initialFares);

    for (const ride of rideOptions) {
        const result = await calculateFare(pickup, dropoff, ride, calculationDriver);
        setFares(prevFares => ({
            ...prevFares,
            [ride.id]: { ...result, isLoading: false }
        }));
    }
  }, [pickup, dropoff, rideOptions, calculationDriver]);

  useEffect(() => {
    getFares();
  }, [getFares]);

  const handleConfirmRide = () => {
    const selectedRide = rideOptions.find(r => r.id === selectedRideId);
    const selectedFareInfo = selectedRideId ? fares[selectedRideId] : null;
    if (selectedRide && selectedFareInfo && !selectedFareInfo.isLoading) {
      setIsConfirming(true);
      onRideSelected(selectedRide, selectedFareInfo.fare, selectedFareInfo.eta);
    }
  };

  if (isConfirming) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 text-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-cyan-500 dark:border-cyan-400 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold">Finding your driver...</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">This should only take a moment.</p>
             <button onClick={onCancel} className="mt-8 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Cancel Search</button>
        </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-4 bg-white dark:bg-gray-900 animate-fadeIn">
        <div className="mb-4">
             <h1 className="text-2xl font-bold">Choose a ride</h1>
             <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p><strong className="text-gray-600 dark:text-gray-300">From:</strong> {pickup.address}</p>
                <p><strong className="text-gray-600 dark:text-gray-300">To:</strong> {dropoff.address}</p>
             </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
            {rideOptions.map((ride) => {
                const isSelected = ride.id === selectedRideId;
                const fareInfo = fares[ride.id];
                return (
                    <div
                        key={ride.id}
                        onClick={() => setSelectedRideId(ride.id)}
                        className={`p-4 border-2 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                            isSelected ? 'bg-cyan-500/10 dark:bg-cyan-900/50 border-cyan-500' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                    >
                        <div className="flex items-center space-x-4">
                            {ride.icon}
                            <div>
                                <h3 className="font-bold text-lg">{ride.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{ride.description}</p>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <PersonIcon className="w-4 h-4 mr-1"/> {ride.capacity}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                           {fareInfo?.isLoading ? (
                                <div className="w-6 h-6 border-2 border-t-transparent border-gray-800 dark:border-white rounded-full animate-spin ml-auto"></div>
                           ) : (
                               <div>
                                   <p className="font-bold text-lg">{formatCurrency(fareInfo?.fare || 0)}</p>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">
                                     {fareInfo?.distance || ''}{fareInfo?.distance && fareInfo?.eta ? ' · ' : ''}{fareInfo?.eta ? `~${fareInfo.eta} min` : ''}
                                   </p>
                               </div>
                           )}
                           
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="mt-4">
             <button
                onClick={handleConfirmRide}
                disabled={!selectedRideId || !fares[selectedRideId] || fares[selectedRideId].isLoading}
                className="w-full py-3 bg-cyan-600 text-white rounded-lg font-semibold text-lg border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-900 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:border-b-4 disabled:border-gray-500 dark:disabled:border-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center"
            >
                Confirm {rideOptions.find(r => r.id === selectedRideId)?.name || 'Ride'}
                <ArrowRightIcon className="w-6 h-6 ml-2" />
            </button>
             <button onClick={onCancel} className="w-full text-center mt-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Cancel</button>
        </div>

    </div>
  );
};

export default RideSelectionScreen;