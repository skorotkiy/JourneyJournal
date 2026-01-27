import { apiClient } from './api';
import type { Accommodation } from '../types/accommodation';
import type { UpdateAccommodationRequest } from '../types/accommodation';

export const accommodationService = {
  update: async (accommodationId: number, accommodation: UpdateAccommodationRequest): Promise<Accommodation> => {
    const response = await apiClient.put<Accommodation>(`/accommodations/${accommodationId}`, accommodation);
    return response.data;
  },
  create: async (tripPointId: number, accommodation: Omit<Accommodation, 'accommodationId' | 'createdAt' | 'updatedAt'>): Promise<Accommodation> => {
    const response = await apiClient.post<Accommodation>(`/accommodations`, {
      ...accommodation,
      tripPointId,
    });
    return response.data;
  },
  delete: async (accommodationId: number): Promise<void> => {
    await apiClient.delete(`/accommodations/${accommodationId}`);
  },
};
