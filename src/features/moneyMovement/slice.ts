import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MoneyMovementData } from '../../types/types';
import { toDateString } from '../../utils/date';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface MoneyMovementState {
  data: MoneyMovementData | null;
  loading: boolean;
  error: string;

  startDate: string;
  endDate: string;
}

const initialState: MoneyMovementState = {
  data: null,
  loading: false,
  error: '',

  startDate: toDateString(dayjs.utc(new Date()).add(1, 'year').startOf('year').toDate()),
  endDate: toDateString(dayjs.utc(new Date()).add(1, 'year').endOf('year').toDate()),
};

const moneyMovementSlice = createSlice({
  name: 'moneyMovement',
  initialState,
  reducers: {
    setMoneyMovementData: (state, action: PayloadAction<MoneyMovementData | null>) => {
      state.data = action.payload;
      state.loading = false;
    },
    setMoneyMovementLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMoneyMovementError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setMoneyMovementStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setMoneyMovementEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
  },
});
export const {
  setMoneyMovementData,
  setMoneyMovementLoading,
  setMoneyMovementError,
  setMoneyMovementStartDate,
  setMoneyMovementEndDate,
} = moneyMovementSlice.actions;
export default moneyMovementSlice.reducer;
