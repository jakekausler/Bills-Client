import { api } from '../../utils/api';
import { FailureHistogramData, PercentileGraphData, WorstCasesData } from '../../types/types';

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

export const createSimulation = async (data: SimulationRequest): Promise<SimulationStatus> => {
  const params = new URLSearchParams();
  if (data.startDate) params.set('startDate', data.startDate);
  if (data.endDate) params.set('endDate', data.endDate);
  const qs = params.toString();
  return await api.post(`/api/monte_carlo/simulations${qs ? `?${qs}` : ''}`, data);
};

export const getAllSimulations = async (): Promise<SimulationStatus[]> => {
  return await api.get('/api/monte_carlo/simulations');
};

export const getSimulationStatus = async (id: string): Promise<SimulationStatus> => {
  if (!id) throw new Error('Missing simulation ID');
  return await api.get(`/api/monte_carlo/simulations/${id}/status`);
};

export const getSimulationGraph = async (id: string, accountId?: string | null): Promise<PercentileGraphData> => {
  if (!id) throw new Error('Missing simulation ID');
  const params = accountId ? `?account=${encodeURIComponent(accountId)}` : '';
  return await api.get(`/api/monte_carlo/simulations/${id}/graph${params}`);
};

export const deleteSimulation = async (id: string): Promise<{ success: boolean }> => {
  if (!id) throw new Error('Missing simulation ID');
  return await api.delete(`/api/monte_carlo/simulations/${id}`);
};

export const getFailureHistogram = async (simulationId: string): Promise<FailureHistogramData> => {
  if (!simulationId) throw new Error('Missing simulation ID');
  return await api.get(`/api/monte_carlo/simulations/${simulationId}/failure-histogram`);
};

export const getWorstCases = async (simulationId: string, percentile?: number, accountId?: string): Promise<WorstCasesData> => {
  if (!simulationId) throw new Error('Missing simulation ID');
  const params = new URLSearchParams();
  if (percentile !== undefined) params.set('percentile', String(percentile));
  if (accountId) params.set('account', accountId);
  const qs = params.toString();
  return await api.get(`/api/monte_carlo/simulations/${simulationId}/worst-cases${qs ? `?${qs}` : ''}`);
};
