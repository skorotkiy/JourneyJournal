import type { Accommodation } from './accommodation';
import type { Route } from './route';
import type { Expense } from './expense';

export interface Trip {
  tripId: number;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCompleted: boolean;
  isDefault: boolean;
  plannedCost?: number;
  totalCost?: number;
  currency?: string;
  createdAt: string;
  updatedAt?: string;
  tripPoints?: TripPoint[];
  expenses?: Expense[];
}

export interface TripPoint {
  tripPointId: number;
  tripId: number;
  name: string;
  order: number;
  arrivalDate: string;
  departureDate: string;
  notes?: string;
  accommodations?: Accommodation[];
  routesFrom?: Route[];
  routesTo?: Route[];
  placesToVisit?: PlaceToVisit[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTripPointRequest {
  name: string;
  order: number;
  arrivalDate: string;
  departureDate: string;
  notes?: string;
}

export const PlaceToVisitCategory = {
  MustSee: 1,
  Museum: 2,
  Restaurant: 3,
  Entertainment: 4,
  Shopping: 5,
  Nature: 6,
  Historical: 7,
  Other: 8
} as const;

export type PlaceToVisitCategory = typeof PlaceToVisitCategory[keyof typeof PlaceToVisitCategory];

export const VisitStatus = {
  Planned: 1,
  Visited: 2,
  Skipped: 3
} as const;

export type VisitStatus = typeof VisitStatus[keyof typeof VisitStatus];

export interface PlaceToVisit {
  placeToVisitId: number;
  tripPointId?: number;
  name: string;
  category: PlaceToVisitCategory;
  address?: string;
  description?: string;
  price?: number;
  websiteUrl?: string;
  usefulLinks?: string;
  order: number;
  rating?: number;
  visitDate?: string;
  visitStatus: VisitStatus;
  afterVisitNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTripRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCompleted?: boolean;
  isDefault?: boolean;
  plannedCost?: number;
  totalCost?: number;
  currency?: string;
}

export interface UpdateTripRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isCompleted?: boolean;
  isDefault?: boolean;
  plannedCost?: number;
  totalCost?: number;
  currency?: string;
}
