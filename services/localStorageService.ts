import { User, TripRecord, SavedPlace } from '../types';

const USER_KEY = 'swift_user';
const TRIP_HISTORY_KEY = 'swift_trip_history';
const SAVED_PLACES_KEY = 'swift_saved_places';

// --- User Management ---

export const saveUser = (user: User): void => {
    try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Failed to save user to local storage:", error);
    }
};

export const getUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Failed to get user from local storage:", error);
        return null;
    }
};

// --- Trip History Management ---

export const saveTripHistory = (history: TripRecord[]): void => {
    try {
        // We only store the core trip data, not the full temporary driver object.
        const historyToSave = history.map(({ driver, ...trip }) => trip);
        localStorage.setItem(TRIP_HISTORY_KEY, JSON.stringify(historyToSave));
    } catch (error) {
        console.error("Failed to save trip history to local storage:", error);
    }
}

export const getTripHistory = (): TripRecord[] => {
    try {
        const historyJson = localStorage.getItem(TRIP_HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error("Failed to get trip history from local storage:", error);
        return [];
    }
}

// --- Saved Places Management ---

export const saveSavedPlaces = (places: SavedPlace[]): void => {
    try {
        localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(places));
    } catch (error) {
        console.error("Failed to save places to local storage:", error);
    }
};

export const getSavedPlaces = (): SavedPlace[] => {
    try {
        const placesJson = localStorage.getItem(SAVED_PLACES_KEY);
        return placesJson ? JSON.parse(placesJson) : [];
    } catch (error) {
        console.error("Failed to get places from local storage:", error);
        return [];
    }
};


// --- Data Clearing ---

export const clearAllData = (): void => {
    try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TRIP_HISTORY_KEY);
        localStorage.removeItem(SAVED_PLACES_KEY);
    } catch (error) {
        console.error("Failed to clear local storage:", error);
    }
};