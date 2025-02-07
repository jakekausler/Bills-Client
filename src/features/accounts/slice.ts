import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../../types/types';

interface AccountsState {
  accounts: Account[];
  accountsLoaded: boolean;
  accountsError: string;

  selectedAccount: Account | null;
}

const initialState: AccountsState = {
  accounts: [],
  accountsLoaded: false,
  accountsError: '',

  selectedAccount: null,
};

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
      state.accountsLoaded = true;
    },
    setAccountsError: (state, action: PayloadAction<string>) => {
      state.accountsError = action.payload;
    },
    setSelectedAccount: (state, action: PayloadAction<Account>) => {
      state.selectedAccount = action.payload;
    },
    setAccountsLoaded: (state, action: PayloadAction<boolean>) => {
      state.accountsLoaded = action.payload;
    },
  },
});

export const { setAccounts, setAccountsError, setSelectedAccount, setAccountsLoaded } = accountsSlice.actions;
export default accountsSlice.reducer;
