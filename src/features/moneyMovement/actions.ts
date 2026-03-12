import { AppThunk } from '../../store';
import { fetchMoneyMovementChart } from './api';
import { setMoneyMovementData, setMoneyMovementLoading, setMoneyMovementError } from './slice';
import { selectMoneyMovementStartDate, selectMoneyMovementEndDate } from './select';

let loadSequence = 0;

export const loadMoneyMovementChart = (): AppThunk => async (dispatch, getState) => {
  const thisSequence = ++loadSequence;
  try {
    dispatch(setMoneyMovementLoading(true));
    const state = getState();
    const startDate = selectMoneyMovementStartDate(state);
    const endDate = selectMoneyMovementEndDate(state);
    const data = await fetchMoneyMovementChart(startDate, endDate);
    if (thisSequence !== loadSequence) return; // stale, skip
    dispatch(setMoneyMovementData(data));
  } catch (error) {
    console.error('Failed to load money movement chart', error);
    dispatch(setMoneyMovementLoading(false));
    dispatch(setMoneyMovementError('Failed to load money movement chart'));
    throw error;
  }
};
