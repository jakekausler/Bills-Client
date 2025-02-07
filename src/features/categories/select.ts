import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { sort } from '../../utils/array';

export const selectCategories = (state: RootState) => state.categories.categories;
export const selectCategoriesLoaded = (state: RootState) => state.categories.categoriesLoaded;
export const selectCategoriesError = (state: RootState) => state.categories.categoriesError;

export const selectCategoryBreakdown = (state: RootState) => state.categories.categoryBreakdown;
export const selectSelectedCategoryBreakdown = (state: RootState) => state.categories.selectedCategoryBreakdown;
export const selectBreakdownStart = (state: RootState) => state.categories.breakdownStart;
export const selectBreakdownEnd = (state: RootState) => state.categories.breakdownEnd;
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;
export const selectSelectedAccounts = (state: RootState) => state.categories.selectedAccounts;
export const selectCategoryBreakdownLoaded = (state: RootState) => state.categories.categoryBreakdownLoaded;
export const selectSelectedCategoryBreakdownLoaded = (state: RootState) =>
  state.categories.selectedCategoryBreakdownLoaded;
export const selectSelectedCategoryActivity = (state: RootState) => state.categories.selectedCategoryActivity;
export const selectSortedSelectedCategoryActivity = createSelector(selectSelectedCategoryActivity, (activity) =>
  sort(activity, (a, b) =>
    a.category === b.category ? (a.amount as number) - (b.amount as number) : a.category.localeCompare(b.category),
  ),
);
