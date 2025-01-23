import { RootState } from "../../store";

export const selectBills = (state: RootState) => state.calendar.bills;
export const selectBillsLoaded = (state: RootState) => state.calendar.billsLoaded;
export const selectBillsError = (state: RootState) => state.calendar.billsError;
export const selectStartDate = (state: RootState) => state.calendar.startDate;
export const selectEndDate = (state: RootState) => state.calendar.endDate;
export const selectSelectedAccounts = (state: RootState) => state.calendar.selectedAccounts;
