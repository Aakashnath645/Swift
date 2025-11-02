import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Driver, RideOption, Location, ChatMessage, LatLng, TripPhase } from '../types';
import { StarIcon, PhoneIcon, MessageIcon, PhoneAcceptIcon, PhoneEndIcon, SendIcon } from './icons';
import MockMap from './MockMap';
import { formatCurrency } from '../utils/formatting';
import { getDriverResponse } from '../services/geminiService';
import TripProgressIndicator from './TripProgressIndicator';

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

// --- Mock Map Utilities ---
const generateGridRoute = (start: LatLng, end: LatLng): LatLng[] => {
    const path: LatLng[] = [start];
    let current = { ...start };
    const dx = end.lng - start.lng;
    const dy = end.lat - start.lat;
    const goHorizontalFirst = Math.random() > 0.5;
    if (goHorizontalFirst) {
        if (Math.abs(dx) > 0.0001) { current.lng = end.lng; path.push({ ...current }); }
        if (Math.abs(dy) > 0.0001) { current.lat = end.lat; path.push({ ...current }); }
    } else {
        if (Math.abs(dy) > 0.0001) { current.lat = end.lat; path.push({ ...current }); }
        if (Math.abs(dx) > 0.0001) { current.lng = end.lng; path.push({ ...current }); }
    }
    const detailedPath: LatLng[] = [];
    for (let i = 0; i < path.length - 1; i++) {
        detailedPath.push(path[i]);
        const p1 = path[i];
        const p2 = path[i + 1];
        const segDx = p2.lng - p1.lng;
        const segDy = p2.lat - p1.lat;
        const dist = Math.sqrt(segDx * segDx + segDy * segDy);
        if (dist > 0.01) {
            const numMidpoints = 4;
            for (let j = 1; j <= numMidpoints; j++) {
                const progress = j / (numMidpoints + 1);
                let midLat = p1.lat + segDy * progress;
                let midLng = p1.lng + segDx * progress;
                const sway = (Math.random() - 0.5) * dist * 0.05;
                if (Math.abs(segDy) < 0.0001) midLat += sway;
                else midLng += sway;
                detailedPath.push({ lat: midLat, lng: midLng });
            }
        }
    }
    detailedPath.push(path[path.length - 1]);
    return detailedPath;
};

const interpolate = (p1: LatLng, p2: LatLng, fraction: number): LatLng => ({
  lat: p1.lat + (p2.lat - p1.lat) * fraction,
  lng: p1.lng + (p2.lng - p1.lng) * fraction,
});

const haversineDistance = (p1: LatLng, p2: LatLng): number => {
  const R = 6371;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const getPointAlongPath = (path: LatLng[], fraction: number): LatLng | null => {
    if (path.length < 2) return path[0] || null;
    const totalDistance = path.reduce((acc, point, i) => i === 0 ? 0 : acc + haversineDistance(path[i-1], point), 0);
    if (totalDistance === 0) return path[0];
    const targetDistance = fraction * totalDistance;
    let accumulatedDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const segmentStart = path[i];
        const segmentEnd = path[i+1];
        const segmentDistance = haversineDistance(segmentStart, segmentEnd);
        if (accumulatedDistance + segmentDistance >= targetDistance) {
            if (segmentDistance === 0) return segmentStart;
            const fractionOfSegment = (targetDistance - accumulatedDistance) / segmentDistance;
            return interpolate(segmentStart, segmentEnd, fractionOfSegment);
        }
        accumulatedDistance += segmentDistance;
    }
    return path[path.length - 1];
};

const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;


