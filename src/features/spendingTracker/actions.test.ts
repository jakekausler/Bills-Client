import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadSpendingTrackerCategories,
  createCategory,
  saveCategory,
  deleteCategory,
  loadChartData,
} from './actions';
import * as api from './api';
import {
  setLoading,
  setError,
  setCategories,
  addCategory,
  updateCategoryInState,
  removeCategory,
  setChartData,
  setChartLoading,
  clearError,
} from './slice';

vi.mock('./api');

describe('spendingTracker actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadSpendingTrackerCategories', () => {
    it('should dispatch setCategories on success', async () => {
      const mockCategories = [{ id: '1', name: 'Test' }];
      vi.mocked(api.getSpendingTrackerCategories).mockResolvedValue(mockCategories as any);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await loadSpendingTrackerCategories()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setLoading(true));
      expect(dispatch).toHaveBeenCalledWith(setCategories(mockCategories));
    });

    it('should dispatch error on failure', async () => {
      vi.mocked(api.getSpendingTrackerCategories).mockRejectedValue(new Error('API error'));

      const dispatch = vi.fn();
      const getState = vi.fn();

      await loadSpendingTrackerCategories()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setError('API error'));
    });
  });

  describe('createCategory', () => {
    it('should dispatch addCategory on success', async () => {
      const newCategory = { id: '1', name: 'New' };
      vi.mocked(api.createSpendingTrackerCategory).mockResolvedValue(newCategory as any);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await createCategory({ name: 'New' } as any)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(addCategory(newCategory));
    });
  });

  describe('saveCategory', () => {
    it('should dispatch updateCategoryInState on success', async () => {
      const updatedCategory = { id: '1', name: 'Updated' };
      vi.mocked(api.updateSpendingTrackerCategory).mockResolvedValue(updatedCategory as any);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await saveCategory('1', updatedCategory as any)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(updateCategoryInState(updatedCategory));
    });
  });

  describe('deleteCategory', () => {
    it('should dispatch removeCategory on success', async () => {
      vi.mocked(api.deleteSpendingTrackerCategory).mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await deleteCategory('1')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(removeCategory('1'));
    });
  });

  describe('loadChartData', () => {
    it('should dispatch setChartData on success', async () => {
      const mockData = { labels: ['Jan'], datasets: [] };
      vi.mocked(api.getSpendingTrackerChartData).mockResolvedValue(mockData as any);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await loadChartData('cat-1', '2026-03-01', '2026-03-31')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setChartLoading(true));
      expect(dispatch).toHaveBeenCalledWith(setChartData(null));
      expect(dispatch).toHaveBeenCalledWith(clearError());
      expect(dispatch).toHaveBeenCalledWith(setChartData(mockData));
      expect(dispatch).toHaveBeenCalledWith(setChartLoading(false));
    });
  });
});
