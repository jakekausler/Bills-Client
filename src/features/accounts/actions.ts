import { AppThunk } from '../../store';
import { Account } from '../../types/types';
import { fetchAccounts, fetchAddAccount, fetchEditAccounts } from './api';
import { setAccounts, setAccountsError, setAccountsLoaded } from './slice';

export const loadAccounts = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setAccountsError(''));
    dispatch(setAccountsLoaded(false));
    const accounts = await fetchAccounts();

    dispatch(setAccounts(accounts));
  } catch (error) {
    console.error('Failed to load accounts:', error);
    dispatch(setAccountsLoaded(true));
    dispatch(setAccountsError('Failed to load accounts'));
    throw error;
  }
};

export const addAccount =
  (account: Account): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setAccountsError(''));
      const newAccountId = await fetchAddAccount(account);
      const accounts = getState().accounts.accounts;
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
      dispatch(setAccountsError(''));
      await fetchEditAccounts(accounts);
      dispatch(setAccounts(accounts));
    } catch (error) {
      console.error('Failed to edit accounts:', error);
      dispatch(setAccountsError(error instanceof Error ? error.message : 'Failed to edit accounts'));
      throw error;
    }
  };
