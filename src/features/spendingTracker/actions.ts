import { AppDispatch } from '../../store';
import {
  setLoading,
  setError,
  setCategories,
} from './slice';
import { getSpendingTrackerCategories } from './api';

export const loadSpendingTrackerCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const categories = await getSpendingTrackerCategories();
    dispatch(setCategories(categories));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load spending tracker categories';
    dispatch(setError(message));
  }
};
