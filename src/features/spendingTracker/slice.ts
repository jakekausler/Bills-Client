import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartDataResponse, SpendingTrackerCategory } from '../../types/types';

type SpendingTrackerState = {
  categories: SpendingTrackerCategory[];
  selectedCategoryId: string | null;
  loading: boolean;
  error: string | null;
  chartData: ChartDataResponse | null;
  chartLoading: boolean;
  dateRangeMode: 'custom' | 'smart';
  customStartDate: string | null;
  customEndDate: string | null;
  smartCount: number;
  smartInterval: 'weeks' | 'months' | 'years';
  smartEndCount: number;
  smartEndInterval: 'weeks' | 'months' | 'years';
};

const initialState: SpendingTrackerState = {
  categories: [],
  selectedCategoryId: null,
  loading: false,
  error: null,
  chartData: null,
  chartLoading: false,
  dateRangeMode: 'smart',
  customStartDate: null,
  customEndDate: null,
  smartCount: 12,
  smartInterval: 'weeks',
  smartEndCount: 4,
  smartEndInterval: 'weeks',
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
    setChartData: (state, action: PayloadAction<ChartDataResponse | null>) => {
      state.chartData = action.payload;
    },
    setChartLoading: (state, action: PayloadAction<boolean>) => {
      state.chartLoading = action.payload;
    },
    setDateRangeMode: (state, action: PayloadAction<'custom' | 'smart'>) => {
      state.dateRangeMode = action.payload;
    },
    setCustomStartDate: (state, action: PayloadAction<string | null>) => {
      state.customStartDate = action.payload;
    },
    setCustomEndDate: (state, action: PayloadAction<string | null>) => {
      state.customEndDate = action.payload;
    },
    setSmartCount: (state, action: PayloadAction<number>) => {
      state.smartCount = action.payload;
    },
    setSmartInterval: (state, action: PayloadAction<'weeks' | 'months' | 'years'>) => {
      state.smartInterval = action.payload;
    },
    setSmartEndCount: (state, action: PayloadAction<number>) => {
      state.smartEndCount = action.payload;
    },
    setSmartEndInterval: (state, action: PayloadAction<'weeks' | 'months' | 'years'>) => {
      state.smartEndInterval = action.payload;
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
  setChartData,
  setChartLoading,
  setDateRangeMode,
  setCustomStartDate,
  setCustomEndDate,
  setSmartCount,
  setSmartInterval,
  setSmartEndCount,
  setSmartEndInterval,
} = spendingTrackerSlice.actions;

export default spendingTrackerSlice.reducer;
