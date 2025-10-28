import React from 'react';
import { ArrowLeftIcon, CreditCardIcon, TrashIcon } from './icons';
import { PaymentMethod } from '../types';

interface PaymentMethodsScreenProps {
  paymentMethods: PaymentMethod[];
  onUpdate: (methods: PaymentMethod[]) => void;
  onBack: () => void;
}

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ paymentMethods, onUpdate, onBack }) => {

  const handleAddMethod = () => {
    const newMethod: PaymentMethod = {
      id: new Date().toISOString(),
      type: Math.random() > 0.5 ? 'visa' : 'mastercard',
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
    };
    onUpdate([...paymentMethods, newMethod]);
  };

  const handleRemoveMethod = (id: string) => {
    onUpdate(paymentMethods.filter(method => method.id !== id));
  };
  
  return (
    <div className="flex-1 flex flex-col bg-gray-900 animate-fadeIn">
      <header className="flex items-center p-4 border-b border-gray-700">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1 text-center mr-8">Payment Methods</h1>
      </header>
      <main className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-4">
            {paymentMethods.length > 0 ? (
                paymentMethods.map(method => (
                    <div key={method.id} className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <CreditCardIcon className="w-8 h-8 text-cyan-400"/>
                            <div>
                                <p className="font-semibold capitalize">{method.type}</p>
                                <p className="text-gray-400">**** **** **** {method.last4}</p>
                            </div>
                        </div>
                        <button onClick={() => handleRemoveMethod(method.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full">
                            <TrashIcon className="w-6 h-6" />
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 py-10">
                    <CreditCardIcon className="w-12 h-12 mx-auto mb-2"/>
                    <p>No payment methods saved.</p>
                </div>
            )}
        </div>
        <button
            onClick={handleAddMethod}
            className="w-full py-3 mt-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors"
        >
            Add New Card
        </button>
      </main>
    </div>
  );
};

export default PaymentMethodsScreen;