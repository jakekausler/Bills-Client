import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const initialState = {
    flow: {
        nodes: [],
        links: [],
    },
    flowLoaded: false,
    flowError: '',
    selectedAccounts: [],
    startDate: dayjs.utc().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs.utc().endOf('month').format('YYYY-MM-DD'),
};
export const flowSlice = createSlice({
    name: 'flow',
    initialState,
    reducers: {
        updateSelectedAccounts: (state, action) => {
            state.selectedAccounts = action.payload;
        },
        setFlow: (state, action) => {
            state.flow = action.payload;
            state.flowLoaded = true;
        },
        setFlowError: (state, action) => {
            state.flowError = action.payload;
        },
        setFlowLoaded: (state, action) => {
            state.flowLoaded = action.payload;
        },
        updateStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        updateEndDate: (state, action) => {
            state.endDate = action.payload;
        },
    },
});
export const { updateSelectedAccounts, setFlow, setFlowError, setFlowLoaded, updateStartDate, updateEndDate } = flowSlice.actions;
export default flowSlice.reducer;
