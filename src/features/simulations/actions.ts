import { AppThunk } from '../../store';
import { Simulation } from '../../types/types';
import { fetchSaveSimulations, fetchSimulations, fetchUsedVariables } from './api';
import { setSimulations, setSimulationsError, setSimulationsLoaded, setUsedVariables, setUsedVariablesLoaded } from './slice';

export const loadSimulations = (): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSimulationsLoaded(false));
      const simulations = await fetchSimulations();
      dispatch(setSimulations(simulations));
      dispatch(loadUsedVariables());
    } catch (error) {
      console.error('Failed to load simulations', error);
      dispatch(setSimulationsError(error instanceof Error ? error.message : 'Failed to load simulations'));
      throw error;
    }
  };
};

export const loadUsedVariables = (): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setUsedVariablesLoaded(false));
      const usedVariables = await fetchUsedVariables();
      dispatch(setUsedVariables(usedVariables));
    } catch (error) {
      console.error('Failed to load used variables:', error);
      dispatch(setSimulationsError(error instanceof Error ? error.message : 'Failed to load used variables'));
      throw error;
    }
  };
};

export const saveSimulations = (simulations: Simulation[]): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchSaveSimulations(simulations);
      dispatch(loadSimulations());
      dispatch(loadUsedVariables());
    } catch (error) {
      console.error('Failed to save simulations:', error);
      dispatch(setSimulationsError(error instanceof Error ? error.message : 'Failed to save simulations'));
      throw error;
    }
  };
};
