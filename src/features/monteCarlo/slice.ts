import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { Dataset, GraphData } from '../../types/types';
import { toDateString } from '../../utils/date';

interface MonteCarloState {
  datasets: Dataset[];
  labels: string[];
  loaded: boolean;
  error: string;
  selectedAccounts: string[];

  startDate: string;
  endDate: string;
  nSimulations: number;
}

const initialState: MonteCarloState = {
  datasets: [],
  labels: [],
  loaded: false,
  error: '',
  startDate: toDateString(new Date(new Date().setMonth(new Date().getMonth() - 1))),
  endDate: toDateString(new Date(new Date().setMonth(new Date().getMonth() + 24))),
  selectedAccounts: [],
  nSimulations: 10,
};

const monteCarloSlice = createSlice({
  name: 'monteCarlo',
  initialState,
  reducers: {
    setMonteCarloData: (state, action: PayloadAction<GraphData>) => {
      state.datasets = action.payload.datasets;
      state.labels = action.payload.labels;
      state.loaded = true;
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
} = monteCarloSlice.actions;
export default monteCarloSlice.reducer;
