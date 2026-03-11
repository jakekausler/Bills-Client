import { describe, it, expect } from 'vitest';
import reducer, {
  setAccounts,
  setAccountsError,
  setSelectedAccount,
  setAccountsLoaded,
} from './slice';
import { Account } from '../../types/types';

// Project test conventions:
// - Framework: Vitest with globals configured, but imports used for clarity
// - Assertions: expect() from vitest
// - Test structure: describe/it blocks

const makeAccount = (overrides: Partial<Account> = {}): Account => ({
  id: 'acc-1',
  name: 'Checking Account',
  balance: 1000,
  hidden: false,
  type: 'Checking',
  pullPriority: 1,
  interestTaxRate: 0,
  withdrawalTaxRate: 0,
  earlyWithdrawlPenalty: 0,
  earlyWithdrawlDate: null,
  interestPayAccount: null,
  interestAppliesToPositiveBalance: false,
  usesRMD: false,
  accountOwnerDOB: null,
  rmdAccount: null,
  minimumBalance: null,
  minimumPullAmount: null,
  performsPulls: false,
  performsPushes: false,
  pushStart: null,
  pushEnd: null,
  pushAccount: null,
  ...overrides,
});

const initialState = {
  accounts: [],
  accountsLoaded: false,
  accountsError: '',
  selectedAccount: null,
};

describe('accountsSlice reducer', () => {
  describe('initial state', () => {
    it('returns the initial state when called with undefined state', () => {
      const state = reducer(undefined, { type: '@@INIT' });
      expect(state.accounts).toEqual([]);
      expect(state.accountsLoaded).toBe(false);
      expect(state.accountsError).toBe('');
      expect(state.selectedAccount).toBeNull();
    });
  });

  describe('setAccounts', () => {
    it('sets accounts and marks them as loaded', () => {
      const accounts = [makeAccount({ id: 'acc-1', name: 'Checking' })];
      const state = reducer(initialState, setAccounts(accounts));
      expect(state.accounts).toEqual(accounts);
      expect(state.accountsLoaded).toBe(true);
    });

    it('replaces existing accounts with new accounts', () => {
      const stateWithAccounts = {
        ...initialState,
        accounts: [makeAccount({ id: 'acc-old', name: 'Old Account' })],
        accountsLoaded: true,
      };
      const newAccounts = [makeAccount({ id: 'acc-new', name: 'New Account' })];
      const state = reducer(stateWithAccounts, setAccounts(newAccounts));
      expect(state.accounts).toEqual(newAccounts);
      expect(state.accounts).toHaveLength(1);
      expect(state.accounts[0].id).toBe('acc-new');
    });

    it('sets accounts to empty array when given empty array', () => {
      const stateWithAccounts = {
        ...initialState,
        accounts: [makeAccount()],
        accountsLoaded: true,
      };
      const state = reducer(stateWithAccounts, setAccounts([]));
      expect(state.accounts).toEqual([]);
      expect(state.accountsLoaded).toBe(true);
    });

    it('sets multiple accounts', () => {
      const accounts = [
        makeAccount({ id: 'acc-1', name: 'Checking' }),
        makeAccount({ id: 'acc-2', name: 'Savings', type: 'Savings' }),
        makeAccount({ id: 'acc-3', name: 'Credit Card', type: 'Credit' }),
      ];
      const state = reducer(initialState, setAccounts(accounts));
      expect(state.accounts).toHaveLength(3);
      expect(state.accountsLoaded).toBe(true);
    });
  });

  describe('setAccountsError', () => {
    it('sets the error message', () => {
      const state = reducer(initialState, setAccountsError('Failed to load accounts'));
      expect(state.accountsError).toBe('Failed to load accounts');
    });

    it('clears an existing error when set to empty string', () => {
      const stateWithError = { ...initialState, accountsError: 'Previous error' };
      const state = reducer(stateWithError, setAccountsError(''));
      expect(state.accountsError).toBe('');
    });

    it('does not affect other state fields', () => {
      const account = makeAccount();
      const stateWithData = { ...initialState, accounts: [account], accountsLoaded: true };
      const state = reducer(stateWithData, setAccountsError('Some error'));
      expect(state.accounts).toEqual([account]);
      expect(state.accountsLoaded).toBe(true);
    });
  });

  describe('setSelectedAccount', () => {
    it('sets the selected account', () => {
      const account = makeAccount({ id: 'acc-1', name: 'My Account' });
      const state = reducer(initialState, setSelectedAccount(account));
      expect(state.selectedAccount).toEqual(account);
    });

    it('replaces the previously selected account', () => {
      const firstAccount = makeAccount({ id: 'acc-1', name: 'First' });
      const secondAccount = makeAccount({ id: 'acc-2', name: 'Second' });
      const stateWithSelected = { ...initialState, selectedAccount: firstAccount };
      const state = reducer(stateWithSelected, setSelectedAccount(secondAccount));
      expect(state.selectedAccount).toEqual(secondAccount);
      expect(state.selectedAccount?.id).toBe('acc-2');
    });

    it('does not affect accounts list', () => {
      const accounts = [makeAccount({ id: 'acc-1' }), makeAccount({ id: 'acc-2' })];
      const stateWithAccounts = { ...initialState, accounts };
      const selected = makeAccount({ id: 'acc-1' });
      const state = reducer(stateWithAccounts, setSelectedAccount(selected));
      expect(state.accounts).toHaveLength(2);
    });
  });

  describe('setAccountsLoaded', () => {
    it('sets accountsLoaded to true', () => {
      const state = reducer(initialState, setAccountsLoaded(true));
      expect(state.accountsLoaded).toBe(true);
    });

    it('sets accountsLoaded to false', () => {
      const stateLoaded = { ...initialState, accountsLoaded: true };
      const state = reducer(stateLoaded, setAccountsLoaded(false));
      expect(state.accountsLoaded).toBe(false);
    });

    it('does not affect accounts list', () => {
      const accounts = [makeAccount()];
      const stateWithAccounts = { ...initialState, accounts };
      const state = reducer(stateWithAccounts, setAccountsLoaded(true));
      expect(state.accounts).toEqual(accounts);
    });
  });
});
