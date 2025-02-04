import { AppThunk } from '../../store';
import { setMonteCarloData, setMonteCarloError, setMonteCarloLoaded } from './slice';
import { fetchMonteCarloData } from './api';

export const loadMonteCarloData =
  (startDate: string, endDate: string, accountIds: string[], nSimulations: number): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setMonteCarloLoaded(false));
      const data = await fetchMonteCarloData(startDate, endDate, accountIds, nSimulations);
      dispatch(setMonteCarloData(data));
      dispatch(setMonteCarloLoaded(true));
    } catch (error) {
      console.error('Failed to load monte carlo data', error);
      dispatch(setMonteCarloError('Failed to load monte carlo data'));
    }
  };
