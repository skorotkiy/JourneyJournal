import { apiClient } from './api';
import type { Accommodation, UpdateAccommodationRequest } from '../types/trip';

export const accommodationService = {
  update: async (accommodationId: number, accommodation: UpdateAccommodationRequest): Promise<Accommodation> => {
    const response = await apiClient.put<Accommodation>(`/accommodations/${accommodationId}`, accommodation);
    return response.data;
  },
};
