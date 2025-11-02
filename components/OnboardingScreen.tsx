import React, { useState } from 'react';
import { OnboardingRequestIcon, OnboardingChooseIcon, OnboardingTrackIcon } from './icons';

interface OnboardingScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

const onboardingSteps = [
  {
    icon: <OnboardingRequestIcon className="w-full h-48 text-gray-800 dark:text-white" />,
    title: "Request a ride with ease",
    description: "Tap a button, get a ride from a nearby friendly driver, and enjoy a comfortable trip.",
  },
  {
    icon: <OnboardingChooseIcon className="w-full h-48 text-gray-800 dark:text-white" />,
    title: "Choose your ideal ride",
    description: "From affordable everyday options to spacious cars for groups, find the perfect ride for any occasion.",
  },
  {
    icon: <OnboardingTrackIcon className="w-full h-48 text-gray-800 dark:text-white" />,
    title: "Track your journey live",
    description: "Watch your driver's progress in real-time and share your trip status with friends and family.",
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onNavigateToLogin, onNavigateToSignUp }) => {
  const [step, setStep] = useState(0);
  const isLastStep = step === onboardingSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white dark:bg-gray-900 animate-fadeIn">
      <div className="h-10 text-right">
        {!isLastStep && (
          <button
            onClick={() => setStep(onboardingSteps.length - 1)}
            className="font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center relative overflow-hidden -mt-10">
        {onboardingSteps.map((item, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-all duration-500 ease-in-out"
            style={{
              transform: `translateX(${(index - step) * 100}%)`,
              opacity: index === step ? 1 : 0,
            }}
          >
            <div className="h-full flex flex-col items-center justify-center text-center">
              {item.icon}
              <h1 className="text-3xl font-bold mt-8 tracking-tight">{item.title}</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-xs mx-auto">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-40 flex flex-col justify-end">
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              onClick={() => setStep(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                index === step ? 'bg-cyan-500 w-6' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="w-full max-w-sm mx-auto">
          {isLastStep ? (
            <div className="space-y-3">
              <button
                onClick={onNavigateToSignUp}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold text-white transition-colors shadow-lg"
              >
                Create an Account
              </button>
              <button
                onClick={onNavigateToLogin}
                className="w-full py-3 bg-transparent font-semibold text-black dark:text-white"
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold text-white transition-colors shadow-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;