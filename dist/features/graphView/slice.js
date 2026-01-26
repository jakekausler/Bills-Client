import { createSlice } from '@reduxjs/toolkit';
import { toDateString } from '../../utils/date';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const initialState = {
    datasets: [],
    labels: [],
    type: 'activity',
    loaded: false,
    error: '',
    startDate: toDateString(dayjs.utc(new Date()).startOf('year').toDate()),
    endDate: toDateString(dayjs.utc(new Date()).endOf('year').add(10, 'year').toDate()),
    selectedAccounts: [],
    selectedSimulations: [],
    combineAccounts: true,
};
const lineColors = [
    '#FF6B6B', // soft red
    '#FFD93D', // vibrant yellow
    '#6BCB77', // bright green
    '#4D96FF', // sky blue
    '#FF6F91', // pink
    '#845EC2', // violet
    '#00C9A7', // aqua
    '#F9F871', // lemon
    '#FF9671', // peach
    '#FFC75F', // sunflower
    '#008F7A', // deep teal
    '#C34A36', // brick
    '#1982C4', // vivid blue
    '#FF4C29', // orange-red
    '#9D4EDD', // rich purple
];
const borderDashes = [[], [10, 5], [5, 10], [10, 10], [5, 5], [10, 15]];
const graphViewSlice = createSlice({
    name: 'graphView',
    initialState,
    reducers: {
        setGraphViewData: (state, action) => {
            const datasets = [];
            const labels = action.payload[Object.keys(action.payload)[0]].labels;
            const type = action.payload[Object.keys(action.payload)[0]].type;
            Object.keys(action.payload).forEach((simulation, simulationIndex) => {
                action.payload[simulation].datasets.forEach((dataset, accountIndex) => {
                    datasets.push({
                        ...dataset,
                        label: `${dataset.label} (${simulation})`,
                        borderColor: lineColors[accountIndex % lineColors.length],
                        backgroundColor: `hsla(${lineColors[accountIndex % lineColors.length]}, 70%, 50%, 0.5)`,
                        borderDash: borderDashes[simulationIndex % borderDashes.length],
                    });
                });
            });
            state.datasets = datasets;
            state.labels = labels;
            state.type = type;
            state.loaded = true;
        },
        setGraphViewError: (state, action) => {
            state.error = action.payload;
        },
        setGraphViewStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setGraphViewEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        setGraphViewLoaded: (state, action) => {
            state.loaded = action.payload;
        },
        updateSelectedAccounts: (state, action) => {
            state.selectedAccounts = action.payload;
        },
        updateSelectedSimulations: (state, action) => {
            state.selectedSimulations = action.payload;
        },
        setCombineAccounts: (state, action) => {
            state.combineAccounts = action.payload;
        },
    },
});
export const { setGraphViewData, setGraphViewError, setGraphViewStartDate, setGraphViewEndDate, setGraphViewLoaded, updateSelectedAccounts, updateSelectedSimulations, setCombineAccounts, } = graphViewSlice.actions;
export default graphViewSlice.reducer;
