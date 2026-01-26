import { createSlice } from '@reduxjs/toolkit';
import { toDateString } from '../../utils/date';
const initialState = {
    datasets: [],
    labels: [],
    type: 'activity',
    loaded: false,
    error: '',
    startDate: toDateString(new Date()),
    endDate: toDateString(new Date(new Date().setMonth(new Date().getUTCMonth() + 24))),
    show: true,
};
const graphSlice = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        setGraphData: (state, action) => {
            state.datasets = action.payload.datasets;
            state.labels = action.payload.labels;
            state.type = action.payload.type;
            state.loaded = true;
        },
        setGraphError: (state, action) => {
            state.error = action.payload;
        },
        setGraphStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setGraphEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        setShowGraph: (state, action) => {
            state.show = action.payload;
        },
        toggleGraph: (state) => {
            state.show = !state.show;
        },
        updateGraphLoaded: (state, action) => {
            state.loaded = action.payload;
        },
    },
});
export const { setGraphData, setGraphError, setGraphStartDate, setGraphEndDate, setShowGraph, toggleGraph, updateGraphLoaded, } = graphSlice.actions;
export default graphSlice.reducer;
