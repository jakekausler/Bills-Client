import { createSlice } from '@reduxjs/toolkit';
import { toDateString } from '../../utils/date';
const initialState = {
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
        setMonteCarloData: (state, action) => {
            state.datasets = action.payload.datasets.map((dataset) => ({
                ...dataset,
                borderColor: dataset.label === 'Deterministic' ? '#00FA9A' : '#FAEBD7',
                backgroundColor: `hsla(${dataset.label === 'Deterministic' ? '#00FA9A' : '#FAEBD7'}, 70%, 50%, 0.5)`,
            }));
            state.labels = action.payload.labels;
            state.loaded = true;
            state.error = ''; // Clear error when data loads successfully
        },
        setMonteCarloError: (state, action) => {
            state.error = action.payload;
        },
        setMonteCarloStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setMonteCarloEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        setMonteCarloLoaded: (state, action) => {
            state.loaded = action.payload;
        },
        updateSelectedAccounts: (state, action) => {
            state.selectedAccounts = action.payload;
        },
        setNSimulations: (state, action) => {
            state.nSimulations = action.payload;
        },
        setSimulations: (state, action) => {
            state.simulations = action.payload;
            state.simulationsLoaded = true;
            state.error = ''; // Clear error when simulations load successfully
        },
        setSelectedSimulation: (state, action) => {
            state.selectedSimulation = action.payload;
        },
        updateSimulationStatus: (state, action) => {
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
export const { setMonteCarloData, setMonteCarloError, setMonteCarloStartDate, setMonteCarloEndDate, setMonteCarloLoaded, updateSelectedAccounts, setNSimulations, setSimulations, setSelectedSimulation, updateSimulationStatus, clearMonteCarloError, } = monteCarloSlice.actions;
export default monteCarloSlice.reducer;
