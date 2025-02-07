import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { Flow } from '../../types/types';

interface FlowState {
  flow: Flow;
  flowLoaded: boolean;
  flowError: string;

  selectedAccounts: string[];

  startDate: string;
  endDate: string;
}

const initialState: FlowState = {
  flow: {
    nodes: [],
    links: [],
  },
  flowLoaded: false,
  flowError: '',

  selectedAccounts: [],

  startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
  endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
};

export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    updateSelectedAccounts: (state, action: PayloadAction<string[]>) => {
      state.selectedAccounts = action.payload;
    },
    setFlow: (state, action: PayloadAction<Flow>) => {
      state.flow = action.payload;
      state.flowLoaded = true;
    },
    setFlowError: (state, action: PayloadAction<string>) => {
      state.flowError = action.payload;
    },
    setFlowLoaded: (state, action: PayloadAction<boolean>) => {
      state.flowLoaded = action.payload;
    },
    updateStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    updateEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
  },
});

export const { updateSelectedAccounts, setFlow, setFlowError, setFlowLoaded, updateStartDate, updateEndDate } =
  flowSlice.actions;

export default flowSlice.reducer;
