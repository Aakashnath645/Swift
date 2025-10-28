import React from 'react';
import { ReceiptIcon } from './icons';

const ActivityScreen: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 bg-gray-900">
      <ReceiptIcon className="w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold text-white">Ride History</h2>
      <p className="mt-2">Your past trips will appear here.</p>
    </div>
  );
};

export default ActivityScreen;