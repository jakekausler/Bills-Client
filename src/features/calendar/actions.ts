import { AppThunk } from '../../store';
import { selectStartDate } from './select';
import { selectEndDate } from './select';
import { selectCalendarSelectedAccounts } from './select';
import { setBills, setBillsError, setBillsLoaded } from './slice';
import { fetchBills } from './api';

let loadSequence = 0;

export const loadCalendar = (): AppThunk => async (dispatch, getState) => {
  const thisSequence = ++loadSequence;
  try {
    dispatch(setBillsLoaded(false));
    const state = getState();
    const startDate = selectStartDate(state);
    const endDate = selectEndDate(state);
    const selectedAccounts = selectCalendarSelectedAccounts(state);

    const bills = await fetchBills(startDate, endDate, selectedAccounts);
    if (thisSequence !== loadSequence) return; // stale, skip
    dispatch(setBills(bills));
  } catch (error) {
    console.error('Failed to load calendar:', error);
    dispatch(setBillsError(error instanceof Error ? error.message : 'Failed to load calendar'));
    throw error;
  }
};
