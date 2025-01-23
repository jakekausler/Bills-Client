import { AppThunk } from "../../store";
import { fetchAccounts } from "./api";
import { setAccounts, setAccountsError, setAccountsLoaded } from "./slice";

export const loadAccounts = (): AppThunk => async (dispatch) => {
  try {
    const accounts = await fetchAccounts();

    dispatch(setAccounts(accounts));
    dispatch(setAccountsLoaded(true));
  } catch (error) {
    dispatch(setAccountsError("Failed to load accounts"));
  }
};
