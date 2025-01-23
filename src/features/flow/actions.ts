import { AppThunk } from "../../store";
import { fetchFlow } from "./api";
import { selectFlowEndDate, selectFlowStartDate, selectSelectedAccounts } from "./selector";
import { setFlow, setFlowLoaded } from "./slice";

export const loadFlow = (): AppThunk => async (dispatch, getState) => {
  dispatch(setFlowLoaded(false));
  const state = getState();
  const selectedAccounts = selectSelectedAccounts(state);
  const startDate = selectFlowStartDate(state);
  const endDate = selectFlowEndDate(state);

  const flow = await fetchFlow(selectedAccounts, startDate, endDate);
  dispatch(setFlow(flow));
};
