import { Simulation } from '../../types/types';
import { api } from '../../utils/api';

export const fetchSimulations = async () => {
  return await api.get('/api/simulations');
};

export const fetchSaveSimulations = async (simulations: Simulation[]) => {
  return await api.put('/api/simulations', simulations);
};

export const fetchUsedVariables = async () => {
  return await api.get('/api/simulations/used_variables');
};
