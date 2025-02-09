import { AppThunk } from '../../store';
import { Account } from '../../types/types';
import { fetchGraphData } from './api';
import { setGraphData, setGraphError, updateGraphLoaded } from './slice';

export const loadGraphData =
  (account: Account, startDate: Date, endDate: Date): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(updateGraphLoaded(false));
      const data = await fetchGraphData(account, startDate, endDate);
      dispatch(setGraphData(data));
    } catch (error) {
      console.error('Failed to load graph data', error);
      dispatch(setGraphError('Failed to load graph data'));
    }
  };
