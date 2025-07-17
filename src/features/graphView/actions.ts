import { AppThunk } from '../../store';
import { setGraphViewData, setGraphViewError, setGraphViewLoaded } from './slice';
import { fetchGraphViewData } from './api';

export const loadGraphViewData =
  (accountIds: string[], selectedSimulations: string[], startDate: string, endDate: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setGraphViewLoaded(false));
      const data = await fetchGraphViewData(accountIds, selectedSimulations, startDate, endDate);
      dispatch(setGraphViewData(data));
    } catch (error) {
      console.error('Failed to load graph view data', error);
      dispatch(setGraphViewError('Failed to load graph view data'));
    }
  };
