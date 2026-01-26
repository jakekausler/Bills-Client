import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    simulations: [],
    simulationsLoaded: false,
    usedVariables: {},
    usedVariablesLoaded: false,
};
export const simulationsSlice = createSlice({
    name: 'simulations',
    initialState,
    reducers: {
        setSimulations: (state, action) => {
            state.simulations = action.payload;
            state.simulationsLoaded = true;
        },
        setSimulationsLoaded: (state, action) => {
            state.simulationsLoaded = action.payload;
        },
        setUsedVariables: (state, action) => {
            state.usedVariables = action.payload;
            state.usedVariablesLoaded = true;
        },
        setUsedVariablesLoaded: (state, action) => {
            state.usedVariablesLoaded = action.payload;
        },
    },
});
export const { setSimulations, setSimulationsLoaded, setUsedVariables, setUsedVariablesLoaded } = simulationsSlice.actions;
export default simulationsSlice.reducer;
