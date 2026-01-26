import { fetchAccounts, fetchAddAccount, fetchEditAccounts } from './api';
import { setAccounts, setAccountsError, setAccountsLoaded } from './slice';
export const loadAccounts = () => async (dispatch) => {
    try {
        const accounts = await fetchAccounts();
        dispatch(setAccounts(accounts));
        dispatch(setAccountsLoaded(true));
    }
    catch {
        dispatch(setAccountsError('Failed to load accounts'));
    }
};
export const addAccount = (account) => async (dispatch, getState) => {
    const accounts = getState().accounts.accounts;
    const newAccountId = await fetchAddAccount(account);
    dispatch(setAccounts([
        ...accounts,
        {
            ...account,
            id: newAccountId,
        },
    ]));
};
export const editAccounts = (accounts) => async (dispatch) => {
    await fetchEditAccounts(accounts);
    dispatch(setAccounts(accounts));
};
