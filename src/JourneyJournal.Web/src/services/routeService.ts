import { apiClient } from './api';
import type { Route } from '../types/route';
import type { UpdateRouteRequest } from '../types/route';

export const routeService = {
  update: async (routeId: number, route: UpdateRouteRequest): Promise<Route> => {
    const response = await apiClient.put<Route>(`/routes/${routeId}`, route);
    return response.data;
  },
  create: async (fromPointId: number, toPointId: number, route: Omit<Route, 'routeId' | 'fromPointId' | 'toPointId' | 'createdAt' | 'updatedAt'>): Promise<Route> => {
    const response = await apiClient.post<Route>(`/routes`, {
      ...route,
      fromPointOrder: fromPointId,
      toPointOrder: toPointId,
    });
    return response.data;
  },
  delete: async (routeId: number): Promise<void> => {
    await apiClient.delete(`/routes/${routeId}`);
  },
};