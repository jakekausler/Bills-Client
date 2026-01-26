import { setGraphViewData, setGraphViewError, setGraphViewLoaded } from './slice';
import { fetchGraphViewData } from './api';
export const loadGraphViewData = (accountIds, selectedSimulations, startDate, endDate, combineAccounts) => async (dispatch) => {
    try {
        dispatch(setGraphViewLoaded(false));
        const data = await fetchGraphViewData(accountIds, selectedSimulations, startDate, endDate, combineAccounts);
        dispatch(setGraphViewData(data));
    }
    catch (error) {
        console.error('Failed to load graph view data', error);
        dispatch(setGraphViewError('Failed to load graph view data'));
    }
};
