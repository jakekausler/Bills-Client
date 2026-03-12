import { describe, it, expect, vi } from 'vitest';
import {
  getSpendingTrackerCategories,
  createSpendingTrackerCategory,
  updateSpendingTrackerCategory,
  deleteSpendingTrackerCategory,
  getSpendingTrackerChartData,
} from './api';
import * as apiUtils from '../../utils/api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('spendingTracker api', () => {
  it('should fetch categories', async () => {
    const mockCategories = [{ id: '1', name: 'Test' }];
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockCategories);

    await getSpendingTrackerCategories();

    expect(apiUtils.api.get).toHaveBeenCalledWith('/api/spending-tracker');
  });

  it('should create category', async () => {
    const newCategory = { name: 'New' };
    const mockResponse = { id: '1', ...newCategory };
    vi.mocked(apiUtils.api.post).mockResolvedValue(mockResponse);

    await createSpendingTrackerCategory(newCategory as any);

    expect(apiUtils.api.post).toHaveBeenCalledWith('/api/spending-tracker', newCategory);
  });

  it('should update category', async () => {
    const category = { id: '1', name: 'Updated' };
    vi.mocked(apiUtils.api.put).mockResolvedValue(category);

    await updateSpendingTrackerCategory('1', category as any);

    expect(apiUtils.api.put).toHaveBeenCalledWith('/api/spending-tracker/1', category);
  });

  it('should delete category', async () => {
    vi.mocked(apiUtils.api.delete).mockResolvedValue(undefined);

    await deleteSpendingTrackerCategory('1');

    expect(apiUtils.api.delete).toHaveBeenCalledWith('/api/spending-tracker/1');
  });

  it('should fetch chart data', async () => {
    const mockData = { labels: [], datasets: [] };
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockData);

    await getSpendingTrackerChartData('cat-1', '2026-03-01', '2026-03-31');

    expect(apiUtils.api.get).toHaveBeenCalledWith(
      '/api/spending-tracker/cat-1/chart-data?startDate=2026-03-01&endDate=2026-03-31'
    );
  });
});
