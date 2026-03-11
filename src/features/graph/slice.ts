import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dataset } from '../../types/types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface GraphState {
  datasets: Dataset[];
  labels: string[];
  type: 'activity' | 'yearly';
  loaded: boolean;
  error: string;

  startDate: string;
  endDate: string;

  show: boolean;
}

const initialState: GraphState = {
  datasets: [],
  labels: [],
  type: 'activity',
  loaded: false,
  error: '',

  startDate: dayjs.utc().format('YYYY-MM-DD'),
  endDate: dayjs.utc().add(24, 'month').format('YYYY-MM-DD'),

  show: true,
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setGraphData: (state, action: PayloadAction<{ datasets: Dataset[]; labels: string[]; type: 'activity' | 'yearly' }>) => {
      state.datasets = action.payload.datasets;
      state.labels = action.payload.labels;
      state.type = action.payload.type;
      state.loaded = true;
      state.error = '';
    },
    setGraphError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setGraphStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setGraphEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setShowGraph: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    toggleGraph: (state) => {
      state.show = !state.show;
    },
    updateGraphLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
  },
});

export const {
  setGraphData,
  setGraphError,
  setGraphStartDate,
  setGraphEndDate,
  toggleGraph,
  updateGraphLoaded,
} = graphSlice.actions;
export default graphSlice.reducer;
