import { AppThunk } from '../../store';
import { Account } from '../../types/types';
import { fetchGraphData } from './api';
import { setGraphData, setGraphError, updateGraphLoaded } from './slice';

let loadSequence = 0;

export const loadGraphData =
  (account: Account, startDate: Date, endDate: Date): AppThunk =>
  async (dispatch) => {
    const thisSequence = ++loadSequence;
    try {
      dispatch(updateGraphLoaded(false));
      const data = await fetchGraphData(account, startDate, endDate);
      if (thisSequence !== loadSequence) return; // stale, skip
      dispatch(setGraphData(data));
    } catch (error) {
      console.error('Failed to load graph data', error);
      dispatch(updateGraphLoaded(true));
      dispatch(setGraphError('Failed to load graph data'));
      throw error;
    }
  };
