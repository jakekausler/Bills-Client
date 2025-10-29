import { api, fetchWithAuth } from '../../utils/api';
import { HealthcareConfig, DeductibleProgress, HealthcareExpense } from '../../types/types';

// Healthcare Configs CRUD
export async function getHealthcareConfigs(): Promise<HealthcareConfig[]> {
  return await api.get('/api/healthcare/configs');
}

export async function postHealthcareConfig(
  config: Omit<HealthcareConfig, 'id'>
): Promise<HealthcareConfig> {
  return await api.post('/api/healthcare/configs', config);
}

export async function putHealthcareConfig(
  id: string,
  config: HealthcareConfig
): Promise<HealthcareConfig> {
  return await api.put(`/api/healthcare/configs/${id}`, config);
}

export async function deleteHealthcareConfigApi(id: string): Promise<void> {
  return await api.delete(`/api/healthcare/configs/${id}`);
}

// Progress tracking (backend-driven, no Redux caching)
export async function getDeductibleProgress(
  simulation: string,
  date?: string
): Promise<Record<string, DeductibleProgress>> {
  const params = new URLSearchParams({ simulation });
  if (date) params.append('date', date);
  return await fetchWithAuth(`/api/healthcare/progress?${params}`);
}

// Healthcare expenses (backend-driven, no Redux caching)
export async function getHealthcareExpenses(
  simulation: string,
  startDate?: string,
  endDate?: string
): Promise<HealthcareExpense[]> {
  const params = new URLSearchParams({ simulation });
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  return await fetchWithAuth(`/api/healthcare/expenses?${params}`);
}
