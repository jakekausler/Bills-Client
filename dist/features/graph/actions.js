import { fetchGraphData } from './api';
import { setGraphData, setGraphError, updateGraphLoaded } from './slice';
export const loadGraphData = (account, startDate, endDate) => async (dispatch) => {
    try {
        dispatch(updateGraphLoaded(false));
        const data = await fetchGraphData(account, startDate, endDate);
        dispatch(setGraphData(data));
    }
    catch (error) {
        console.error('Failed to load graph data', error);
        dispatch(setGraphError('Failed to load graph data'));
    }
};
