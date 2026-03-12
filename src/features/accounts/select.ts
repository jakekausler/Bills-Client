import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { sort } from '../../utils/array';

export const ACCOUNT_TYPE_ORDER = ['Checking', 'Savings', 'Credit', 'Loan', 'Investment'] as const;

const compareTypes = (typeA: string, typeB: string) => {
  const indexA = ACCOUNT_TYPE_ORDER.indexOf(typeA as never);
  const indexB = ACCOUNT_TYPE_ORDER.indexOf(typeB as never);
  return (indexA === -1 ? ACCOUNT_TYPE_ORDER.length : indexA) - (indexB === -1 ? ACCOUNT_TYPE_ORDER.length : indexB);
};

export const selectAllAccounts = (state: RootState) => state.accounts.accounts;

export const selectSortedAccounts = createSelector([selectAllAccounts], (accounts) =>
  sort(accounts, (a, b) => compareTypes(a.type, b.type) || a.name.localeCompare(b.name)),
);

export const selectVisibleAccounts = createSelector([selectSortedAccounts], (accounts) =>
  accounts.filter((account) => !account.hidden),
);

export const selectAccountsLoaded = (state: RootState) => state.accounts.accountsLoaded;

export const selectAccountsError = (state: RootState) => state.accounts.accountsError;

export const selectSelectedAccount = (state: RootState) => state.accounts.selectedAccount;
