import { Simulation, UsedVariableMap } from '../../types/types';
import { api } from '../../utils/api';

export const fetchSimulations = async (): Promise<Simulation[]> => {
  return await api.get<Simulation[]>('/api/simulations');
};

export const fetchSaveSimulations = async (simulations: Simulation[]): Promise<void> => {
  return await api.put<void>('/api/simulations', simulations);
};

export const fetchUsedVariables = async (): Promise<UsedVariableMap> => {
  return await api.get<UsedVariableMap>('/api/simulations/used_variables');
};
