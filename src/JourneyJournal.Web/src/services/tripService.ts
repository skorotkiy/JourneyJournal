import { apiClient } from './api';
import type { Trip, CreateTripRequest, UpdateTripRequest } from '../types/trip';

export const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const response = await apiClient.get<Trip[]>('/trips');
    return response.data;
  },

  getById: async (id: string): Promise<Trip> => {
    const response = await apiClient.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  create: async (trip: CreateTripRequest): Promise<Trip> => {
    const response = await apiClient.post<Trip>('/trips', trip);
    return response.data;
  },

  update: async (id: string, trip: UpdateTripRequest): Promise<Trip> => {
    const response = await apiClient.put<Trip>(`/trips/${id}`, trip);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/trips/${id}`);
  },
};
