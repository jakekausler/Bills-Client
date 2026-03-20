import { api } from '../../utils/api';

// New simulation API endpoints
export interface SimulationStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress?: number;
  totalSimulations?: number;
  completedSimulations?: number;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
}

export interface SimulationRequest {
  totalSimulations?: number;
  batchSize?: number;
  startDate?: string;
  endDate?: string;
}

export const createSimulation = async (data: SimulationRequest) => {
  return await api.post(`/api/monte_carlo/simulations?startDate=${data.startDate}&endDate=${data.endDate}`, data);
};

export const getAllSimulations = async (): Promise<SimulationStatus[]> => {
  return await api.get('/api/monte_carlo/simulations');
};

export const getSimulationStatus = async (id: string): Promise<SimulationStatus> => {
  return await api.get(`/api/monte_carlo/simulations/${id}/status`);
};

export const getSimulationGraph = async (id: string, accountId?: string | null) => {
  const params = accountId ? `?account=${encodeURIComponent(accountId)}` : '';
  return await api.get(`/api/monte_carlo/simulations/${id}/graph${params}`);
};

export const deleteSimulation = async (id: string): Promise<{ success: boolean }> => {
  return api.delete(`/api/monte_carlo/simulations/${id}`);
};

export const getFailureHistogram = async (simulationId: string) => {
  return await api.get(`/api/monte_carlo/simulations/${simulationId}/failure-histogram`);
};

export const getWorstCases = async (simulationId: string, percentile?: number, accountId?: string) => {
  const params = new URLSearchParams();
  if (percentile !== undefined) params.set('percentile', String(percentile));
  if (accountId) params.set('account', accountId);
  const qs = params.toString();
  return await api.get(`/api/monte_carlo/simulations/${simulationId}/worst-cases${qs ? `?${qs}` : ''}`);
};
