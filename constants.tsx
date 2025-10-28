
import React from 'react';
import type { RideOption, Driver } from './types';
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

export const mockDriver: Driver = {
  name: 'David L.',
  rating: 4.9,
  vehicleModel: 'Toyota Prius',
  licensePlate: '5XYZ123',
  avatarUrl: 'https://picsum.photos/id/1005/200/200',
  eta: 3,
};
