import { AppThunk } from '../../store';
import {
  setMonteCarloData,
  setMonteCarloError,
  setMonteCarloLoaded,
  clearMonteCarloError,
  setSimulations,
  updateSimulationStatus,
  setSelectedSimulation,
  removeSimulation,
} from './slice';
import { createSimulation, getAllSimulations, getSimulationStatus, getSimulationGraph, deleteSimulation, SimulationRequest } from './api';

export const startNewSimulation =
  (simulationData: SimulationRequest): AppThunk =>
  async (dispatch) => {
    try {
      const response = await createSimulation(simulationData);
      dispatch(loadAllSimulations());
      return response;
    } catch (error) {
      console.error('Failed to start simulation', error);
      dispatch(setMonteCarloError('Failed to start simulation'));
      throw error;
    }
  };

export const loadAllSimulations = (): AppThunk => async (dispatch) => {
  try {
    const simulations = await getAllSimulations();
    dispatch(setSimulations(simulations));
  } catch (error) {
    console.error('Failed to load simulations', error);
    dispatch(setMonteCarloError('Failed to load simulations'));
  }
};

export const updateSimulationProgress =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      const status = await getSimulationStatus(id);
      dispatch(updateSimulationStatus(status));
    } catch (error: any) {
      // If 404, simulation was deleted — remove from local state
      if (error?.message?.includes('404')) {
        dispatch(removeSimulation(id));
      } else {
        console.error(`Failed to update simulation ${id} progress`, error);
      }
    }
  };

export const loadSimulationGraph =
  (id: string, accountId?: string | null): AppThunk =>
  async (dispatch) => {
    dispatch(setMonteCarloLoaded(false));
    dispatch(clearMonteCarloError());
    try {
      const graphData = await getSimulationGraph(id, accountId);
      dispatch(setMonteCarloData(graphData));
      dispatch(setSelectedSimulation(id));
    } catch (error) {
      console.error(`Failed to load simulation ${id} graph`, error);
      dispatch(setMonteCarloError(`Failed to load simulation graph`));
      throw error;
    }
  };

export const deleteMonteCarloSimulation = (id: string): AppThunk => async (dispatch) => {
  try {
    await deleteSimulation(id);
    dispatch(removeSimulation(id));
  } catch (error) {
    dispatch(setMonteCarloError(error instanceof Error ? error.message : 'Failed to delete simulation'));
  }
};
