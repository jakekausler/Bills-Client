import { AppThunk } from '../../store';
import {
  setMonteCarloData,
  setMonteCarloError,
  setSimulations,
  updateSimulationStatus,
  setSelectedSimulation,
} from './slice';
import { createSimulation, getAllSimulations, getSimulationStatus, getSimulationGraph, SimulationRequest } from './api';

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
    } catch (error) {
      console.error(`Failed to update simulation ${id} progress`, error);
    }
  };

export const loadSimulationGraph =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      const graphData = await getSimulationGraph(id);
      dispatch(setMonteCarloData(graphData));
      dispatch(setSelectedSimulation(id));
    } catch (error) {
      console.error(`Failed to load simulation ${id} graph`, error);
      dispatch(setMonteCarloError(`Failed to load simulation graph`));
      throw error;
    }
  };
