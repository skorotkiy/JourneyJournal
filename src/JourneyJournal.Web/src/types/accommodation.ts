export const AccommodationType = {
  Booking: 1,
  Hotel: 2,
  Apartment: 3,
  Airbnb: 4,
  Other: 5
} as const;

export type AccommodationType = typeof AccommodationType[keyof typeof AccommodationType];

export const AccommodationStatus = {
  Planned: 1,
  Confirmed: 2,
  PaymentRequired: 3,
  Paid: 4,
  Cancelled: 5
} as const;

export type AccommodationStatus = typeof AccommodationStatus[keyof typeof AccommodationStatus];

export interface Accommodation {
  accommodationId: number;
  tripPointId?: number; // Optional for creation, required for persisted
  name: string;
  accommodationType: AccommodationType;
  address?: string;
  checkInDate: string;
  checkOutDate: string;
  websiteUrl?: string;
  cost: number;
  status: AccommodationStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateAccommodationRequest {
  name: string;
  accommodationType: AccommodationType;
  address?: string;
  checkInDate: string;
  checkOutDate: string;
  websiteUrl?: string;
  cost: number;
  status: AccommodationStatus;
  notes?: string;
}