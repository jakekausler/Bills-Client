import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const initialState = {
    bills: [],
    billsLoaded: false,
    billsError: '',
    selectedAccounts: [],
    startDate: dayjs.utc().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs.utc().endOf('month').format('YYYY-MM-DD'),
};
export const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setBills: (state, action) => {
            state.bills = action.payload;
            state.billsLoaded = true;
        },
        setBillsError: (state, action) => {
            state.billsError = action.payload;
        },
        updateStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        updateEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        updateSelectedAccounts: (state, action) => {
            state.selectedAccounts = action.payload;
        },
        setBillsLoaded: (state, action) => {
            state.billsLoaded = action.payload;
        },
    },
});
export const { setBills, setBillsError, updateStartDate, updateEndDate, updateSelectedAccounts, setBillsLoaded } = calendarSlice.actions;
export default calendarSlice.reducer;
