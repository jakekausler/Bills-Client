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

export const getSimulationGraph = async (id: string) => {
  return await api.get(`/api/monte_carlo/simulations/${id}/graph`);
};
