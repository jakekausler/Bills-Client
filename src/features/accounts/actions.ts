import { AppThunk } from '../../store';
import { Account } from '../../types/types';
import { fetchAccounts, fetchAddAccount, fetchEditAccounts } from './api';
import { setAccounts, setAccountsError, setAccountsLoaded } from './slice';

export const loadAccounts = (): AppThunk => async (dispatch) => {
  try {
    const accounts = await fetchAccounts();

    dispatch(setAccounts(accounts));
    dispatch(setAccountsLoaded(true));
  } catch {
    dispatch(setAccountsError('Failed to load accounts'));
  }
};

export const addAccount =
  (account: Account): AppThunk =>
  async (dispatch, getState) => {
    try {
      const accounts = getState().accounts.accounts;
      const newAccountId = await fetchAddAccount(account);
      dispatch(
        setAccounts([
          ...accounts,
          {
            ...account,
            id: newAccountId,
          },
        ]),
      );
    } catch (error) {
      console.error('Failed to add account:', error);
      dispatch(setAccountsError(error instanceof Error ? error.message : 'Failed to add account'));
      throw error;
    }
  };

export const editAccounts =
  (accounts: Account[]): AppThunk =>
  async (dispatch) => {
    try {
      await fetchEditAccounts(accounts);
      dispatch(setAccounts(accounts));
    } catch (error) {
      console.error('Failed to edit accounts:', error);
      dispatch(setAccountsError(error instanceof Error ? error.message : 'Failed to edit accounts'));
      throw error;
    }
  };
