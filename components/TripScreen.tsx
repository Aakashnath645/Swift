import React, { useState, useEffect } from 'react';
import type { Driver, RideOption, Location } from '../types';
import { StarIcon, PhoneIcon, MessageIcon } from './icons';
import AnimatedMapPlaceholder from './AnimatedMapPlaceholder';
import { formatCurrency } from '../utils/formatting';

interface TripScreenProps {
  driver: Driver;
  ride: RideOption;
  pickup: Location;
  dropoff: Location;
  fare: number;
  onTripEnd: () => void;
  onTripCancel: () => void;
}

const TripScreen: React.FC<TripScreenProps> = ({ driver, ride, pickup, dropoff, fare, onTripEnd, onTripCancel }) => {
  const [eta, setEta] = useState(driver.eta);
  const [tripStatus, setTripStatus] = useState(`Driver arriving in ${eta} min`);
  const [inProgress, setInProgress] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    let currentEta = driver.eta;
    setInProgress(false);

    const etaTimer = setInterval(() => {
        if (currentEta > 1) {
            currentEta--;
            setEta(currentEta);
            setTripStatus(`Driver arriving in ${currentEta} min`);
        } else {
            setEta(0);
            setTripStatus('Driver is arriving now');
            clearInterval(etaTimer);

            setTimeout(() => {
                setInProgress(true);
                setTripStatus(`On trip to ${dropoff.address.split(',')[0]}`);
                setTimeout(() => {
                    setTripStatus('You have arrived!');
                    setTimeout(onTripEnd, 2000);
                }, 5000);
            }, 2000);
        }
    }, 1500);

    return () => clearInterval(etaTimer);
  }, [driver.eta, dropoff.address, onTripEnd]);

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    onTripCancel();
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
        <div className="h-2/5">
             <AnimatedMapPlaceholder 
                status="trip" 
                eta={inProgress ? undefined : eta} 
                destination={dropoff.address}
             />
        </div>
        <div className="flex-1 p-4 -mt-16 rounded-t-3xl bg-gray-900 flex flex-col justify-between">
            <div>
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">{tripStatus}</h2>
                    {!inProgress && <p className="text-gray-400">Pickup at {pickup.address}</p>}
                </div>

                <div className="p-4 bg-gray-800 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full"/>
                            <div>
                                <h3 className="text-lg font-bold">{driver.name}</h3>
                                <div className="flex items-center text-sm text-amber-400">
                                    {driver.rating} <StarIcon className="w-4 h-4 ml-1"/>
                                </div>
                                <p className="text-xs text-gray-400">{driver.totalTrips} trips</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-lg">{driver.licensePlate}</div>
                           <p className="text-sm text-gray-400">{driver.vehicleModel}</p>
                           <p className="text-xs text-gray-400">Member since {driver.memberSince}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                        <span className="font-semibold text-gray-400">{ride.name}</span>
                        <span className="font-bold text-lg text-white">{formatCurrency(fare)}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
                <button 
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 py-3 bg-red-800/50 text-red-300 hover:bg-red-800/80 rounded-lg font-semibold transition-colors"
                >
                    Cancel Trip
                </button>
                <button onClick={() => setShowMessageModal(true)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <MessageIcon className="w-6 h-6"/>
                </button>
                <button onClick={() => setShowCallModal(true)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <PhoneIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>

        {/* Modals */}
        {showCancelModal && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-lg p-6 text-center space-y-4">
                    <h3 className="text-lg font-bold">Are you sure?</h3>
                    <p className="text-gray-400">A cancellation fee may apply if your driver is already on the way.</p>
                    <div className="flex space-x-4">
                        <button onClick={handleCancelConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold">Yes, Cancel</button>
                        <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold">Go Back</button>
                    </div>
                </div>
            </div>
        )}
        {showCallModal && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowCallModal(false)}>
                <div className="bg-gray-800 rounded-lg p-8 text-center space-y-4">
                    <PhoneIcon className="w-10 h-10 mx-auto text-cyan-400 animate-pulse" />
                    <h3 className="text-lg font-bold">Connecting to {driver.name}...</h3>
                    <p className="text-sm text-gray-400">(This is a simulation)</p>
                </div>
            </div>
        )}
        {showMessageModal && (
            <div className="absolute inset-0 bg-black/60 flex items-end justify-center z-50">
                <div className="bg-gray-800 rounded-t-lg p-4 w-full max-w-md h-3/5 flex flex-col">
                    <div className="flex-1 text-sm space-y-3 overflow-y-auto">
                        <div className="p-2 bg-cyan-800/50 rounded-lg self-end max-w-xs ml-auto">Hey, I'm just around the corner!</div>
                        <div className="p-2 bg-gray-700 rounded-lg self-start max-w-xs">Okay, thanks for the update.</div>
                    </div>
                     <div className="mt-4 flex items-center space-x-2">
                        <input type="text" readOnly value="Sounds good!" className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400" />
                        <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 bg-cyan-600 rounded-lg font-semibold">Close</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default TripScreen;
