// TripPoint: only its own properties, no relations
export interface TripPoint {
  tripPointId: number;
  tripId: number;
  name: string;
  order: number;
  arrivalDate: string;
  departureDate: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
import type { Accommodation } from './accommodation';
import type { Route } from './route';

export interface TripPointFull {
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
  tripId: number;
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

export interface UpdateTripPointRequest {
  name: string;
  order: number;
  arrivalDate: string;
  departureDate: string;
  notes?: string;
  accommodations?: Accommodation[];
  placesToVisit?: PlaceToVisit[];
}
