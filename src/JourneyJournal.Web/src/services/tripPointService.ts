import { apiClient } from './api';
import type { TripPoint, CreateTripPointRequest, UpdateTripPointRequest } from '../types/trippoint';

export const tripPointService = {
  create: async (tripPoint: CreateTripPointRequest): Promise<TripPoint> => {
    const response = await apiClient.post<TripPoint>('/trippoints', tripPoint);
    return response.data;
  },

  update: async (id: number, tripPoint: UpdateTripPointRequest): Promise<TripPoint> => {
    const response = await apiClient.put<TripPoint>(`/trippoints/${id}`, tripPoint);
    return response.data;
  },

  getById: async (id: number): Promise<TripPoint> => {
    const response = await apiClient.get<TripPoint>(`/trippoints/${id}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/trippoints/${id}`);
  },
};
