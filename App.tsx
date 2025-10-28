import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Page, RideOption, Driver, Location, User, PaymentMethod, AppSettings, TripRecord } from './types';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import ActivityScreen from './components/ActivityScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNavBar from './components/BottomNavBar';
import RideSelectionScreen from './components/RideSelectionScreen';
import TripScreen from './components/TripScreen';
import { rideOptions, mockDriver, mockUser, initialPaymentMethods, initialAppSettings } from './constants';
import EditProfileScreen from './components/EditProfileScreen';
import PaymentMethodsScreen from './components/PaymentMethodsScreen';
import SettingsScreen from './components/SettingsScreen';
import HelpScreen from './components/HelpScreen';
import SetLocationScreen from './components/SetLocationScreen';


const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.SPLASH);
  const [page, setPage] = useState<Page>(Page.HOME);
  
  // App-wide state
  const [user, setUser] = useState<User>(mockUser);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
  const [tripHistory, setTripHistory] = useState<TripRecord[]>([]);
  
  // Ride flow state
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [fare, setFare] = useState<number | null>(null);

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
    setFare(null);
    setUser(mockUser); // Reset user
    setTripHistory([]); // Clear ride history on logout
  }, []);

  const handleProfileUpdate = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const handlePaymentMethodsUpdate = useCallback((updatedMethods: PaymentMethod[]) => {
    setPaymentMethods(updatedMethods);
  }, []);

  const handleSettingsUpdate = useCallback((updatedSettings: AppSettings) => {
    setAppSettings(updatedSettings);
  }, []);

  const handleNavigateToSetLocation = useCallback(() => {
    setScreen(Screen.SETTING_LOCATION);
  }, []);

  const handleLocationsSet = useCallback((pickup: Location, dropoff: Location) => {
    setPickupLocation(pickup);
    setDropoffLocation(dropoff);
    setScreen(Screen.SELECTING_RIDE);
  }, []);

  const handleRideSelected = useCallback((ride: RideOption, calculatedFare: number) => {
    setSelectedRide(ride);
    setFare(calculatedFare);
    setTimeout(() => {
        setDriver(mockDriver);
        setScreen(Screen.ON_TRIP);
    }, 3000);
  }, []);
  
  const resetRideState = useCallback(() => {
    setScreen(Screen.HOME);
    setPage(Page.HOME);
    setPickupLocation(null);
    setDropoffLocation(null);
    setSelectedRide(null);
    setDriver(null);
    setFare(null);
  }, [])

  const handleTripEnd = useCallback(() => {
    if (pickupLocation && dropoffLocation && selectedRide && fare) {
        const newTrip: TripRecord = {
            id: `${new Date().toISOString()}-${Math.random()}`, // Ensure unique ID
            pickup: pickupLocation,
            dropoff: dropoffLocation,
            fare: fare,
            date: new Date().toISOString(),
            rideName: selectedRide.name,
        };
        setTripHistory(prevHistory => [newTrip, ...prevHistory]);
    }
    resetRideState();
  }, [resetRideState, pickupLocation, dropoffLocation, selectedRide, fare]);

  const handleTripCancel = useCallback(() => {
    resetRideState();
  }, [resetRideState]);
  
  const handleCancelSearch = useCallback(() => {
    setScreen(Screen.HOME);
    setPage(Page.HOME);
    setPickupLocation(null);
    setDropoffLocation(null);
  }, []);
  
  const handleReturnToProfile = useCallback(() => {
    setScreen(Screen.HOME);
    setPage(Page.PROFILE);
  }, []);
  
  const handleNavigateTo = useCallback((newScreen: Screen) => {
      setScreen(newScreen);
  }, []);

  const renderMainPage = () => {
    switch (page) {
        case Page.HOME:
            return <HomeScreen user={user} onNavigateToSetLocation={handleNavigateToSetLocation} />;
        case Page.ACTIVITY:
            return <ActivityScreen tripHistory={tripHistory} />;
        case Page.PROFILE:
            return <ProfileScreen 
                user={user}
                onLogout={handleLogout} 
                onNavigateToEditProfile={() => handleNavigateTo(Screen.EDIT_PROFILE)}
                onNavigateToPayments={() => handleNavigateTo(Screen.PAYMENT_METHODS)}
                onNavigateToSettings={() => handleNavigateTo(Screen.SETTINGS)}
                onNavigateToHelp={() => handleNavigateTo(Screen.HELP)}
            />;
        default:
            return <HomeScreen user={user} onNavigateToSetLocation={handleNavigateToSetLocation} />;
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
      case Screen.SETTING_LOCATION:
        return <SetLocationScreen onLocationsSet={handleLocationsSet} onBack={handleCancelSearch} />;
      case Screen.SELECTING_RIDE:
        if (pickupLocation && dropoffLocation) {
            return <RideSelectionScreen 
                pickup={pickupLocation}
                dropoff={dropoffLocation}
                rideOptions={rideOptions}
                driver={mockDriver}
                onRideSelected={handleRideSelected} 
                onCancel={handleCancelSearch}
            />;
        }
        return <SplashScreen />; // Fallback
      case Screen.ON_TRIP:
        if (driver && selectedRide && pickupLocation && dropoffLocation && fare) {
            return <TripScreen 
                driver={driver} 
                ride={selectedRide}
                pickup={pickupLocation}
                dropoff={dropoffLocation}
                fare={fare}
                onTripEnd={handleTripEnd}
                onTripCancel={handleTripCancel}
            />;
        }
        return <SplashScreen />; // Fallback
      case Screen.EDIT_PROFILE:
        return <EditProfileScreen user={user} onSave={handleProfileUpdate} onBack={handleReturnToProfile} />;
      case Screen.PAYMENT_METHODS:
        return <PaymentMethodsScreen paymentMethods={paymentMethods} onUpdate={handlePaymentMethodsUpdate} onBack={handleReturnToProfile} />;
      case Screen.SETTINGS:
        return <SettingsScreen settings={appSettings} onUpdate={handleSettingsUpdate} onBack={handleReturnToProfile} />;
      case Screen.HELP:
        return <HelpScreen onBack={handleReturnToProfile} />;
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