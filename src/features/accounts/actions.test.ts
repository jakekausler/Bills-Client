import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadAccounts, addAccount } from './actions';
import { setAccounts, setAccountsError, setAccountsLoaded } from './slice';
import { makeAccount } from '../../test/factories';

// Mock the API functions
vi.mock('./api', () => ({
  fetchAccounts: vi.fn(),
  fetchAddAccount: vi.fn(),
  fetchEditAccounts: vi.fn(),
}));

import { fetchAccounts, fetchAddAccount } from './api';

const mockFetchAccounts = fetchAccounts as ReturnType<typeof vi.fn>;
const mockFetchAddAccount = fetchAddAccount as ReturnType<typeof vi.fn>;

describe('accounts actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadAccounts', () => {
    it('clears error, sets loaded to false, fetches accounts, and dispatches setAccounts', async () => {
      const accounts = [makeAccount({ id: 'acc-1' }), makeAccount({ id: 'acc-2', name: 'Savings' })];
      mockFetchAccounts.mockResolvedValue(accounts);

      const dispatch = vi.fn();
      const thunk = loadAccounts();

      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(setAccountsError(''));
      expect(dispatch).toHaveBeenCalledWith(setAccountsLoaded(false));
      expect(dispatch).toHaveBeenCalledWith(setAccounts(accounts));
      expect(mockFetchAccounts).toHaveBeenCalledTimes(1);
    });

    it('sets loaded to true and error message on failure', async () => {
      const error = new Error('Network error');
      mockFetchAccounts.mockRejectedValue(error);

      const dispatch = vi.fn();
      const thunk = loadAccounts();

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toThrow('Network error');

      expect(dispatch).toHaveBeenCalledWith(setAccountsError(''));
      expect(dispatch).toHaveBeenCalledWith(setAccountsLoaded(false));
      expect(dispatch).toHaveBeenCalledWith(setAccountsLoaded(true));
      expect(dispatch).toHaveBeenCalledWith(setAccountsError('Failed to load accounts'));
    });
  });

  describe('addAccount', () => {
    it('clears error, fetches new account ID, and dispatches setAccounts with new account appended', async () => {
      const existingAccounts = [makeAccount({ id: 'acc-1' })];
      const newAccount = makeAccount({ id: 'temp-id', name: 'New Account' });
      const newAccountId = 'acc-2';

      mockFetchAddAccount.mockResolvedValue(newAccountId);

      const dispatch = vi.fn();
      const getState = () => ({
        accounts: {
          accounts: existingAccounts,
        },
      });

      const thunk = addAccount(newAccount);
      await thunk(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setAccountsError(''));
      expect(mockFetchAddAccount).toHaveBeenCalledWith(newAccount);

      // Verify setAccounts was called with the updated accounts list
      const setAccountsCall = dispatch.mock.calls.find((call: any) => call[0]?.type === setAccounts.type);
      expect(setAccountsCall).toBeDefined();
      const dispatchedAccounts = setAccountsCall?.[0]?.payload;
      expect(dispatchedAccounts).toHaveLength(2);
      expect(dispatchedAccounts[1].id).toBe(newAccountId);
      expect(dispatchedAccounts[1].name).toBe('New Account');
    });

    it('dispatches error message on failure', async () => {
      const newAccount = makeAccount({ id: 'temp-id', name: 'New Account' });
      const error = new Error('Account creation failed');
      mockFetchAddAccount.mockRejectedValue(error);

      const dispatch = vi.fn();
      const getState = () => ({
        accounts: {
          accounts: [],
        },
      });

      const thunk = addAccount(newAccount);
      await expect(thunk(dispatch, getState, undefined)).rejects.toThrow('Account creation failed');

      expect(dispatch).toHaveBeenCalledWith(setAccountsError(''));
      expect(dispatch).toHaveBeenCalledWith(setAccountsError('Account creation failed'));
    });

    it('handles non-Error objects in catch clause', async () => {
      const newAccount = makeAccount({ id: 'temp-id' });
      mockFetchAddAccount.mockRejectedValue('Unknown error');

      const dispatch = vi.fn();
      const getState = () => ({
        accounts: {
          accounts: [],
        },
      });

      const thunk = addAccount(newAccount);
      await expect(thunk(dispatch, getState, undefined)).rejects.toBe('Unknown error');

      expect(dispatch).toHaveBeenCalledWith(setAccountsError('Failed to add account'));
    });
  });
});
