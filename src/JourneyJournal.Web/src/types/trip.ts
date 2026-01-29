
import type { TripPointFull } from './trippoint';
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
  tripPoints?: TripPointFull[];
  expenses?: Expense[];
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
