import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchCategories,
  fetchCategoryBreakdown,
  fetchSelectedCategoryBreakdown,
  fetchSelectedCategoryActivity,
} from './api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from '../../utils/api';

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe('categories api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchCategories', () => {
    it('calls api.get with /api/categories', async () => {
      const mockData = ['Food', 'Housing', 'Transportation'];
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchCategories();

      expect(mockApi.get).toHaveBeenCalledWith('/api/categories');
      expect(mockApi.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('propagates errors from api.get', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'));

      await expect(fetchCategories()).rejects.toThrow('Network error');
    });
  });

  describe('fetchCategoryBreakdown', () => {
    it('calls api.get with correct endpoint when no selectedAccounts', async () => {
       
      const mockData = { Food: 500, Housing: 1200 };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchCategoryBreakdown('2024-01-01', '2024-12-31', []);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/categories/breakdown?startDate=2024-01-01&endDate=2024-12-31',
      );
      expect(result).toEqual(mockData);
    });

    it('includes selectedAccounts query param when accounts are provided', async () => {
      mockApi.get.mockResolvedValue({});

      await fetchCategoryBreakdown('2024-01-01', '2024-12-31', ['Checking', 'Savings']);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/categories/breakdown?startDate=2024-01-01&endDate=2024-12-31&selectedAccounts=Checking%2CSavings',
      );
    });

    it('includes a single account correctly', async () => {
      mockApi.get.mockResolvedValue({});

      await fetchCategoryBreakdown('2024-06-01', '2024-06-30', ['Checking']);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/categories/breakdown?startDate=2024-06-01&endDate=2024-06-30&selectedAccounts=Checking',
      );
    });

    it('propagates errors from api.get', async () => {
      mockApi.get.mockRejectedValue(new Error('HTTP error! status: 500'));

      await expect(fetchCategoryBreakdown('2024-01-01', '2024-12-31', [])).rejects.toThrow(
        'HTTP error! status: 500',
      );
    });
  });

  describe('fetchSelectedCategoryBreakdown', () => {
    it('calls api.get with correct endpoint for a category without selectedAccounts', async () => {
       
      const mockData = { January: 150, February: 200 };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchSelectedCategoryBreakdown('Food', '2024-01-01', '2024-12-31', []);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/categories/Food/breakdown?startDate=2024-01-01&endDate=2024-12-31',
      );
      expect(result).toEqual(mockData);
    });

    it('includes selectedAccounts when provided', async () => {
      mockApi.get.mockResolvedValue({});

      await fetchSelectedCategoryBreakdown('Housing', '2024-01-01', '2024-12-31', ['Checking', 'Savings']);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/categories/Housing/breakdown?startDate=2024-01-01&endDate=2024-12-31&selectedAccounts=Checking%2CSavings',
      );
    });

    it('encodes the category name in the URL path', async () => {
      mockApi.get.mockResolvedValue({});

      await fetchSelectedCategoryBreakdown('Food & Drink', '2024-03-01', '2024-03-31', []);

      expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent('Food & Drink')));
    });

    it('propagates errors from api.get', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'));

      await expect(
        fetchSelectedCategoryBreakdown('Food', '2024-01-01', '2024-12-31', []),
      ).rejects.toThrow('Network error');
    });
  });

  describe('fetchSelectedCategoryActivity', () => {
    it('calls api.get with correct transactions endpoint without selectedAccounts', async () => {
      const mockData = [{ id: 'act-1', name: 'Grocery store', amount: 75 }];
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchSelectedCategoryActivity('Food', '2024-01-01', '2024-12-31', []);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/categories/Food/transactions?startDate=2024-01-01&endDate=2024-12-31',
      );
      expect(result).toEqual(mockData);
    });

    it('includes selectedAccounts in the transactions endpoint when provided', async () => {
      mockApi.get.mockResolvedValue([]);

      await fetchSelectedCategoryActivity('Housing', '2024-01-01', '2024-12-31', ['Checking', 'Savings']);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/categories/Housing/transactions?startDate=2024-01-01&endDate=2024-12-31&selectedAccounts=Checking%2CSavings',
      );
    });

    it('includes a single account correctly in transactions endpoint', async () => {
      mockApi.get.mockResolvedValue([]);

      await fetchSelectedCategoryActivity('Food', '2024-06-01', '2024-06-30', ['Checking']);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/categories/Food/transactions?startDate=2024-06-01&endDate=2024-06-30&selectedAccounts=Checking',
      );
    });

    it('propagates errors from api.get', async () => {
      mockApi.get.mockRejectedValue(new Error('HTTP error! status: 401'));

      await expect(
        fetchSelectedCategoryActivity('Food', '2024-01-01', '2024-12-31', []),
      ).rejects.toThrow('HTTP error! status: 401');
    });
  });
});
