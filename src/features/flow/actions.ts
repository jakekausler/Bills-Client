import { AppThunk } from '../../store';
import { fetchFlow } from './api';
import { selectFlowEndDate, selectFlowStartDate, selectFlowSelectedAccounts } from './selector';
import { setFlow, setFlowError, setFlowLoaded } from './slice';

export const loadFlow = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setFlowLoaded(false));
    const state = getState();
    const selectedAccounts = selectFlowSelectedAccounts(state);
    const startDate = selectFlowStartDate(state);
    const endDate = selectFlowEndDate(state);

    const flow = await fetchFlow(selectedAccounts, startDate, endDate);
    dispatch(setFlow(flow));
  } catch (error) {
    console.error('Failed to load flow:', error);
    dispatch(setFlowError(error instanceof Error ? error.message : 'Failed to load flow'));
    throw error;
  }
};
