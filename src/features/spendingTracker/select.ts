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
