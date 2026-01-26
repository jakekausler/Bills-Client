import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    accounts: [],
    accountsLoaded: false,
    accountsError: '',
    selectedAccount: null,
};
export const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        setAccounts: (state, action) => {
            state.accounts = action.payload;
            state.accountsLoaded = true;
        },
        setAccountsError: (state, action) => {
            state.accountsError = action.payload;
        },
        setSelectedAccount: (state, action) => {
            state.selectedAccount = action.payload;
        },
        setAccountsLoaded: (state, action) => {
            state.accountsLoaded = action.payload;
        },
    },
});
export const { setAccounts, setAccountsError, setSelectedAccount, setAccountsLoaded } = accountsSlice.actions;
export default accountsSlice.reducer;
