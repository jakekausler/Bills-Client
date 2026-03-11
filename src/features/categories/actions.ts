import { AppThunk } from '../../store';
import {
  fetchCategories,
  fetchCategoryBreakdown,
  fetchSelectedCategoryActivity,
  fetchSelectedCategoryBreakdown,
} from './api';
import { selectBreakdownEnd, selectBreakdownStart, selectSelectedAccounts, selectSelectedCategory } from './select';
import {
  setCategories,
  setCategoriesError,
  setCategoriesLoaded,
  setSelectedCategoryBreakdownLoaded,
  setCategoryBreakdownLoaded,
  updateCategoryBreakdown,
  updateSelectedCategoryBreakdown,
  setSelectedCategoryActivityLoaded,
  updateSelectedCategoryActivity,
} from './slice';

export const loadCategories = (): AppThunk => async (dispatch, getState) => {
  try {
    const categories = await fetchCategories();
    dispatch(setCategoriesLoaded(false));
    dispatch(setCategories(categories));

    const state = getState();
    const startDate = selectBreakdownStart(state);
    const endDate = selectBreakdownEnd(state);
    const selectedCategory = selectSelectedCategory(state);
    const selectedAccounts = selectSelectedAccounts(state);

    dispatch(loadCategoryBreakdown(startDate, endDate, selectedAccounts));
    if (selectedCategory && selectedCategory !== '') {
      dispatch(loadSelectedCategoryBreakdown(selectedCategory, startDate, endDate, selectedAccounts));
    }
  } catch {
    dispatch(setCategoriesError('Failed to load categories'));
  }
};

export const loadCategoryBreakdown =
  (startDate: string, endDate: string, selectedAccounts: string[]): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setCategoryBreakdownLoaded(false));
      const categoryBreakdown = await fetchCategoryBreakdown(startDate, endDate, selectedAccounts);
      dispatch(updateCategoryBreakdown(categoryBreakdown));
    } catch (error) {
      console.error('Failed to load category breakdown:', error);
      dispatch(setCategoriesError(error instanceof Error ? error.message : 'Failed to load category breakdown'));
      throw error;
    }
  };

export const loadSelectedCategoryBreakdown =
  (category: string, startDate: string, endDate: string, selectedAccounts: string[]): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setSelectedCategoryBreakdownLoaded(false));
      const selectedCategoryBreakdown = await fetchSelectedCategoryBreakdown(
        category,
        startDate,
        endDate,
        selectedAccounts,
      );
      dispatch(updateSelectedCategoryBreakdown(selectedCategoryBreakdown));
    } catch (error) {
      console.error('Failed to load selected category breakdown:', error);
      dispatch(setCategoriesError(error instanceof Error ? error.message : 'Failed to load selected category breakdown'));
      throw error;
    }
  };

export const loadSelectedCategoryActivity =
  (category: string, startDate: string, endDate: string, selectedAccounts: string[]): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setSelectedCategoryActivityLoaded(false));
      const selectedCategoryActivity = await fetchSelectedCategoryActivity(
        category,
        startDate,
        endDate,
        selectedAccounts,
      );
      dispatch(updateSelectedCategoryActivity(selectedCategoryActivity));
    } catch (error) {
      console.error('Failed to load selected category activity:', error);
      dispatch(setCategoriesError(error instanceof Error ? error.message : 'Failed to load selected category activity'));
      throw error;
    }
  };
