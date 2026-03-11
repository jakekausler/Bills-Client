import type { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';

export const selectSimulations = (state: RootState) => state.simulations.simulations;

export const selectSelectedSimulation = createSelector(
  [selectSimulations],
  (simulations) => simulations.find((s) => s.selected)
);

export const selectSelectedSimulationVariables = createSelector(
  [selectSelectedSimulation],
  (simulation) => simulation?.variables
);

export const selectSimulationsLoaded = (state: RootState) => state.simulations.simulationsLoaded;

export const selectUsedVariables = (state: RootState) => state.simulations.usedVariables;

export const selectUsedVariablesLoaded = (state: RootState) => state.simulations.usedVariablesLoaded;

export const selectSimulationsError = (state: RootState) => state.simulations.simulationsError;
