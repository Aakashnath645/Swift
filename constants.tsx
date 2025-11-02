import React from 'react';
import type { RideOption, Driver, User, PaymentMethod, AppSettings, Location } from './types';
import { CarIcon, PersonIcon, ZapIcon, BikeIcon } from './components/icons';

export const rideOptions: RideOption[] = [
  {
    id: 'swiftgo',
    name: 'SwiftGo',
    description: 'Affordable, everyday rides',
    multiplier: 1,
    capacity: 4,
    icon: <CarIcon className="w-8 h-8 text-cyan-400" />,
  },
  {
    id: 'swiftcomfort',
    name: 'SwiftComfort',
    description: 'Newer cars with extra legroom',
    multiplier: 1.3,
    capacity: 4,
    icon: <ZapIcon className="w-8 h-8 text-purple-400" />,
  },
  {
    id: 'swiftxl',
    name: 'SwiftXL',
    description: 'Affordable rides for groups up to 6',
    multiplier: 1.8,
    capacity: 6,
    icon: <PersonIcon className="w-8 h-8 text-amber-400" />,
  },
  {
    id: 'swiftbike',
    name: 'SwiftBike',
    description: 'Quick, eco-friendly solo rides',
    multiplier: 0.5,
    capacity: 1,
    icon: <BikeIcon className="w-8 h-8 text-green-400" />,
  }
];

export const mockBikeModels: { model: string; plate: string }[] = [
    { model: 'Royal Enfield Classic 350', plate: 'KA 05 JD 1901' },
    { model: 'Bajaj Pulsar NS200', plate: 'MH 12 AB 5678' },
    { model: 'TVS Apache RTR 160', plate: 'TN 22 C 9876' },
    { model: 'Hero Splendor Plus', plate: 'DL 08 S 4321' },
];

export const mockDrivers: Driver[] = [
  {
    name: 'David L.',
    rating: 4.9,
    vehicleModel: 'Toyota Prius',
    licensePlate: '5XYZ123',
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    totalTrips: 1245,
    memberSince: '2021',
  },
  {
    name: 'Maria G.',
    rating: 4.8,
    vehicleModel: 'Honda Civic',
    licensePlate: '8ABC456',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    totalTrips: 832,
    memberSince: '2022',
  },
  {
    name: 'Chen W.',
    rating: 4.9,
    vehicleModel: 'Tesla Model 3',
    licensePlate: '9DEF789',
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    totalTrips: 2109,
    memberSince: '2020',
  }
];

export const mockUser: User = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/id/1027/200/200',
  totalRides: 42,
  rating: 4.95,
};

export const initialPaymentMethods: PaymentMethod[] = [
    { id: '1', type: 'visa', last4: '4242' },
    { id: '2', type: 'mastercard', last4: '8921' },
];

export const initialAppSettings: AppSettings = {
    pushNotifications: true,
    emailNotifications: false,
};

export const mockLandmarks: Location[] = [
    { address: 'Coit Tower', lat: 37.8024, lng: -122.4058 },
    { address: 'Golden Gate Bridge', lat: 37.8199, lng: -122.4783 },
    { address: 'Fisherman\'s Wharf', lat: 37.8080, lng: -122.4177 },
    { address: 'Alcatraz Island', lat: 37.8270, lng: -122.4230 },
    { address: 'The Castro Theatre', lat: 37.7621, lng: -122.4347 },
    { address: 'Oracle Park', lat: 37.7786, lng: -122.3893 },
];

export const TERMS_AND_CONDITIONS = `
    <h2>1. Introduction</h2>
    <p>Welcome to Swift. These are the terms and conditions governing your access to and use of the Swift application.</p>
    <h2>2. User Obligations</h2>
    <p>You agree to use the app in compliance with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account information.</p>
    <h2>3. Limitation of Liability</h2>
    <p>Swift is a simulation application. We are not liable for any damages or losses arising from your use or inability to use the service.</p>
`;

export const CANCELLATION_POLICY = `
    <h2>1. Cancellation Fees</h2>
    <p>A cancellation fee may be charged if you cancel a trip after a driver has already been dispatched and is on their way to your pickup location.</p>
    <h2>2. How to Cancel</h2>
    <p>You can cancel a trip at any time before it begins through the app. Navigate to the trip screen and select the "Cancel Trip" option.</p>
    <h2>3. Disputes</h2>
    <p>If you believe you were unfairly charged a cancellation fee, you may contact our support team through the Help section of the app.</p>
`;