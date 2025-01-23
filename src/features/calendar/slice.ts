import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { CalendarBill } from "../../types/types";

interface CalendarState {
  bills: CalendarBill[];
  billsLoaded: boolean;
  billsError: string;

  selectedAccounts: string[];

  startDate: string;
  endDate: string;
}

const initialState: CalendarState = {
  bills: [],
  billsLoaded: false,
  billsError: "",

  selectedAccounts: [],

  startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<CalendarBill[]>) => {
      state.bills = action.payload;
      state.billsLoaded = true;
    },
    setBillsError: (state, action: PayloadAction<string>) => {
      state.billsError = action.payload;
    },
    updateStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    updateEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    updateSelectedAccounts: (state, action: PayloadAction<string[]>) => {
      state.selectedAccounts = action.payload;
    },
    setBillsLoaded: (state, action: PayloadAction<boolean>) => {
      state.billsLoaded = action.payload;
    },
  },
});

export const {
  setBills,
  setBillsError,
  updateStartDate,
  updateEndDate,
  updateSelectedAccounts,
  setBillsLoaded,
} = calendarSlice.actions;

export default calendarSlice.reducer;
