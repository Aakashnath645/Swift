import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Page, RideOption, Driver, Location } from './types';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import ActivityScreen from './components/ActivityScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNavBar from './components/BottomNavBar';
import RideSelectionScreen from './components/RideSelectionScreen';
import TripScreen from './components/TripScreen';
import { rideOptions, mockDriver } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.SPLASH);
  const [page, setPage] = useState<Page>(Page.HOME);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);

  useEffect(() => {
    if (screen === Screen.SPLASH) {
      const timer = setTimeout(() => setScreen(Screen.LOGIN), 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleLogin = useCallback(() => {
    setScreen(Screen.HOME);
    setPage(Page.HOME);
  }, []);
  
  const handleSignUp = useCallback(() => {
    setScreen(Screen.HOME);
    setPage(Page.HOME);
  }, []);

  const handleSwitchToSignUp = useCallback(() => {
    setScreen(Screen.SIGNUP);
  }, []);
  
  const handleSwitchToLogin = useCallback(() => {
    setScreen(Screen.LOGIN);
  }, []);

  const handleLogout = useCallback(() => {
    setScreen(Screen.LOGIN);
    setPage(Page.HOME);
    setPickupLocation(null);
    setDropoffLocation(null);
    setSelectedRide(null);
    setDriver(null);
  }, []);


  const handleLocationsSet = useCallback((pickup: Location, dropoff: Location) => {
    setPickupLocation(pickup);
    setDropoffLocation(dropoff);
    setScreen(Screen.SELECTING_RIDE);
  }, []);

  const handleRideSelected = useCallback((ride: RideOption) => {
    setSelectedRide(ride);
    setTimeout(() => {
        setDriver(mockDriver);
        setScreen(Screen.ON_TRIP);
    }, 3000);
  }, []);
  
  const handleTripEnd = useCallback(() => {
      setScreen(Screen.HOME);
      setPage(Page.HOME);
      setPickupLocation(null);
      setDropoffLocation(null);
      setSelectedRide(null);
      setDriver(null);
  }, []);
  
  const handleCancelSearch = useCallback(() => {
    setScreen(Screen.HOME);
    setPage(Page.HOME);
    setPickupLocation(null);
    setDropoffLocation(null);
  }, []);

  const renderMainPage = () => {
    switch (page) {
        case Page.HOME:
            return <HomeScreen onLocationsSet={handleLocationsSet} />;
        case Page.ACTIVITY:
            return <ActivityScreen />;
        case Page.PROFILE:
            return <ProfileScreen onLogout={handleLogout} />;
        default:
            return <HomeScreen onLocationsSet={handleLocationsSet} />;
    }
  }


  const renderScreen = () => {
    switch (screen) {
      case Screen.SPLASH:
        return <SplashScreen />;
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} onSwitchToSignUp={handleSwitchToSignUp} />;
      case Screen.SIGNUP:
        return <SignUpScreen onSignUp={handleSignUp} onSwitchToLogin={handleSwitchToLogin} />;
      case Screen.HOME:
        return (
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto">{renderMainPage()}</main>
                <BottomNavBar activePage={page} onNavigate={setPage} />
            </div>
        );
      case Screen.SELECTING_RIDE:
        if (pickupLocation && dropoffLocation) {
            return <RideSelectionScreen 
                pickup={pickupLocation}
                dropoff={dropoffLocation}
                rideOptions={rideOptions}
                onRideSelected={handleRideSelected} 
                onCancel={handleCancelSearch}
            />;
        }
        return <SplashScreen />; // Fallback
      case Screen.ON_TRIP:
        if (driver && selectedRide && pickupLocation && dropoffLocation) {
            return <TripScreen 
                driver={driver} 
                ride={selectedRide}
                pickup={pickupLocation}
                dropoff={dropoffLocation}
                onTripEnd={handleTripEnd}
            />;
        }
        return <SplashScreen />; // Fallback
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-md mx-auto h-screen flex flex-col">
          {renderScreen()}
      </div>
    </div>
  );
};

export default App;