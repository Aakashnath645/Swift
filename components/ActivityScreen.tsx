import React from 'react';
import { ReceiptIcon } from './icons';
import { TripRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/formatting';

interface ActivityScreenProps {
  tripHistory: TripRecord[];
}

const ActivityScreen: React.FC<ActivityScreenProps> = ({ tripHistory }) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-md">
            <h1 className="text-xl font-bold text-black dark:text-white text-center">Ride History</h1>
        </header>
        <main className="flex-1 p-4 overflow-y-auto">
            {tripHistory.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
                    <ReceiptIcon className="w-16 h-16 mb-4" />
                    <h2 className="text-2xl font-bold text-black dark:text-white">No Trips Yet</h2>
                    <p className="mt-2">Your past trips will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tripHistory.map((trip) => (
                        <div key={trip.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-fadeIn">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-black dark:text-white">{trip.rideName}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(trip.date)}</p>
                                </div>
                                <p className="font-bold text-lg text-black dark:text-white">{formatCurrency(trip.fare)}</p>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 text-sm space-y-2">
                                <p className="text-gray-700 dark:text-gray-300 truncate"><strong className="text-gray-500 dark:text-gray-500">From:</strong> {trip.pickup.address}</p>
                                <p className="text-gray-700 dark:text-gray-300 truncate"><strong className="text-gray-500 dark:text-gray-500">To:</strong> {trip.dropoff.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    </div>
  );
};

export default ActivityScreen;