import { RootState } from "../../store";

export const selectSimulations = (state: RootState) =>
  state.simulations.simulations;

export const selectSelectedSimulation = (state: RootState) =>
  state.simulations.simulations.find((simulation) => simulation.selected);

export const selectSelectedSimulationVariables = (state: RootState) =>
  state.simulations.simulations.find((simulation) => simulation.selected)
    ?.variables;

export const selectSimulationsLoaded = (state: RootState) =>
  state.simulations.simulationsLoaded;

export const selectUsedVariables = (state: RootState) =>
  state.simulations.usedVariables;

export const selectUsedVariablesLoaded = (state: RootState) =>
  state.simulations.usedVariablesLoaded;
