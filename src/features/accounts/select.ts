import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { sort } from "../../utils/array";

const compareTypes = (typeA: string, typeB: string) => {
  const types = ["Checking", "Savings", "Credit", "Loan", "Investment"];
  const indexA = types.indexOf(typeA) || types.length;
  const indexB = types.indexOf(typeB) || types.length;
  return indexA - indexB;
};

export const selectAllAccounts = (state: RootState) => state.accounts.accounts;

export const selectSortedAccounts = createSelector(
  [selectAllAccounts],
  (accounts) => sort(accounts, (a, b) => compareTypes(a.type, b.type) ? 0 : a.name.localeCompare(b.name))
);

export const selectVisibleAccounts = createSelector(
  [selectSortedAccounts],
  (accounts) => accounts.filter((account) => !account.hidden)
);

export const selectAccountsLoaded = (state: RootState) =>
  state.accounts.accountsLoaded;

export const selectAccountsError = (state: RootState) =>
  state.accounts.accountsError;

export const selectSelectedAccount = (state: RootState) =>
  state.accounts.selectedAccount;
