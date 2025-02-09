import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { Dataset, GraphData } from '../../types/types';
import { toDateString } from '../../utils/date';

interface GraphViewState {
  datasets: Dataset[];
  labels: string[];
  type: 'activity' | 'yearly';
  loaded: boolean;
  error: string;
  selectedAccounts: string[];

  startDate: string;
  endDate: string;
}

const initialState: GraphViewState = {
  datasets: [],
  labels: [],
  type: 'activity',
  loaded: false,
  error: '',
  startDate: toDateString(new Date()),
  endDate: toDateString(new Date(new Date().setMonth(new Date().getMonth() + 24))),
  selectedAccounts: [],
};

const graphViewSlice = createSlice({
  name: 'graphView',
  initialState,
  reducers: {
    setGraphViewData: (state, action: PayloadAction<GraphData>) => {
      state.datasets = action.payload.datasets;
      state.labels = action.payload.labels;
      state.type = action.payload.type;
      state.loaded = true;
    },
    setGraphViewError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setGraphViewStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setGraphViewEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setGraphViewLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
    updateSelectedAccounts: (state, action: PayloadAction<string[]>) => {
      state.selectedAccounts = action.payload;
    },
  },
});

export const {
  setGraphViewData,
  setGraphViewError,
  setGraphViewStartDate,
  setGraphViewEndDate,
  setGraphViewLoaded,
  updateSelectedAccounts,
} = graphViewSlice.actions;
export default graphViewSlice.reducer;
