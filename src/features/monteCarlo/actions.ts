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
  setFailureHistogram,
  setFailureHistogramLoaded,
  setFailureHistogramError,
  setWorstCases,
  setWorstCasesLoaded,
  setWorstCasesError,
  setIncomeExpenseData,
  setIncomeExpenseLoaded,
  setIncomeExpenseError,
} from './slice';
import {
  createSimulation,
  getAllSimulations,
  getSimulationStatus,
  getSimulationGraph,
  deleteSimulation,
  getFailureHistogram,
  getWorstCases,
  getIncomeExpense,
  SimulationRequest,
} from './api';

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
    } catch (error: unknown) {
      // If 404, simulation was deleted — remove from local state
      if (error instanceof Error && error.message.includes('404')) {
        dispatch(removeSimulation(id));
      } else {
        console.error(`Failed to update simulation ${id} progress`, error);
      }
    }
  };

// TODO(#33): add stale-request guard for rapid account switching
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

export const loadFailureHistogram =
  (simulationId: string): AppThunk =>
  async (dispatch) => {
    dispatch(setFailureHistogramLoaded(false));
    dispatch(setFailureHistogramError(null));
    try {
      const data = await getFailureHistogram(simulationId);
      dispatch(setFailureHistogram(data));
      dispatch(setFailureHistogramLoaded(true));
    } catch (error) {
      console.error(`Failed to load failure histogram for ${simulationId}`, error);
      dispatch(setFailureHistogramError('Failed to load failure histogram'));
      dispatch(setFailureHistogramLoaded(true));
      throw error;
    }
  };

// TODO(#33): add stale-request guard for rapid account switching
export const loadWorstCases =
  (simulationId: string, percentile?: number, accountId?: string): AppThunk =>
  async (dispatch) => {
    dispatch(setWorstCasesLoaded(false));
    dispatch(setWorstCasesError(null));
    try {
      const data = await getWorstCases(simulationId, percentile, accountId);
      dispatch(setWorstCases(data));
      dispatch(setWorstCasesLoaded(true));
    } catch (error) {
      console.error(`Failed to load worst cases for ${simulationId}`, error);
      dispatch(setWorstCasesError('Failed to load worst cases'));
      dispatch(setWorstCasesLoaded(true));
      throw error;
    }
  };

export const loadIncomeExpense =
  (simulationId: string, percentile?: number): AppThunk =>
  async (dispatch) => {
    dispatch(setIncomeExpenseLoaded(false));
    dispatch(setIncomeExpenseError(null));
    try {
      const data = await getIncomeExpense(simulationId, percentile);
      dispatch(setIncomeExpenseData(data));
      dispatch(setIncomeExpenseLoaded(true));
    } catch (error) {
      console.error(`Failed to load income/expense for ${simulationId}`, error);
      dispatch(setIncomeExpenseError('Failed to load income/expense data'));
      dispatch(setIncomeExpenseLoaded(true));
      throw error;
    }
  };
