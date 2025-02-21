import { AppThunk } from '../../store';
import { fetchMoneyMovementChart } from './api';
import { setMoneyMovementData, setMoneyMovementLoading, setMoneyMovementError } from './slice';
import { selectMoneyMovementStartDate, selectMoneyMovementEndDate } from './select';

export const loadMoneyMovementChart = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setMoneyMovementLoading(true));
    const state = getState();
    const startDate = selectMoneyMovementStartDate(state);
    const endDate = selectMoneyMovementEndDate(state);
    const data = await fetchMoneyMovementChart(startDate, endDate);
    dispatch(setMoneyMovementData(data));
  } catch (error) {
    console.error('Failed to load money movement chart', error);
    dispatch(setMoneyMovementError('Failed to load money movement chart'));
  }
};
