import React from 'react';
import type { RideOption, Driver, User, PaymentMethod, AppSettings, Location } from './types';
import { CarIcon, PersonIcon, ZapIcon } from './components/icons';

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
  }
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