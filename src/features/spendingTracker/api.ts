import { api } from '../../utils/api';
import { SpendingTrackerCategory } from '../../types/types';

export async function getSpendingTrackerCategories(): Promise<SpendingTrackerCategory[]> {
  return await api.get('/api/spending-tracker');
}

export async function createSpendingTrackerCategory(
  category: Omit<SpendingTrackerCategory, 'id'>
): Promise<SpendingTrackerCategory> {
  // Server uses PUT on /api/spending-tracker for create
  return await api.put('/api/spending-tracker', category);
}

export async function updateSpendingTrackerCategory(
  id: string,
  category: SpendingTrackerCategory
): Promise<SpendingTrackerCategory> {
  // Server uses POST on /api/spending-tracker/:id for update
  return await api.post(`/api/spending-tracker/${id}`, category);
}

export async function deleteSpendingTrackerCategory(id: string): Promise<void> {
  return await api.delete(`/api/spending-tracker/${id}`);
}
