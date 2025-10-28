import React, { useState, useEffect } from 'react';
import { Logo, CarIcon, LocationMarkerIcon } from './icons';

interface AnimatedMapPlaceholderProps {
  status: 'idle' | 'trip';
  eta?: number;
  destination?: string;
}

const catchphrases = [
  "Your ride, your way.",
  "Swiftly there.",
  "Tap. Ride. Arrive.",
  "Your city, unlocked."
];

const AnimatedMapPlaceholder: React.FC<AnimatedMapPlaceholderProps> = ({ status, eta, destination }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (status === 'idle') {
      const interval = setInterval(() => {
        setPhraseIndex(prevIndex => (prevIndex + 1) % catchphrases.length);
      }, 4000); // 4 seconds to match animation
      return () => clearInterval(interval);
    }
  }, [status]);


  if (status === 'trip') {
    return (
      <div className="h-full bg-gray-800 flex flex-col items-center justify-center text-gray-400 font-mono p-4 overflow-hidden">
        <div className="w-full max-w-sm text-center">
            <div className="flex items-center justify-between text-lg mb-2">
                <CarIcon className="w-8 h-8 text-cyan-400" />
                <div className="flex-1 h-0.5 bg-gray-600 mx-4 relative overflow-hidden">
                    <div className="absolute h-full bg-cyan-400 w-1/2 animate-dash"></div>
                </div>
                <LocationMarkerIcon className="w-8 h-8 text-purple-400" />
            </div>
            {eta !== undefined && eta > 0 && (
                 <p className="text-xl animate-pulse">Arriving in {eta} min...</p>
            )}
             {eta === 0 && (
                 <p className="text-xl animate-pulse">En route to destination</p>
            )}
        </div>
         <style>{`
            @keyframes dash {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
            .animate-dash {
              animation: dash 2s linear infinite;
            }
         `}</style>
      </div>
    )
  }

  // Idle status
  return (
    <div className="h-full bg-gray-800 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #4A5568 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="relative z-10 text-center">
        <div className="animate-subtle-float">
          <Logo className="w-24 h-24 text-cyan-500 opacity-50 mx-auto" />
        </div>
        <p key={phraseIndex} className="text-white/60 text-lg mt-6 animate-fade-in-out">
          {catchphrases[phraseIndex]}
        </p>
      </div>
      <style>{`
        @keyframes subtle-float { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        } 
        .animate-subtle-float { 
          animation: subtle-float 6s ease-in-out infinite; 
        }
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px); }
          25% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnimatedMapPlaceholder;