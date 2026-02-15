import { api } from '../../utils/api';
import { SpendingTrackerCategory } from '../../types/types';

export async function getSpendingTrackerCategories(): Promise<SpendingTrackerCategory[]> {
  return await api.get('/api/spending-tracker');
}
