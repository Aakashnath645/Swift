import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Page, RideOption, Driver, Location, User, PaymentMethod, AppSettings, TripRecord, Theme, SavedPlace } from './types';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import ActivityScreen from './components/ActivityScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNavBar from './components/BottomNavBar';
import SideNavBar from './components/SideNavBar';
import RideSelectionScreen from './components/RideSelectionScreen';
import TripScreen from './components/TripScreen';
import { rideOptions, mockDrivers, mockUser, initialPaymentMethods, initialAppSettings, TERMS_AND_CONDITIONS, CANCELLATION_POLICY, mockBikeModels } from './constants';
import EditProfileScreen from './components/EditProfileScreen';
import PaymentMethodsScreen from './components/PaymentMethodsScreen';
import SettingsScreen from './components/SettingsScreen';
import HelpScreen from './components/HelpScreen';
import PaymentScreen from './components/PaymentScreen';
import RatingScreen from './components/RatingScreen';
import LegalScreen from './components/LegalScreen';
import SavedPlacesScreen from './components/SavedPlacesScreen';
import AddEditPlaceScreen from './components/AddEditPlaceScreen';
import * as localStorageService from './services/localStorageService';


const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.SPLASH);
  const [page, setPage] = useState<Page>(Page.HOME);
  const [isInitialized, setIsInitialized] = useState(false);

  // App-wide state
  const [user, setUser] = useState<User>(mockUser);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
  const [tripHistory, setTripHistory] = useState<TripRecord[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  
  // Ride flow state
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [completedTrip, setCompletedTrip] = useState<TripRecord | null>(null);
  const [legalContent, setLegalContent] = useState({ title: '', content: '' });
  const [placeToEdit, setPlaceToEdit] = useState<SavedPlace | undefined>(undefined);


  useEffect(() => {
    // This effect ensures the class on the root element matches the theme state.
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const initializeApp = () => {
      const storedUser = localStorageService.getUser();
      if (storedUser) {
        setUser(storedUser);
        setTripHistory(localStorageService.getTripHistory());
        setSavedPlaces(localStorageService.getSavedPlaces());
        setScreen(Screen.HOME);
      } else {
        setScreen(Screen.ONBOARDING);
      }
      setIsInitialized(true);
    };

    if (screen === Screen.SPLASH) {
      const timer = setTimeout(initializeApp, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleThemeToggle = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const handleLogin = useCallback(() => {
    const loggedInUser = { ...mockUser, name: 'Alex Doe' }; // Simulate fetching a real user
    setUser(loggedInUser);
    setSavedPlaces(localStorageService.getSavedPlaces()); // Load places on login
    localStorageService.saveUser(loggedInUser);
    setScreen(Screen.HOME);
    setPage(Page.HOME);
  }, []);
  
  const handleSignUp = useCallback(() => {
    const newUser = { ...mockUser, name: 'New User' }; // Simulate creating a new user
    setUser(newUser);
    localStorageService.saveUser(newUser);
    setScreen(Screen.HOME);
    setPage(Page.HOME);
  }, []);

  const handleNavigateToLogin = useCallback(() => {
    setScreen(Screen.LOGIN);
  }, []);
  
  const handleNavigateToSignUp = useCallback(() => {
    setScreen(Screen.SIGNUP);
  }, []);

  const handleSwitchToSignUp = useCallback(() => {
    setScreen(Screen.SIGNUP);
  }, []);
  
  const handleSwitchToLogin = useCallback(() => {
    setScreen(Screen.LOGIN);
  }, []);

  const handleLogout = useCallback(() => {
    localStorageService.clearAllData();
    setUser(mockUser); // Reset to mock user
    setTripHistory([]);
    setSavedPlaces([]);
    setScreen(Screen.LOGIN);
    setPage(Page.HOME);
    setPickupLocation(null);
    setDropoffLocation(null);
    setSelectedRide(null);
    setDriver(null);
    setFare(null);
    setEta(null);
  }, []);

  const handleProfileUpdate = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorageService.saveUser(updatedUser);
  }, []);

  const handlePaymentMethodsUpdate = useCallback((updatedMethods: PaymentMethod[]) => {
    setPaymentMethods(updatedMethods);
  }, []);

  const handleSettingsUpdate = useCallback((updatedSettings: AppSettings) => {
    setAppSettings(updatedSettings);
  }, []);

  const handleLocationsSet = useCallback((pickup: Location, dropoff: Location) => {
    const finalPickup: Location = {
        ...pickup,
        lat: pickup.lat || 37.7749,
        lng: pickup.lng || -122.4194,
    };
    setPickupLocation(finalPickup);
    setDropoffLocation(dropoff);
    setScreen(Screen.SELECTING_RIDE);
  }, []);

  const handleRideSelected = useCallback((ride: RideOption, calculatedFare: number, tripEta: number) => {
    setSelectedRide(ride);
    setFare(calculatedFare);
    setEta(tripEta);
    setTimeout(() => {
        let selectedDriver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
        
        if (ride.id === 'swiftbike') {
            const randomBike = mockBikeModels[Math.floor(Math.random() * mockBikeModels.length)];
            selectedDriver = {
                ...selectedDriver,
                vehicleModel: randomBike.model,
                licensePlate: randomBike.plate,
            };
        }

        setDriver(selectedDriver);
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
    setEta(null);
    setCompletedTrip(null);
  }, [])

  const handleTripEnd = useCallback(() => {
    if (pickupLocation && dropoffLocation && selectedRide && fare && driver) {
        const newTrip: TripRecord = {
            id: `${new Date().toISOString()}-${Math.random()}`,
            pickup: pickupLocation,
            dropoff: dropoffLocation,
            fare: fare,
            date: new Date().toISOString(),
            rideName: selectedRide.name,
            driver: driver,
        };
        setCompletedTrip(newTrip);
        setScreen(Screen.PAYMENT);
    } else {
        resetRideState();
    }
  }, [resetRideState, pickupLocation, dropoffLocation, selectedRide, fare, driver]);

  const handlePaymentComplete = useCallback(() => {
    setScreen(Screen.RATING);
  }, []);

  const handleRatingSubmit = useCallback((rating: number, feedback: string) => {
    if (completedTrip) {
        // 1. Update Trip History
        const newHistory = [completedTrip, ...tripHistory];
        setTripHistory(newHistory);
        localStorageService.saveTripHistory(newHistory);

        // 2. Update User Stats
        const newTotalRides = user.totalRides + 1;
        let newRating = user.rating;

        if (rating > 0) {
            newRating = ((user.rating * user.totalRides) + rating) / newTotalRides;
        }
        
        const updatedUser: User = {
            ...user,
            totalRides: newTotalRides,
            rating: newRating,
        };

        setUser(updatedUser);
        localStorageService.saveUser(updatedUser);
    }
    resetRideState();
  }, [completedTrip, tripHistory, resetRideState, user]);


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

  const handleNavigateToLegal = useCallback((type: 'terms' | 'cancellation') => {
    if (type === 'terms') {
      setLegalContent({ title: 'Terms & Conditions', content: TERMS_AND_CONDITIONS });
    } else {
      setLegalContent({ title: 'Cancellation Policy', content: CANCELLATION_POLICY });
    }
    setScreen(Screen.LEGAL);
  }, []);

  const handleSavePlace = useCallback((place: SavedPlace) => {
    let updatedPlaces;
    const existingIndex = savedPlaces.findIndex(p => p.id === place.id);

    if (existingIndex > -1) {
      updatedPlaces = [...savedPlaces];
      updatedPlaces[existingIndex] = place;
    } else {
      updatedPlaces = [...savedPlaces, place];
    }

    setSavedPlaces(updatedPlaces);
    localStorageService.saveSavedPlaces(updatedPlaces);
    setScreen(Screen.SAVED_PLACES);
  }, [savedPlaces]);

  const handleDeletePlace = useCallback((placeId: string) => {
    const updatedPlaces = savedPlaces.filter(p => p.id !== placeId);
    setSavedPlaces(updatedPlaces);
    localStorageService.saveSavedPlaces(updatedPlaces);
  }, [savedPlaces]);
  
  const handleEditPlace = useCallback((place: SavedPlace) => {
    setPlaceToEdit(place);
    setScreen(Screen.ADD_EDIT_PLACE);
  }, []);
  
  const handleAddNewPlace = useCallback(() => {
    setPlaceToEdit(undefined);
    setScreen(Screen.ADD_EDIT_PLACE);
  }, []);

  const renderMainPage = () => {
    return (
        <div className="page-container flex-1">
            <div className="page" style={{ transform: page === Page.HOME ? 'translateX(0)' : (page > Page.HOME ? 'translateX(-100%)' : 'translateX(100%)') }}>
                <HomeScreen 
                  user={user} 
                  savedPlaces={savedPlaces}
                  onLocationsSet={handleLocationsSet}
                />
            </div>
             <div className="page" style={{ transform: page === Page.ACTIVITY ? 'translateX(0)' : (page > Page.ACTIVITY ? 'translateX(-100%)' : 'translateX(100%)') }}>
                 <ActivityScreen tripHistory={tripHistory} />
            </div>
             <div className="page" style={{ transform: page === Page.PROFILE ? 'translateX(0)' : 'translateX(100%)' }}>
                 <ProfileScreen 
                    user={user}
                    onLogout={handleLogout} 
                    onNavigateToEditProfile={() => handleNavigateTo(Screen.EDIT_PROFILE)}
                    onNavigateToPayments={() => handleNavigateTo(Screen.PAYMENT_METHODS)}
                    onNavigateToSettings={() => handleNavigateTo(Screen.SETTINGS)}
                    onNavigateToHelp={() => handleNavigateTo(Screen.HELP)}
                    onNavigateToSavedPlaces={() => handleNavigateTo(Screen.SAVED_PLACES)}
                />
            </div>
        </div>
    );
  }

  const renderScreen = () => {
    if (!isInitialized) {
        return <SplashScreen />;
    }

    switch (screen) {
      case Screen.SPLASH:
        return <SplashScreen />;
      case Screen.ONBOARDING:
        return <OnboardingScreen onNavigateToLogin={handleNavigateToLogin} onNavigateToSignUp={handleNavigateToSignUp} />;
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} onSwitchToSignUp={handleSwitchToSignUp} />;
      case Screen.SIGNUP:
        return <SignUpScreen onSignUp={handleSignUp} onSwitchToLogin={handleSwitchToLogin} />;
      case Screen.HOME:
        const showHeader = page === Page.ACTIVITY || page === Page.PROFILE;
        const pageTitles: { [key in Page]?: string } = {
            [Page.ACTIVITY]: 'Ride History',
            [Page.PROFILE]: 'Profile'
        };

        return (
            <div className="flex-1 flex flex-col overflow-hidden relative">
                 {showHeader && (
                    <header className="absolute top-0 left-0 right-0 z-20 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm lg:relative lg:bg-transparent dark:lg:bg-transparent lg:backdrop-blur-none lg:border-b lg:border-gray-200 dark:lg:border-gray-700 lg:p-6">
                        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white text-center lg:text-left">{pageTitles[page]}</h1>
                    </header>
                )}
                {renderMainPage()}
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
        if (driver && selectedRide && pickupLocation && dropoffLocation && fare && eta) {
            return <TripScreen 
                driver={driver} 
                ride={selectedRide}
                pickup={pickupLocation}
                dropoff={dropoffLocation}
                fare={fare}
                eta={eta}
                onTripEnd={handleTripEnd}
                onTripCancel={handleTripCancel}
            />;
        }
        return <SplashScreen />; // Fallback
      case Screen.PAYMENT:
        if (completedTrip) {
            return <PaymentScreen trip={completedTrip} onPaymentComplete={handlePaymentComplete} />;
        }
        return <SplashScreen />;
      case Screen.RATING:
        if (completedTrip?.driver) {
            return <RatingScreen driver={completedTrip.driver} onSubmitRating={handleRatingSubmit} />;
        }
        return <SplashScreen />;
      case Screen.EDIT_PROFILE:
        return <EditProfileScreen user={user} onSave={handleProfileUpdate} onBack={handleReturnToProfile} />;
      case Screen.PAYMENT_METHODS:
        return <PaymentMethodsScreen paymentMethods={paymentMethods} onUpdate={handlePaymentMethodsUpdate} onBack={handleReturnToProfile} />;
      case Screen.SETTINGS:
        return <SettingsScreen settings={appSettings} onUpdate={handleSettingsUpdate} onBack={handleReturnToProfile} theme={theme} onThemeToggle={handleThemeToggle} onNavigateToLegal={handleNavigateToLegal} />;
      case Screen.HELP:
        return <HelpScreen onBack={handleReturnToProfile} />;
      case Screen.LEGAL:
        return <LegalScreen title={legalContent.title} content={legalContent.content} onBack={() => handleNavigateTo(Screen.SETTINGS)} />;
      case Screen.SAVED_PLACES:
        return <SavedPlacesScreen savedPlaces={savedPlaces} onAdd={handleAddNewPlace} onEdit={handleEditPlace} onDelete={handleDeletePlace} onBack={handleReturnToProfile} />;
      case Screen.ADD_EDIT_PLACE:
        return <AddEditPlaceScreen placeToEdit={placeToEdit} onSave={handleSavePlace} onBack={() => handleNavigateTo(Screen.SAVED_PLACES)} userLocation={pickupLocation || { lat: 37.7749, lng: -122.4194 }} />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-0 lg:p-4">
      <div className="w-full h-screen lg:h-[calc(100vh-2rem)] max-w-7xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans lg:rounded-2xl shadow-xl flex overflow-hidden">
        {screen === Screen.HOME && <SideNavBar activePage={page} onNavigate={setPage} />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;