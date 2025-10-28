import React from 'react';
import { ArrowLeftIcon } from './icons';

interface PaymentMethodsScreenProps {
  onBack: () => void;
}

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-900 animate-fadeIn">
      <header className="flex items-center p-4 border-b border-gray-700">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white mx-auto">Payment Methods</h1>
      </header>
      <main className="flex-1 flex items-center justify-center text-gray-500">
        <p>Payment Methods page coming soon.</p>
      </main>
    </div>
  );
};

export default PaymentMethodsScreen;