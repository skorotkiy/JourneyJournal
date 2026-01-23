import { apiClient } from './api';
import type { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../types/expense';

export const expenseService = {
  getAll: async (tripId: number): Promise<Expense[]> => {
    const response = await apiClient.get<Expense[]>(`/trips/${tripId}/expenses`);
    return response.data;
  },

  getById: async (tripId: number, expenseId: number): Promise<Expense> => {
    const response = await apiClient.get<Expense>(`/trips/${tripId}/expenses/${expenseId}`);
    return response.data;
  },

  getSummary: async (tripId: number): Promise<Record<string, number>> => {
    const response = await apiClient.get<Record<string, number>>(`/trips/${tripId}/expenses/summary`);
    return response.data;
  },

  create: async (tripId: number, expense: CreateExpenseRequest): Promise<Expense> => {
    const response = await apiClient.post<Expense>(`/trips/${tripId}/expenses`, expense);
    return response.data;
  },

  update: async (tripId: number, expenseId: number, expense: UpdateExpenseRequest): Promise<Expense> => {
    const response = await apiClient.put<Expense>(`/trips/${tripId}/expenses/${expenseId}`, expense);
    return response.data;
  },

  delete: async (tripId: number, expenseId: number): Promise<void> => {
    await apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
  },
};
