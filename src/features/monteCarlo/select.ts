import { RootState } from '../../store';

export const selectMonteCarloDatasets = (state: RootState) => state.monteCarlo.datasets;

export const selectMonteCarloLabels = (state: RootState) => state.monteCarlo.labels;

export const selectMonteCarloStartDate = (state: RootState) => state.monteCarlo.startDate;

export const selectMonteCarloEndDate = (state: RootState) => state.monteCarlo.endDate;

export const selectMonteCarloLoaded = (state: RootState) => state.monteCarlo.loaded;

export const selectMonteCarloError = (state: RootState) => state.monteCarlo.error;

export const selectSelectedAccounts = (state: RootState) => state.monteCarlo.selectedAccounts;

export const selectNSimulations = (state: RootState) => state.monteCarlo.nSimulations;

export const selectSimulations = (state: RootState) => state.monteCarlo.simulations;

export const selectSelectedSimulation = (state: RootState) => state.monteCarlo.selectedSimulation;

export const selectSimulationsLoaded = (state: RootState) => state.monteCarlo.simulationsLoaded;

export const selectReportingAccount = (state: RootState) => state.monteCarlo.reportingAccount;

export const selectShowReal = (state: RootState) => state.monteCarlo.showReal;

export const selectShowDeterministic = (state: RootState) => state.monteCarlo.showDeterministic;

export const selectAccountNames = (state: RootState) => state.monteCarlo.accountNames;

export const selectGraphMetadata = (state: RootState) => state.monteCarlo.graphMetadata;

export const selectFailureHistogram = (state: RootState) => state.monteCarlo.failureHistogram;

export const selectWorstCases = (state: RootState) => state.monteCarlo.worstCases;

export const selectFailureHistogramLoaded = (state: RootState) => state.monteCarlo.failureHistogramLoaded;

export const selectWorstCasesLoaded = (state: RootState) => state.monteCarlo.worstCasesLoaded;

export const selectFailureHistogramError = (state: RootState) => state.monteCarlo.failureHistogramError;

export const selectWorstCasesError = (state: RootState) => state.monteCarlo.worstCasesError;

export const selectIncomeExpenseData = (state: RootState) => state.monteCarlo.incomeExpenseData;

export const selectIncomeExpenseLoaded = (state: RootState) => state.monteCarlo.incomeExpenseLoaded;

export const selectIncomeExpenseError = (state: RootState) => state.monteCarlo.incomeExpenseError;
