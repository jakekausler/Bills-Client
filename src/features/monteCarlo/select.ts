import { RootState } from '../../store';

export const selectMonteCarloDatasets = (state: RootState) => state.monteCarlo.datasets;

export const selectMonteCarloLabels = (state: RootState) => state.monteCarlo.labels;

export const selectMonteCarloStartDate = (state: RootState) => state.monteCarlo.startDate;

export const selectMonteCarloEndDate = (state: RootState) => state.monteCarlo.endDate;

export const selectMonteCarloLoaded = (state: RootState) => state.monteCarlo.loaded;

export const selectMonteCarloError = (state: RootState) => state.monteCarlo.error;

export const selectMonteCarloSelectedAccounts = (state: RootState) => state.monteCarlo.selectedAccounts;

export const selectSelectedAccounts = (state: RootState) => state.monteCarlo.selectedAccounts;

export const selectNSimulations = (state: RootState) => state.monteCarlo.nSimulations;

export const selectSimulations = (state: RootState) => state.monteCarlo.simulations;

export const selectSelectedSimulation = (state: RootState) => state.monteCarlo.selectedSimulation;

export const selectSimulationsLoaded = (state: RootState) => state.monteCarlo.simulationsLoaded;
