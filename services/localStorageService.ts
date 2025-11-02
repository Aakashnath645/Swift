import { User, TripRecord } from '../types';

const USER_KEY = 'swift_user';
const TRIP_HISTORY_KEY = 'swift_trip_history';

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

// --- Data Clearing ---

export const clearAllData = (): void => {
    try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TRIP_HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear local storage:", error);
    }
};
