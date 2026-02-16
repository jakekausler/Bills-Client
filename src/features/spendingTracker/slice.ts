import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpendingTrackerCategory } from '../../types/types';

type SpendingTrackerState = {
  categories: SpendingTrackerCategory[];
  selectedCategoryId: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: SpendingTrackerState = {
  categories: [],
  selectedCategoryId: null,
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
    addCategory: (state, action: PayloadAction<SpendingTrackerCategory>) => {
      state.categories.push(action.payload);
    },
    updateCategoryInState: (state, action: PayloadAction<SpendingTrackerCategory>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    updateSelectedCategory: (state, action: PayloadAction<Partial<SpendingTrackerCategory>>) => {
      if (!state.selectedCategoryId) return;
      const index = state.categories.findIndex(c => c.id === state.selectedCategoryId);
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...action.payload };
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
      if (state.selectedCategoryId === action.payload) {
        state.selectedCategoryId = null;
      }
    },
    setSelectedCategoryId: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
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
  addCategory,
  updateCategoryInState,
  updateSelectedCategory,
  removeCategory,
  setSelectedCategoryId,
  clearError,
} = spendingTrackerSlice.actions;

export default spendingTrackerSlice.reducer;
