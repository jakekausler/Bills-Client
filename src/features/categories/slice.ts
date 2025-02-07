import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { CategoryActivity, CategoryBreakdown } from '../../types/types';

interface CategoriesState {
  categories: Record<string, string[]>;
  categoriesLoaded: boolean;
  categoriesError: string;

  categoryBreakdown: CategoryBreakdown;
  categoryBreakdownLoaded: boolean;

  selectedCategory: string;
  selectedCategoryBreakdown: CategoryBreakdown;
  selectedCategoryBreakdownLoaded: boolean;
  selectedCategoryActivity: CategoryActivity[];
  selectedCategoryActivityLoaded: boolean;

  breakdownStart: string;
  breakdownEnd: string;

  selectedAccounts: string[];
}

const initialState: CategoriesState = {
  categories: {},
  categoriesLoaded: false,
  categoriesError: '',

  categoryBreakdown: {},
  categoryBreakdownLoaded: false,

  selectedCategory: '',
  selectedCategoryBreakdown: {},
  selectedCategoryBreakdownLoaded: false,
  selectedCategoryActivity: [],
  selectedCategoryActivityLoaded: false,

  breakdownStart: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  breakdownEnd: dayjs().format('YYYY-MM-DD'),

  selectedAccounts: [],
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Record<string, string[]>>) => {
      state.categories = action.payload;
      state.categoriesLoaded = true;
    },
    setCategoriesError: (state, action: PayloadAction<string>) => {
      state.categoriesError = action.payload;
    },
    setCategoriesLoaded: (state, action: PayloadAction<boolean>) => {
      state.categoriesLoaded = action.payload;
    },
    updateCategoryBreakdown: (state, action: PayloadAction<CategoryBreakdown>) => {
      state.categoryBreakdown = action.payload;
      state.categoryBreakdownLoaded = true;
    },
    setCategoryBreakdownLoaded: (state, action: PayloadAction<boolean>) => {
      state.categoryBreakdownLoaded = action.payload;
    },
    updateSelectedCategoryBreakdown: (state, action: PayloadAction<CategoryBreakdown>) => {
      state.selectedCategoryBreakdown = action.payload;
      state.selectedCategoryBreakdownLoaded = true;
    },
    setSelectedCategoryBreakdownLoaded: (state, action: PayloadAction<boolean>) => {
      state.selectedCategoryBreakdownLoaded = action.payload;
    },
    updateSelectedCategoryActivity: (state, action: PayloadAction<CategoryActivity[]>) => {
      state.selectedCategoryActivity = action.payload;
      state.selectedCategoryActivityLoaded = true;
    },
    setSelectedCategoryActivityLoaded: (state, action: PayloadAction<boolean>) => {
      state.selectedCategoryActivityLoaded = action.payload;
    },
    updateBreakdownStart: (state, action: PayloadAction<string>) => {
      state.breakdownStart = action.payload;
    },
    updateBreakdownEnd: (state, action: PayloadAction<string>) => {
      state.breakdownEnd = action.payload;
    },
    updateSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    updateSelectedAccounts: (state, action: PayloadAction<string[]>) => {
      state.selectedAccounts = action.payload;
    },
  },
});

export const {
  setCategories,
  setCategoriesError,
  setCategoriesLoaded,
  updateCategoryBreakdown,
  setCategoryBreakdownLoaded,
  updateSelectedCategoryBreakdown,
  setSelectedCategoryBreakdownLoaded,
  updateSelectedCategoryActivity,
  setSelectedCategoryActivityLoaded,
  updateBreakdownStart,
  updateBreakdownEnd,
  updateSelectedCategory,
  updateSelectedAccounts,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
