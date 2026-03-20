import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FailureHistogramData, IncomeExpenseData, PercentileDataset, PercentileGraphData, WorstCasesData } from '../../types/types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SimulationStatus } from './api';

dayjs.extend(utc);

interface MonteCarloState {
  datasets: PercentileDataset[];
  labels: string[];
  loaded: boolean;
  error: string;
  selectedAccounts: string[];

  startDate: string;
  endDate: string;
  nSimulations: number;

  simulations: SimulationStatus[];
  selectedSimulation: string | null;
  simulationsLoaded: boolean;

  // MC reporting controls
  reportingAccount: string | null; // null = combined, account ID for per-account
  showReal: boolean;
  showDeterministic: boolean;

  // Graph metadata
  accountNames: Array<{ id: string; name: string }>;
  graphMetadata: {
    totalSimulations?: number;
    seed?: number;
    fundedRatio?: number;
    failedSimulations?: number;
    medianFailureYear?: number | null;
    worstYear?: { year: number; medianMinBalance: number; realMedianMinBalance: number };
    finalYear?: {
      median: number;
      p5: number;
      p25: number;
      p75: number;
      p95: number;
      realMedian: number;
      realP5: number;
      realP25: number;
      realP75: number;
      realP95: number;
    };
  };

  // Failure histogram + worst cases
  failureHistogram: FailureHistogramData | null;
  worstCases: WorstCasesData | null;
  failureHistogramLoaded: boolean;
  worstCasesLoaded: boolean;
  failureHistogramError: string | null;
  worstCasesError: string | null;

  // Income/Expense view
  incomeExpenseData: IncomeExpenseData | null;
  incomeExpenseLoaded: boolean;
  incomeExpenseError: string | null;
}

const initialState: MonteCarloState = {
  datasets: [],
  labels: [],
  loaded: false,
  error: '',
  startDate: dayjs.utc().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: dayjs.utc().add(24, 'month').format('YYYY-MM-DD'),
  selectedAccounts: [],
  nSimulations: 3,
  simulations: [],
  selectedSimulation: null,
  simulationsLoaded: false,
  reportingAccount: null,
  showReal: false,
  showDeterministic: true,
  accountNames: [],
  graphMetadata: {},
  failureHistogram: null,
  worstCases: null,
  failureHistogramLoaded: false,
  worstCasesLoaded: false,
  failureHistogramError: null,
  worstCasesError: null,
  incomeExpenseData: null,
  incomeExpenseLoaded: false,
  incomeExpenseError: null,
};

const monteCarloSlice = createSlice({
  name: 'monteCarlo',
  initialState,
  reducers: {
    setMonteCarloData: (state, action: PayloadAction<PercentileGraphData>) => {
      state.datasets = action.payload.datasets.map((dataset) => ({
        ...dataset,
        borderColor: dataset.isDeterministic ? '#00FA9A' : '#FAEBD7',
        backgroundColor: `${dataset.isDeterministic ? '#00FA9A' : '#FAEBD7'}80`,
      }));
      state.labels = action.payload.labels;
      state.loaded = true;
      state.error = ''; // Clear error when data loads successfully
      if (action.payload.accountNames) {
        state.accountNames = action.payload.accountNames;
      }
      state.graphMetadata = {
        totalSimulations: action.payload.totalSimulations,
        seed: action.payload.seed,
        fundedRatio: action.payload.fundedRatio,
        failedSimulations: action.payload.failedSimulations,
        medianFailureYear: action.payload.medianFailureYear,
        worstYear: action.payload.worstYear,
        finalYear: action.payload.finalYear,
      };
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
    removeSimulation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.simulations = state.simulations.filter(s => s.id !== id);
      if (state.selectedSimulation === id) {
        state.selectedSimulation = null;
        state.datasets = [];
        state.labels = [];
        state.loaded = false;
      }
    },
    clearMonteCarloError: (state) => {
      state.error = '';
    },
    setReportingAccount: (state, action: PayloadAction<string | null>) => {
      state.reportingAccount = action.payload;
    },
    setShowReal: (state, action: PayloadAction<boolean>) => {
      state.showReal = action.payload;
    },
    setShowDeterministic: (state, action: PayloadAction<boolean>) => {
      state.showDeterministic = action.payload;
    },
    setFailureHistogram: (state, action: PayloadAction<FailureHistogramData | null>) => {
      state.failureHistogram = action.payload;
    },
    setFailureHistogramLoaded: (state, action: PayloadAction<boolean>) => {
      state.failureHistogramLoaded = action.payload;
    },
    setFailureHistogramError: (state, action: PayloadAction<string | null>) => {
      state.failureHistogramError = action.payload;
    },
    setWorstCases: (state, action: PayloadAction<WorstCasesData | null>) => {
      state.worstCases = action.payload;
    },
    setWorstCasesLoaded: (state, action: PayloadAction<boolean>) => {
      state.worstCasesLoaded = action.payload;
    },
    setWorstCasesError: (state, action: PayloadAction<string | null>) => {
      state.worstCasesError = action.payload;
    },
    setIncomeExpenseData: (state, action: PayloadAction<IncomeExpenseData | null>) => {
      state.incomeExpenseData = action.payload;
    },
    setIncomeExpenseLoaded: (state, action: PayloadAction<boolean>) => {
      state.incomeExpenseLoaded = action.payload;
    },
    setIncomeExpenseError: (state, action: PayloadAction<string | null>) => {
      state.incomeExpenseError = action.payload;
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
  removeSimulation,
  clearMonteCarloError,
  setReportingAccount,
  setShowReal,
  setShowDeterministic,
  setFailureHistogram,
  setFailureHistogramLoaded,
  setFailureHistogramError,
  setWorstCases,
  setWorstCasesLoaded,
  setWorstCasesError,
  setIncomeExpenseData,
  setIncomeExpenseLoaded,
  setIncomeExpenseError,
} = monteCarloSlice.actions;
export default monteCarloSlice.reducer;
