import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectSpendingTrackerCategories = (state: RootState) => state.spendingTracker.categories;
export const selectSpendingTrackerLoading = (state: RootState) => state.spendingTracker.loading;
export const selectSpendingTrackerError = (state: RootState) => state.spendingTracker.error;

export const selectSpendingTrackerCategoryOptions = createSelector(
  [selectSpendingTrackerCategories],
  (categories) => [
    { value: '', label: 'None' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ],
);

export const selectSelectedCategoryId = (state: RootState) => state.spendingTracker.selectedCategoryId;

export const selectSelectedCategory = createSelector(
  [selectSpendingTrackerCategories, selectSelectedCategoryId],
  (categories, selectedId) => {
    if (!selectedId) return null;
    return categories.find((c) => c.id === selectedId) ?? null;
  },
);

export const selectChartData = (state: RootState) => state.spendingTracker.chartData;
export const selectChartLoading = (state: RootState) => state.spendingTracker.chartLoading;
export const selectDateRangeMode = (state: RootState) => state.spendingTracker.dateRangeMode;
export const selectCustomStartDate = (state: RootState) => state.spendingTracker.customStartDate;
export const selectCustomEndDate = (state: RootState) => state.spendingTracker.customEndDate;
export const selectSmartCount = (state: RootState) => state.spendingTracker.smartCount;
export const selectSmartInterval = (state: RootState) => state.spendingTracker.smartInterval;
export const selectSmartEndCount = (state: RootState) => state.spendingTracker.smartEndCount;
export const selectSmartEndInterval = (state: RootState) => state.spendingTracker.smartEndInterval;
