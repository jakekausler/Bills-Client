import { createSlice } from '@reduxjs/toolkit';
import { MoneyMovementData } from '../../types/types';
import { toDateString } from '../../utils/date';
import dayjs from 'dayjs';

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

  startDate: toDateString(dayjs(new Date()).add(1, 'year').startOf('year').toDate()),
  endDate: toDateString(dayjs(new Date()).add(60, 'year').endOf('year').toDate()),
};

const moneyMovementSlice = createSlice({
  name: 'moneyMovement',
  initialState,
  reducers: {
    setMoneyMovementData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setMoneyMovementLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMoneyMovementError: (state, action) => {
      state.error = action.payload;
    },
    setMoneyMovementStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setMoneyMovementEndDate: (state, action) => {
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
