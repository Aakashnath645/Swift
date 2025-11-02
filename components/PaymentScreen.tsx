import React, { useState } from 'react';
import { TripRecord } from '../types';
import { formatCurrency } from '../utils/formatting';
import { CreditCardIcon } from './icons';

interface PaymentScreenProps {
  trip: TripRecord;
  onPaymentComplete: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ trip, onPaymentComplete }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            onPaymentComplete();
        }, 2000);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 text-center animate-fadeIn">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold">Trip Complete</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Please complete your payment.</p>

                <div className="my-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">From: <span className="font-medium text-black dark:text-white">{trip.pickup.address}</span></p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To: <span className="font-medium text-black dark:text-white">{trip.dropoff.address}</span></p>
                </div>

                <div className="text-6xl font-bold my-4">
                    {formatCurrency(trip.fare)}
                </div>

                {isProcessing ? (
                    <div className="flex flex-col items-center justify-center h-28">
                        <div className="w-12 h-12 border-4 border-t-transparent border-cyan-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Processing payment...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                         <button
                            onClick={handlePayment}
                            className="w-full py-3 bg-cyan-600 text-white rounded-lg font-semibold border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2"
                        >
                            <CreditCardIcon className="w-6 h-6" />
                            <span>Pay with Card</span>
                        </button>
                        <button
                            onClick={handlePayment}
                            className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Pay with Cash
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentScreen;