const TripScreen: React.FC<TripScreenProps> = ({ driver, ride, pickup, dropoff, fare, eta: tripEta, onTripEnd, onTripCancel }) => {
  const [tripStatus, setTripStatus] = useState(`Finding the best route...`);
  const [tripPhase, setTripPhase] = useState<TripPhase>('ARRIVING');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [routePath, setRoutePath] = useState<LatLng[]>([]);
  const [carLocation, setCarLocation] = useState<LatLng | null>(null);
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'active'>('idle');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Split View Panel State & Logic ---
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const dragState = useRef({ isDragging: false, startY: 0, endY: 0 });
  
  const COLLAPSED_HEIGHT = 90;
  const EXPANDED_HEIGHT = 480;
  const panelHeight = isPanelExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleTogglePanel = useCallback(() => {
    setIsPanelExpanded(prev => !prev);
  }, []);
  
  const handleDragEnd = useCallback(() => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;

    const deltaY = dragState.current.startY - dragState.current.endY; // Positive is drag up
    
    if (Math.abs(deltaY) > 50) { // Drag threshold
        setIsPanelExpanded(deltaY > 0); // Expand if dragged up
    }
    
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('touchmove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchend', handleDragEnd);
  }, []);
  
  const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!dragState.current.isDragging) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragState.current.endY = y;
  }, []);

  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (isDesktop) return; // Disable on desktop
    dragState.current.isDragging = true;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragState.current.startY = y;
    dragState.current.endY = y;

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
  }, [isDesktop, handleDragMove, handleDragEnd]);


  const driverInitialLocation = useMemo(() => ({
    lat: pickup.lat + (Math.random() - 0.5) * 0.008,
    lng: pickup.lng + (Math.random() - 0.5) * 0.008,
  }), [pickup.lat, pickup.lng]);

  useEffect(() => {
    const pickupCoords = { lat: pickup.lat, lng: pickup.lng };
    const dropoffCoords = { lat: dropoff.lat, lng: dropoff.lng };
    const arrivalPath = generateGridRoute(driverInitialLocation, pickupCoords);
    const mainTripPath = generateGridRoute(pickupCoords, dropoffCoords);
    setRoutePath(mainTripPath);
    setCarLocation(driverInitialLocation);

    const arrivalDuration = Math.min(5, tripEta) * 1000 * 1.5;
    const tripDuration = tripEta * 1000 * 1.5;
    let startTime = Date.now();
    let frameId: number;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      if (elapsed < arrivalDuration) {
          setTripPhase('ARRIVING');
          const easedProgress = easeInOutCubic(elapsed / arrivalDuration);
          setCarLocation(getPointAlongPath(arrivalPath, easedProgress));
          const eta = Math.ceil((arrivalDuration - elapsed) / 1000 / 1.5);
          setTripStatus(`Driver arriving in ~${eta} min`);
      } else if (elapsed < arrivalDuration + tripDuration) {
          setTripPhase('EN_ROUTE');
          const easedProgress = easeInOutCubic((elapsed - arrivalDuration) / tripDuration);
          setCarLocation(getPointAlongPath(mainTripPath, easedProgress));
          const eta = Math.ceil((arrivalDuration + tripDuration - elapsed) / 1000 / 1.5);
          setTripStatus(`On trip to ${dropoff.address.split(',')[0]} (~${eta} min)`);
      } else {
          setTripPhase('ARRIVED');
          setTripStatus('You have arrived!');
          setCarLocation(dropoffCoords);
          cancelAnimationFrame(frameId);
          setTimeout(onTripEnd, 2000);
          return;
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [pickup, dropoff, tripEta, onTripEnd, driverInitialLocation]);

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
    <div className="flex-1 flex flex-col lg:flex-row bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="flex-1 lg:w-3/5 min-h-0">
             <MockMap 
                pickup={{ lat: pickup.lat, lng: pickup.lng }}
                dropoff={{ lat: dropoff.lat, lng: dropoff.lng }}
                carLocation={carLocation}
                routePath={routePath}
             />
        </div>
        
        <div 
            style={{ height: isDesktop ? 'auto' : `${panelHeight}px` }}
            className={`bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl-top-light dark:shadow-2xl-top-dark z-10 lg:w-2/5 lg:h-auto lg:rounded-none lg:shadow-none lg:border-l lg:border-gray-200 dark:lg:border-gray-700 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}
        >
            <div
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={handleTogglePanel}
                className="lg:hidden w-full py-3 flex-shrink-0 flex justify-center items-center cursor-grab active:cursor-grabbing"
            >
                <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            { !isPanelExpanded && !isDesktop ? (
                <div className="flex items-center justify-between px-4 pb-3 flex-1">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <img src={driver.avatarUrl} alt={driver.name} className="w-12 h-12 rounded-full flex-shrink-0"/>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-black dark:text-white truncate">{driver.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{tripStatus}</p>
                        </div>
                    </div>
                     <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-mono font-bold text-black dark:text-white bg-amber-300 dark:bg-amber-400 dark:text-black px-2 py-0.5 rounded text-sm">{driver.licensePlate}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{driver.vehicleModel}</p>
                     </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 px-4 pt-0 lg:pt-4 overflow-y-auto">
                        <div className="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full"/>
                            <div>
                                <h3 className="text-xl font-bold">{driver.name}</h3>
                                <div className="flex items-center text-sm text-amber-500 dark:text-amber-400">
                                    {driver.rating} <StarIcon className="w-4 h-4 ml-1"/>
                                </div>
                            </div>
                            <div className="flex-grow" />
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setIsChatOpen(true)} className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <MessageIcon className="w-6 h-6"/>
                                </button>
                                <button onClick={() => setCallState('ringing')} className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <PhoneIcon className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>
                        
                        <div className="my-4">
                             <div className="text-center mb-2">
                                <h2 className="text-lg font-bold">{tripStatus}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {tripPhase === 'ARRIVING' ? `Pickup: ${pickup.address.split(',')[0]}` : `Destination: ${dropoff.address.split(',')[0]}`}
                                </p>
                            </div>
                            <TripProgressIndicator phase={tripPhase} />
                        </div>

                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-gray-500 dark:text-gray-400">Ride</span>
                                <span className="font-bold text-black dark:text-white">{ride.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-gray-500 dark:text-gray-400">Vehicle</span>
                                <span className="font-bold text-black dark:text-white">{driver.vehicleModel}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-gray-500 dark:text-gray-400">License Plate</span>
                                <span className="font-mono font-bold text-black dark:text-white bg-amber-300 dark:bg-amber-400 dark:text-black px-2 py-0.5 rounded">{driver.licensePlate}</span>
                            </div>
                             <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                                <span className="font-semibold text-gray-500 dark:text-gray-400 text-base">Fare</span>
                                <span className="font-bold text-xl text-black dark:text-white">{formatCurrency(fare)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 px-4 pb-4 flex-shrink-0">
                         <button 
                            onClick={() => setShowCancelModal(true)}
                            className="w-full py-3 bg-gray-200 text-red-600 dark:bg-gray-700 dark:text-red-400 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel Trip
                        </button>
                    </div>
                </>
            )}
        </div>

        {/* Modals and Overlays */}
        {showCancelModal && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center space-y-4">
                    <h3 className="text-lg font-bold">Are you sure?</h3>
                    <p className="text-gray-600 dark:text-gray-400">A cancellation fee may apply.</p>
                    <div className="flex space-x-4">
                        <button onClick={() => { setShowCancelModal(false); onTripCancel(); }} className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white">Yes, Cancel</button>
                        <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg font-semibold">Go Back</button>
                    </div>
                </div>
            </div>
        )}
        
        {callState !== 'idle' && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-between p-8 z-50 animate-fadeIn">
                <div className="text-center">
                    <img src={driver.avatarUrl} alt={driver.name} className={`w-24 h-24 rounded-full mx-auto border-4 ${callState === 'active' ? 'border-cyan-500' : 'border-gray-300'}`}/>
                    <h2 className="text-3xl font-bold mt-4">{driver.name}</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{callState === 'ringing' ? 'Incoming Call...' : '00:03'}</p>
                </div>
                {callState === 'ringing' ? (
                    <div className="flex justify-around w-full">
                        <button onClick={() => setCallState('idle')} className="flex flex-col items-center space-y-2 text-red-500"><div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"><PhoneEndIcon className="w-8 h-8 text-white"/></div><span>Decline</span></button>
                        <button onClick={() => setCallState('active')} className="flex flex-col items-center space-y-2 text-green-500"><div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"><PhoneAcceptIcon className="w-8 h-8 text-white"/></div><span>Accept</span></button>
                    </div>
                ) : (
                     <button onClick={() => setCallState('idle')} className="flex flex-col items-center space-y-2 text-red-500"><div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"><PhoneEndIcon className="w-8 h-8 text-white"/></div><span>End Call</span></button>
                )}
            </div>
        )}

        {isChatOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-end justify-center z-50 animate-fadeIn">
                <div className="bg-white dark:bg-gray-800 rounded-t-lg w-full max-w-md h-[70%] flex flex-col">
                    <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h3 className="font-bold text-lg">Chat with {driver.name}</h3><button onClick={() => setIsChatOpen(false)} className="font-bold">Close</button></header>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {chatMessages.map((msg, index) => (<div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{msg.text}</div></div>))}
                        <div ref={chatEndRef} />
                    </div>
                     <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                        <input type="text" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"/>
                        <button onClick={handleSendMessage} disabled={isSending} className="p-3 bg-cyan-600 rounded-lg disabled:bg-gray-400">{isSending ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"/> : <SendIcon className="w-5 h-5 text-white"/>}</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default TripScreen;