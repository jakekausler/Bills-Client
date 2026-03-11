import { describe, it, expect } from 'vitest';
import {
  selectAllAccounts,
  selectSortedAccounts,
  selectVisibleAccounts,
  selectAccountsLoaded,
  selectSelectedAccount,
} from './select';
import { Account } from '../../types/types';

const makeAccount = (overrides: Partial<Account> = {}): Account => ({
  id: 'acc-1',
  name: 'Test Account',
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
  maximumBalance: null,
  performsPulls: false,
  performsPushes: false,
  pushStart: null,
  pushEnd: null,
  pushAccount: null,
  ...overrides,
});

// Minimal RootState shape needed for accounts selectors
const makeRootState = (accountsOverrides = {}) =>
  ({
    accounts: {
      accounts: [],
      accountsLoaded: false,
      accountsError: '',
      selectedAccount: null,
      ...accountsOverrides,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

describe('accounts selectors', () => {
  describe('selectAllAccounts', () => {
    it('returns the accounts array from state', () => {
      const accounts = [makeAccount({ id: 'acc-1' }), makeAccount({ id: 'acc-2' })];
      const state = makeRootState({ accounts });
      expect(selectAllAccounts(state)).toEqual(accounts);
    });

    it('returns empty array when no accounts', () => {
      const state = makeRootState({ accounts: [] });
      expect(selectAllAccounts(state)).toEqual([]);
    });
  });

  describe('selectAccountsLoaded', () => {
    it('returns false when accounts are not loaded', () => {
      const state = makeRootState({ accountsLoaded: false });
      expect(selectAccountsLoaded(state)).toBe(false);
    });

    it('returns true when accounts are loaded', () => {
      const state = makeRootState({ accountsLoaded: true });
      expect(selectAccountsLoaded(state)).toBe(true);
    });
  });

  describe('selectSelectedAccount', () => {
    it('returns null when no account is selected', () => {
      const state = makeRootState({ selectedAccount: null });
      expect(selectSelectedAccount(state)).toBeNull();
    });

    it('returns the selected account', () => {
      const account = makeAccount({ id: 'acc-selected', name: 'Selected' });
      const state = makeRootState({ selectedAccount: account });
      expect(selectSelectedAccount(state)).toEqual(account);
    });
  });

  describe('selectSortedAccounts', () => {
    it('returns empty array when no accounts', () => {
      const state = makeRootState({ accounts: [] });
      expect(selectSortedAccounts(state)).toEqual([]);
    });

    it('sorts accounts of the same type by name alphabetically', () => {
      const accounts = [
        makeAccount({ id: 'sav-z', name: 'Zeta Savings', type: 'Savings' }),
        makeAccount({ id: 'sav-a', name: 'Alpha Savings', type: 'Savings' }),
        makeAccount({ id: 'sav-m', name: 'Middle Savings', type: 'Savings' }),
      ];
      const state = makeRootState({ accounts });
      const sorted = selectSortedAccounts(state);
      expect(sorted[0].name).toBe('Alpha Savings');
      expect(sorted[1].name).toBe('Middle Savings');
      expect(sorted[2].name).toBe('Zeta Savings');
    });

    it('does not mutate the original accounts array', () => {
      const accounts = [
        makeAccount({ id: 'inv', name: 'Brokerage', type: 'Investment' }),
        makeAccount({ id: 'chk', name: 'Checking', type: 'Checking' }),
      ];
      const state = makeRootState({ accounts });
      selectSortedAccounts(state);
      // Original should remain in insertion order
      expect(state.accounts.accounts[0].type).toBe('Investment');
    });

    it('returns a memoized result for the same input', () => {
      const accounts = [makeAccount({ id: 'acc-1', name: 'Checking', type: 'Checking' })];
      const state = makeRootState({ accounts });
      const first = selectSortedAccounts(state);
      const second = selectSortedAccounts(state);
      expect(first).toBe(second);
    });
  });

  describe('selectVisibleAccounts', () => {
    it('returns only non-hidden accounts', () => {
      const accounts = [
        makeAccount({ id: 'visible', name: 'Visible', hidden: false }),
        makeAccount({ id: 'hidden', name: 'Hidden', hidden: true }),
      ];
      const state = makeRootState({ accounts });
      const visible = selectVisibleAccounts(state);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('visible');
    });

    it('returns all accounts when none are hidden', () => {
      const accounts = [
        makeAccount({ id: 'acc-1', hidden: false }),
        makeAccount({ id: 'acc-2', hidden: false }),
      ];
      const state = makeRootState({ accounts });
      expect(selectVisibleAccounts(state)).toHaveLength(2);
    });

    it('returns empty array when all accounts are hidden', () => {
      const accounts = [
        makeAccount({ id: 'acc-1', hidden: true }),
        makeAccount({ id: 'acc-2', hidden: true }),
      ];
      const state = makeRootState({ accounts });
      expect(selectVisibleAccounts(state)).toHaveLength(0);
    });

    it('returns empty array when there are no accounts', () => {
      const state = makeRootState({ accounts: [] });
      expect(selectVisibleAccounts(state)).toEqual([]);
    });

    it('returns a memoized result for the same input', () => {
      const accounts = [makeAccount({ id: 'acc-1', hidden: false })];
      const state = makeRootState({ accounts });
      const first = selectVisibleAccounts(state);
      const second = selectVisibleAccounts(state);
      expect(first).toBe(second);
    });
  });
});
