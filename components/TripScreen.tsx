import React, { useState, useEffect, useRef } from 'react';
import type { Driver, RideOption, Location, ChatMessage } from '../types';
import { StarIcon, PhoneIcon, MessageIcon, PhoneAcceptIcon, PhoneEndIcon, SendIcon } from './icons';
import AnimatedMapPlaceholder from './AnimatedMapPlaceholder';
import { formatCurrency } from '../utils/formatting';
import { getDriverResponse } from '../services/geminiService';

interface TripScreenProps {
  driver: Driver;
  ride: RideOption;
  pickup: Location;
  dropoff: Location;
  fare: number;
  eta: number; // Overall trip ETA from Gemini
  onTripEnd: () => void;
  onTripCancel: () => void;
}

const TripScreen: React.FC<TripScreenProps> = ({ driver, ride, pickup, dropoff, fare, eta: tripEta, onTripEnd, onTripCancel }) => {
  const [arrivalEta, setArrivalEta] = useState(Math.min(5, tripEta)); // Driver arrival ETA is max 5 mins
  const [tripStatus, setTripStatus] = useState(`Driver arriving in ${arrivalEta} min`);
  const [inProgress, setInProgress] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Phone call simulation state
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'active'>('idle');
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Random driver cancellation event
    const cancellationTimeout = setTimeout(() => {
      // 20% chance of cancellation
      if (Math.random() < 0.2) {
        alert(`${driver.name} had to cancel the trip due to an unexpected issue. We're sorry for the inconvenience.`);
        onTripCancel();
      }
    }, Math.random() * 8000 + 5000); // Randomly between 5 and 13 seconds

    return () => clearTimeout(cancellationTimeout);
  }, [driver.name, onTripCancel]);

  useEffect(() => {
    let currentEta = arrivalEta;
    setInProgress(false);

    const etaTimer = setInterval(() => {
        if (currentEta > 1) {
            currentEta--;
            setArrivalEta(currentEta);
            setTripStatus(`Driver arriving in ${currentEta} min`);
        } else {
            setArrivalEta(0);
            setTripStatus('Driver is arriving now');
            clearInterval(etaTimer);

            // Transition to main trip
            setTimeout(() => {
                setInProgress(true);
                let tripTimeRemaining = tripEta;
                setTripStatus(`On trip to ${dropoff.address.split(',')[0]} (~${tripTimeRemaining} min)`);

                const mainTripTimer = setInterval(() => {
                    if (tripTimeRemaining > 1) {
                        tripTimeRemaining--;
                        setTripStatus(`On trip to ${dropoff.address.split(',')[0]} (~${tripTimeRemaining} min)`);
                    } else {
                        clearInterval(mainTripTimer);
                        setTripStatus('You have arrived!');
                        setTimeout(onTripEnd, 2000);
                    }
                }, 3000); // Speed up simulation time
            }, 2000);
        }
    }, 1500); // Speed up simulation time

    return () => clearInterval(etaTimer);
  }, [tripEta, dropoff.address, onTripEnd]);

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    onTripCancel();
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSending) return;
    
    const newUserMessage: ChatMessage = { sender: 'user', text: userMessage, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsSending(true);

    const driverResponseText = await getDriverResponse(userMessage, driver.name, chatMessages);

    const newDriverMessage: ChatMessage = { sender: 'driver', text: driverResponseText, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, newDriverMessage]);
    setIsSending(false);
  };
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        <div className="h-2/5">
             <AnimatedMapPlaceholder 
                status="trip" 
                eta={inProgress ? undefined : arrivalEta} 
                destination={dropoff.address}
             />
        </div>
        <div className="flex-1 p-4 -mt-16 rounded-t-3xl bg-white dark:bg-gray-900 flex flex-col justify-between">
            <div>
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">{tripStatus}</h2>
                    {!inProgress && <p className="text-gray-500 dark:text-gray-400">Pickup at {pickup.address}</p>}
                </div>

                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full"/>
                            <div>
                                <h3 className="text-lg font-bold">{driver.name}</h3>
                                <div className="flex items-center text-sm text-amber-500 dark:text-amber-400">
                                    {driver.rating} <StarIcon className="w-4 h-4 ml-1"/>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{driver.totalTrips} trips</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-lg">{driver.licensePlate}</div>
                           <p className="text-sm text-gray-500 dark:text-gray-400">{driver.vehicleModel}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">Member since {driver.memberSince}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">{ride.name}</span>
                        <span className="font-bold text-lg text-black dark:text-white">{formatCurrency(fare)}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
                <button 
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 py-3 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800/50 dark:text-red-300 dark:hover:bg-red-800/80 rounded-lg font-semibold transition-colors"
                >
                    Cancel Trip
                </button>
                <button onClick={() => setIsChatOpen(true)} className="p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <MessageIcon className="w-6 h-6"/>
                </button>
                <button onClick={() => setCallState('ringing')} className="p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <PhoneIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>

        {/* Modals */}
        {showCancelModal && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center space-y-4">
                    <h3 className="text-lg font-bold">Are you sure?</h3>
                    <p className="text-gray-600 dark:text-gray-400">A cancellation fee may apply if your driver is already on the way.</p>
                    <div className="flex space-x-4">
                        <button onClick={handleCancelConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white">Yes, Cancel</button>
                        <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg font-semibold">Go Back</button>
                    </div>
                </div>
            </div>
        )}
        
        {/* Phone Call Simulation */}
        {callState === 'ringing' && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-between p-8 z-50 animate-fadeIn">
                <div className="text-center">
                    <img src={driver.avatarUrl} alt={driver.name} className="w-24 h-24 rounded-full mx-auto border-4 border-gray-300 dark:border-gray-600"/>
                    <h2 className="text-3xl font-bold mt-4">{driver.name}</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">Incoming Call...</p>
                </div>
                <div className="flex justify-around w-full">
                    <button onClick={() => setCallState('idle')} className="flex flex-col items-center space-y-2 text-red-500 dark:text-red-400">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"><PhoneEndIcon className="w-8 h-8 text-white"/></div>
                        <span>Decline</span>
                    </button>
                    <button onClick={() => setCallState('active')} className="flex flex-col items-center space-y-2 text-green-500 dark:text-green-400">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"><PhoneAcceptIcon className="w-8 h-8 text-white"/></div>
                        <span>Accept</span>
                    </button>
                </div>
            </div>
        )}
        {callState === 'active' && (
             <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-between p-8 z-50 animate-fadeIn">
                <div className="text-center">
                    <img src={driver.avatarUrl} alt={driver.name} className="w-24 h-24 rounded-full mx-auto border-4 border-cyan-500 dark:border-cyan-400"/>
                    <h2 className="text-3xl font-bold mt-4">{driver.name}</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 animate-pulse">00:03</p>
                </div>
                <button onClick={() => setCallState('idle')} className="flex flex-col items-center space-y-2 text-red-500 dark:text-red-400">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"><PhoneEndIcon className="w-8 h-8 text-white"/></div>
                    <span>End Call</span>
                </button>
            </div>
        )}

        {/* Gemini Chat */}
        {isChatOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-end justify-center z-50 animate-fadeIn">
                <div className="bg-white dark:bg-gray-800 rounded-t-lg w-full max-w-md h-[70%] flex flex-col">
                    <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Chat with {driver.name}</h3>
                        <button onClick={() => setIsChatOpen(false)} className="font-bold">Close</button>
                    </header>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {chatMessages.map((msg, index) => (
                             <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                     <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                        <input 
                          type="text"
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"
                        />
                        <button onClick={handleSendMessage} disabled={isSending} className="p-3 bg-cyan-600 rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-500">
                            {isSending ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"/> : <SendIcon className="w-5 h-5 text-white"/>}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default TripScreen;