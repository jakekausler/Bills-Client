import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectSpendingTrackerCategories = (state: RootState) => state.spendingTracker.categories;

export const selectSpendingTrackerCategoryOptions = createSelector(
  [selectSpendingTrackerCategories],
  (categories) => [
    { value: '', label: 'None' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ],
);
