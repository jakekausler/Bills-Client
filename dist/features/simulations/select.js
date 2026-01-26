export const selectSimulations = (state) => state.simulations.simulations;
export const selectSelectedSimulation = (state) => state.simulations.simulations.find((simulation) => simulation.selected);
export const selectSelectedSimulationVariables = (state) => state.simulations.simulations.find((simulation) => simulation.selected)?.variables;
export const selectSimulationsLoaded = (state) => state.simulations.simulationsLoaded;
export const selectUsedVariables = (state) => state.simulations.usedVariables;
export const selectUsedVariablesLoaded = (state) => state.simulations.usedVariablesLoaded;
