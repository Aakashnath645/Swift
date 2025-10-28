import type React from 'react';

export enum Screen {
  SPLASH,
  LOGIN,
  SIGNUP,
  HOME, // Represents the main app view with the navigation bar
  SETTING_LOCATION,
  SELECTING_RIDE,
  ON_TRIP,
  EDIT_PROFILE,
  PAYMENT_METHODS,
  SETTINGS,
  HELP
}

export enum Page {
    HOME,
    ACTIVITY,
    PROFILE,
}

export interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

export interface RideOption {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  capacity: number;
  icon: React.ReactNode;
}

export interface Driver {
  name: string;
  rating: number;
  vehicleModel: string;
  licensePlate: string;
  avatarUrl: string;
  totalTrips: number;
  memberSince: string;
}

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  totalRides: number;
  rating: number;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
}

export interface AppSettings {
    pushNotifications: boolean;
    emailNotifications: boolean;
}

export interface TripRecord {
  id: string;
  pickup: Location;
  dropoff: Location;
  fare: number;
  date: string; // ISO string
  rideName: string;
}


export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        uri:string;
        text: string;
        author: string;
      }[];
    }
  }
}

export interface ChatMessage {
  sender: 'user' | 'driver';
  text: string;
  timestamp: string;
}