import React from 'react';
import { TripPhase } from '../types';
import { CarIcon, RouteIcon, MapPinIcon, BikeIcon } from './icons';

interface TripProgressIndicatorProps {
  phase: TripPhase;
  isBikeTrip?: boolean;
}

// FIX: The type for the `icon` prop was too generic (`React.ReactElement`), causing TypeScript
// to be unable to verify that `className` is a valid prop for the icon component.
// By specifying `React.ReactElement<React.SVGProps<SVGSVGElement>>`, we provide the necessary
// type information to resolve the error with `React.cloneElement`.
const ProgressStep: React.FC<{ label: string; icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; isActive: boolean; isCompleted: boolean }> = ({ label, icon, isActive, isCompleted }) => {
    const textColor = isActive ? 'text-black dark:text-white' : isCompleted ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500';
    const iconBg = isActive ? 'bg-cyan-500' : isCompleted ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-700';
    const iconColor = isActive || isCompleted ? 'text-white' : 'text-gray-500 dark:text-gray-400';

    return (
        <div className="flex flex-col items-center text-center w-20 transition-colors duration-500">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} transition-colors duration-500 shadow-md`}>
                {React.cloneElement(icon, { className: `w-6 h-6 ${iconColor}` })}
            </div>
            <p className={`mt-2 text-sm font-semibold ${textColor}`}>{label}</p>
        </div>
    );
};

const Connector: React.FC<{ isCompleted: boolean }> = ({ isCompleted }) => {
    return (
        <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 relative mx-1">
            <div
                className="absolute top-0 left-0 h-1 bg-cyan-500 transition-all duration-500 ease-in-out"
                style={{ width: isCompleted ? '100%' : '0%' }}
            />
        </div>
    );
};

const TripProgressIndicator: React.FC<TripProgressIndicatorProps> = ({ phase, isBikeTrip = false }) => {
  const isArriving = phase === 'ARRIVING';
  const isEnRoute = phase === 'EN_ROUTE';
  const isArrived = phase === 'ARRIVED';

  return (
    <div className="w-full flex items-center justify-center my-4 px-2">
        <ProgressStep label="Arriving" icon={isBikeTrip ? <BikeIcon /> : <CarIcon />} isActive={isArriving} isCompleted={isEnRoute || isArrived} />
        <Connector isCompleted={isEnRoute || isArrived} />
        <ProgressStep label="On Trip" icon={<RouteIcon />} isActive={isEnRoute} isCompleted={isArrived} />
        <Connector isCompleted={isArrived} />
        <ProgressStep label="Destination" icon={<MapPinIcon />} isActive={isArrived} isCompleted={isArrived} />
    </div>
  );
};

export default TripProgressIndicator;