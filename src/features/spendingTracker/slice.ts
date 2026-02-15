import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpendingTrackerCategory } from '../../types/types';

type SpendingTrackerState = {
  categories: SpendingTrackerCategory[];
  loading: boolean;
  error: string | null;
};

const initialState: SpendingTrackerState = {
  categories: [],
  loading: false,
  error: null,
};

const spendingTrackerSlice = createSlice({
  name: 'spendingTracker',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCategories: (state, action: PayloadAction<SpendingTrackerCategory[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCategories,
  clearError,
} = spendingTrackerSlice.actions;

export default spendingTrackerSlice.reducer;
