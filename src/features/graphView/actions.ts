import { AppThunk } from '../../store';
import { setGraphViewData, setGraphViewError, setGraphViewLoaded } from './slice';
import { fetchGraphViewData } from './api';

let loadSequence = 0;

export const loadGraphViewData =
  (accountIds: string[], selectedSimulations: string[], startDate: string, endDate: string, combineAccounts: boolean): AppThunk =>
  async (dispatch) => {
    const thisSequence = ++loadSequence;
    try {
      dispatch(setGraphViewLoaded(false));
      const data = await fetchGraphViewData(accountIds, selectedSimulations, startDate, endDate, combineAccounts);
      if (thisSequence !== loadSequence) return; // stale, skip
      dispatch(setGraphViewData(data));
    } catch (error) {
      console.error('Failed to load graph view data', error);
      dispatch(setGraphViewLoaded(true));
      dispatch(setGraphViewError('Failed to load graph view data'));
      throw error;
    }
  };
