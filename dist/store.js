import { configureStore } from '@reduxjs/toolkit';
import activitiesSlice from './features/activities/slice';
import accountsSlice from './features/accounts/slice';
import graphSlice from './features/graph/slice';
import categoriesSlice from './features/categories/slice';
import simulationsSlice from './features/simulations/slice';
import calendarSlice from './features/calendar/slice';
import flowSlice from './features/flow/slice';
import graphViewSlice from './features/graphView/slice';
import monteCarloSlice from './features/monteCarlo/slice';
import moneyMovementSlice from './features/moneyMovement/slice';
import healthcareReducer from './features/healthcare/slice';
export const store = configureStore({
    reducer: {
        activities: activitiesSlice,
        accounts: accountsSlice,
        graph: graphSlice,
        categories: categoriesSlice,
        calendar: calendarSlice,
        simulations: simulationsSlice,
        flow: flowSlice,
        graphView: graphViewSlice,
        monteCarlo: monteCarloSlice,
        moneyMovement: moneyMovementSlice,
        healthcare: healthcareReducer,
    },
});
