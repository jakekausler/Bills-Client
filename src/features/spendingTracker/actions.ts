import { AppDispatch } from '../../store';
import {
  setLoading,
  setError,
  setCategories,
  addCategory,
  updateCategoryInState,
  removeCategory,
} from './slice';
import {
  getSpendingTrackerCategories,
  createSpendingTrackerCategory,
  updateSpendingTrackerCategory,
  deleteSpendingTrackerCategory,
} from './api';
import { SpendingTrackerCategory } from '../../types/types';

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

export const createCategory =
  (defaults: Omit<SpendingTrackerCategory, 'id'>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const newCategory = await createSpendingTrackerCategory(defaults);
      dispatch(addCategory(newCategory));
      dispatch(setLoading(false));
      return newCategory;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create spending tracker category';
      dispatch(setError(message));
      throw error;
    }
  };

export const saveCategory =
  (id: string, category: SpendingTrackerCategory) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const updatedCategory = await updateSpendingTrackerCategory(id, category);
      dispatch(updateCategoryInState(updatedCategory));
      dispatch(setLoading(false));
      return updatedCategory;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update spending tracker category';
      dispatch(setError(message));
      throw error;
    }
  };

export const deleteCategory = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await deleteSpendingTrackerCategory(id);
    dispatch(removeCategory(id));
    dispatch(setLoading(false));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete spending tracker category';
    dispatch(setError(message));
    throw error;
  }
};
