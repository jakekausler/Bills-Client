import { createSlice } from '@reduxjs/toolkit';
import { toDateString } from '../../utils/date';
const initialState = {
    activities: [],
    activitiesLoaded: false,
    activitiesError: '',
    selectedActivity: null,
    selectedActivityBillId: null,
    selectedActivityInterestId: null,
    selectedActivityLoaded: false,
    selectedBill: null,
    selectedBillLoaded: false,
    interests: null,
    interestsLoaded: false,
    startDate: toDateString(new Date(new Date().setMonth(new Date().getUTCMonth() - 1))),
    endDate: toDateString(new Date(new Date().setMonth(new Date().getUTCMonth() + 3))),
    lastDate: toDateString(new Date()),
    names: {},
    namesLoaded: false,
};
export const activitiesSlice = createSlice({
    name: 'activities',
    initialState,
    reducers: {
        setActivities: (state, action) => {
            state.activities = action.payload;
            state.activitiesLoaded = true;
        },
        setActivitiesError: (state, action) => {
            state.activitiesError = action.payload;
        },
        setActivitiesLoaded: (state, action) => {
            state.activitiesLoaded = action.payload;
        },
        setSelectedActivity: (state, action) => {
            state.selectedActivity = action.payload;
            if (!action.payload) {
                state.selectedActivityBillId = null;
                state.selectedActivityInterestId = null;
            }
            state.selectedActivityLoaded = true;
        },
        setSelectedActivityBillId: (state, action) => {
            state.selectedActivityBillId = action.payload;
        },
        setSelectedActivityInterestId: (state, action) => {
            state.selectedActivityInterestId = action.payload;
        },
        setSelectedActivityLoaded: (state, action) => {
            state.selectedActivityLoaded = action.payload;
        },
        setSelectedBill: (state, action) => {
            state.selectedBill = action.payload;
            state.selectedBillLoaded = true;
        },
        setSelectedBillLoaded: (state, action) => {
            state.selectedBillLoaded = action.payload;
        },
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        newActivity: (state) => {
            state.selectedActivity = {
                date: state.lastDate,
                dateIsVariable: false,
                dateVariable: null,
                name: '',
                category: '',
                amount: 0,
                flag: false,
                flagColor: null,
                amountIsVariable: false,
                amountVariable: null,
                isTransfer: false,
                from: null,
                to: null,
            };
            state.selectedActivityLoaded = true;
        },
        duplicateActivity: (state, action) => {
            state.selectedActivity = {
                date: state.lastDate,
                dateIsVariable: false,
                dateVariable: null,
                name: `Copy of ${action.payload.name}`,
                category: action.payload.category,
                amount: action.payload.amount,
                flag: action.payload.flag,
                flagColor: action.payload.flagColor,
                amountIsVariable: action.payload.amountIsVariable,
                amountVariable: action.payload.amountVariable,
                isTransfer: action.payload.isTransfer,
                from: action.payload.from,
                to: action.payload.to,
            };
            state.selectedActivityLoaded = true;
        },
        newBill: (state) => {
            state.selectedBill = {
                startDate: state.lastDate,
                startDateIsVariable: false,
                startDateVariable: null,
                endDate: null,
                endDateIsVariable: false,
                endDateVariable: null,
                everyN: 1,
                periods: 'month',
                isAutomatic: false,
                name: '',
                category: '',
                amount: 0,
                flag: false,
                flagColor: null,
                amountIsVariable: false,
                amountVariable: null,
                isTransfer: false,
                from: null,
                to: null,
                annualStartDate: null,
                annualEndDate: null,
                annualStartDateIsVariable: false,
                annualEndDateIsVariable: false,
                annualStartDateVariable: null,
                annualEndDateVariable: null,
                increaseBy: 0.03,
                increaseByIsVariable: true,
                increaseByVariable: 'INFLATION',
                increaseByDate: '01/01',
            };
            state.selectedBillLoaded = true;
        },
        updateActivity: (state, action) => {
            state.selectedActivity = action.payload;
            state.lastDate = action.payload.date;
            state.selectedActivityLoaded = true;
        },
        updateBill: (state, action) => {
            state.selectedBill = action.payload;
            state.lastDate = action.payload.startDate;
            state.selectedBillLoaded = true;
        },
        updateInterests: (state, action) => {
            state.interests = action.payload;
            state.interestsLoaded = true;
        },
        setInterestsLoaded: (state, action) => {
            state.interestsLoaded = action.payload;
        },
        updateNames: (state, action) => {
            state.names = action.payload;
            state.namesLoaded = true;
        },
        setNamesLoaded: (state, action) => {
            state.namesLoaded = action.payload;
        },
    },
});
export const { setActivities, setActivitiesError, setSelectedActivity, setSelectedActivityBillId, setSelectedActivityInterestId, setSelectedBill, setStartDate, setEndDate, newActivity, newBill, duplicateActivity, updateActivity, updateBill, updateInterests, updateNames, setSelectedActivityLoaded, setSelectedBillLoaded, setInterestsLoaded, setNamesLoaded, setActivitiesLoaded, } = activitiesSlice.actions;
export default activitiesSlice.reducer;
