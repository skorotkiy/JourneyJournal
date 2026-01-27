export const TransportationType = {
  Flight: 1,
  Train: 2,
  Bus: 3,
  Car: 4,
  Walking: 5,
  Other: 6
} as const;

export type TransportationType = typeof TransportationType[keyof typeof TransportationType];

export interface Route {
  routeId: number;
  fromPointId: number;
  toPointId: number;
  name: string;
  transportationType: TransportationType;
  carrier?: string;
  departureTime?: string;
  arrivalTime?: string;
  durationMinutes?: number;
  cost?: number;
  isSelected: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateRouteRequest {
  name: string;
  transportationType: TransportationType;
  carrier?: string;
  departureTime?: string;
  arrivalTime?: string;
  durationMinutes?: number;
  cost?: number;
  isSelected: boolean;
  notes?: string;
}