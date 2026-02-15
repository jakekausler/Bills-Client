import { RootState } from '../../store';

export const selectSpendingTrackerCategories = (state: RootState) => state.spendingTracker.categories;

export const selectSpendingTrackerCategoryOptions = (state: RootState) => [
  { value: '', label: 'None' },
  ...state.spendingTracker.categories.map((c) => ({ value: c.id, label: c.name })),
];
