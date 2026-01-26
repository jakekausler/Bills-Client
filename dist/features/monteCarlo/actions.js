import { setMonteCarloData, setMonteCarloError, setSimulations, updateSimulationStatus, setSelectedSimulation, } from './slice';
import { createSimulation, getAllSimulations, getSimulationStatus, getSimulationGraph } from './api';
export const startNewSimulation = (simulationData) => async (dispatch) => {
    try {
        const response = await createSimulation(simulationData);
        dispatch(loadAllSimulations());
        return response;
    }
    catch (error) {
        console.error('Failed to start simulation', error);
        dispatch(setMonteCarloError('Failed to start simulation'));
        throw error;
    }
};
export const loadAllSimulations = () => async (dispatch) => {
    try {
        const simulations = await getAllSimulations();
        dispatch(setSimulations(simulations));
    }
    catch (error) {
        console.error('Failed to load simulations', error);
        dispatch(setMonteCarloError('Failed to load simulations'));
    }
};
export const updateSimulationProgress = (id) => async (dispatch) => {
    try {
        const status = await getSimulationStatus(id);
        dispatch(updateSimulationStatus(status));
    }
    catch (error) {
        console.error(`Failed to update simulation ${id} progress`, error);
    }
};
export const loadSimulationGraph = (id) => async (dispatch) => {
    try {
        const graphData = await getSimulationGraph(id);
        dispatch(setMonteCarloData(graphData));
        dispatch(setSelectedSimulation(id));
    }
    catch (error) {
        console.error(`Failed to load simulation ${id} graph`, error);
        dispatch(setMonteCarloError(`Failed to load simulation graph`));
        throw error;
    }
};
