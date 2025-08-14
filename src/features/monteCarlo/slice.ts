import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { Dataset, GraphData } from '../../types/types';
import { toDateString } from '../../utils/date';
import { SimulationStatus } from './api';

interface MonteCarloState {
  datasets: Dataset[];
  labels: string[];
  loaded: boolean;
  error: string;
  selectedAccounts: string[];

  startDate: string;
  endDate: string;
  nSimulations: number;

  // New simulation state
  simulations: SimulationStatus[];
  selectedSimulation: string | null;
  simulationsLoaded: boolean;
}

const initialState: MonteCarloState = {
  datasets: [],
  labels: [],
  loaded: false,
  error: '',
  startDate: toDateString(new Date(new Date().setMonth(new Date().getUTCMonth() - 1))),
  endDate: toDateString(new Date(new Date().setMonth(new Date().getUTCMonth() + 24))),
  selectedAccounts: [],
  nSimulations: 3,
  simulations: [],
  selectedSimulation: null,
  simulationsLoaded: false,
};

const monteCarloSlice = createSlice({
  name: 'monteCarlo',
  initialState,
  reducers: {
    setMonteCarloData: (state, action: PayloadAction<GraphData>) => {
      state.datasets = (action.payload.datasets as unknown as Dataset[]).map((dataset) => ({
        ...dataset,
        borderColor: dataset.label === 'Deterministic' ? '#00FA9A' : '#FAEBD7',
        backgroundColor: `hsla(${dataset.label === 'Deterministic' ? '#00FA9A' : '#FAEBD7'}, 70%, 50%, 0.5)`,
      }));
      state.labels = action.payload.labels as unknown as string[];
      state.loaded = true;
      state.error = ''; // Clear error when data loads successfully
    },
    setMonteCarloError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setMonteCarloStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setMonteCarloEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setMonteCarloLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
    updateSelectedAccounts: (state, action: PayloadAction<string[]>) => {
      state.selectedAccounts = action.payload;
    },
    setNSimulations: (state, action: PayloadAction<number>) => {
      state.nSimulations = action.payload;
    },
    setSimulations: (state, action: PayloadAction<SimulationStatus[]>) => {
      state.simulations = action.payload;
      state.simulationsLoaded = true;
      state.error = ''; // Clear error when simulations load successfully
    },
    setSelectedSimulation: (state, action: PayloadAction<string | null>) => {
      state.selectedSimulation = action.payload;
    },
    updateSimulationStatus: (state, action: PayloadAction<SimulationStatus>) => {
      const index = state.simulations.findIndex((sim) => sim.id === action.payload.id);
      if (index !== -1) {
        state.simulations[index] = action.payload;
      }
    },
    clearMonteCarloError: (state) => {
      state.error = '';
    },
  },
});

export const {
  setMonteCarloData,
  setMonteCarloError,
  setMonteCarloStartDate,
  setMonteCarloEndDate,
  setMonteCarloLoaded,
  updateSelectedAccounts,
  setNSimulations,
  setSimulations,
  setSelectedSimulation,
  updateSimulationStatus,
  clearMonteCarloError,
} = monteCarloSlice.actions;
export default monteCarloSlice.reducer;
