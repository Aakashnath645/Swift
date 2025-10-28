import React, { useState, useEffect } from 'react';
import type { Driver, RideOption, Location } from '../types';
import { StarIcon, PhoneIcon } from './icons';
import AnimatedMapPlaceholder from './AnimatedMapPlaceholder';

interface TripScreenProps {
  driver: Driver;
  ride: RideOption;
  pickup: Location;
  dropoff: Location;
  onTripEnd: () => void;
}

const TripScreen: React.FC<TripScreenProps> = ({ driver, ride, pickup, dropoff, onTripEnd }) => {
  const [eta, setEta] = useState(driver.eta);
  const [tripStatus, setTripStatus] = useState(`Driver arriving in ${eta} min`);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    let currentEta = driver.eta;
    setInProgress(false);

    const etaTimer = setInterval(() => {
        if (currentEta > 0) {
            currentEta--;
            setEta(currentEta);
            setTripStatus(`Driver arriving in ${currentEta} min`);
        } else {
            setEta(0);
            setTripStatus('Driver is arriving now');
            clearInterval(etaTimer);

            setTimeout(() => {
                setInProgress(true);
                setTripStatus(`On trip to ${dropoff.address}`);
                // Simulate trip duration
                setTimeout(() => {
                    setTripStatus('You have arrived!');
                    setTimeout(onTripEnd, 2000);
                }, 5000);
            }, 2000);
        }
    }, 1500); // Faster simulation for demo purposes

    return () => clearInterval(etaTimer);
  }, [driver.eta, dropoff.address, onTripEnd]);


  return (
    <div className="flex-1 flex flex-col bg-gray-900">
        <div className="h-3/5">
             <AnimatedMapPlaceholder 
                status="trip" 
                eta={inProgress ? undefined : eta} 
                destination={dropoff.address}
             />
        </div>
        <div className="flex-1 p-4 -mt-24 rounded-t-3xl bg-gray-900 flex flex-col justify-between">
            <div>
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">{tripStatus}</h2>
                    {!inProgress && <p className="text-gray-400">Pickup at {pickup.address}</p>}
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full"/>
                            <div>
                                <h3 className="text-lg font-bold">{driver.name}</h3>
                                <div className="flex items-center text-sm text-amber-400">
                                    {driver.rating} <StarIcon className="w-4 h-4 ml-1"/>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-lg">{driver.licensePlate}</div>
                           <p className="text-sm text-gray-400">{driver.vehicleModel}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
                <button className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors">
                    Cancel Trip
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <PhoneIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default TripScreen;