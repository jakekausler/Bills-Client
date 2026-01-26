import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    configs: [],
    loading: false,
    error: null,
};
const healthcareSlice = createSlice({
    name: 'healthcare',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setConfigs: (state, action) => {
            state.configs = action.payload;
            state.loading = false;
            state.error = null;
        },
        addConfig: (state, action) => {
            state.configs.push(action.payload);
        },
        updateConfig: (state, action) => {
            const index = state.configs.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.configs[index] = action.payload;
            }
        },
        removeConfig: (state, action) => {
            state.configs = state.configs.filter(c => c.id !== action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});
export const { setLoading, setError, setConfigs, addConfig, updateConfig, removeConfig, clearError, } = healthcareSlice.actions;
export default healthcareSlice.reducer;
