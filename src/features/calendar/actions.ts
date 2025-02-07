import { AppThunk } from '../../store';
import { selectStartDate } from './select';
import { selectEndDate } from './select';
import { selectSelectedAccounts } from './select';
import { setBills, setBillsLoaded } from './slice';
import { fetchBills } from './api';

export const loadCalendar = (): AppThunk => async (dispatch, getState) => {
  dispatch(setBillsLoaded(false));
  const state = getState();
  const startDate = selectStartDate(state);
  const endDate = selectEndDate(state);
  const selectedAccounts = selectSelectedAccounts(state);

  const bills = await fetchBills(startDate, endDate, selectedAccounts);
  dispatch(setBills(bills));
};
