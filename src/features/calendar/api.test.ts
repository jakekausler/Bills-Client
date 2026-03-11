import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchBills } from './api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from '../../utils/api';

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe('calendar api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchBills', () => {
    it('calls api.get with correct endpoint when no selectedAccounts', async () => {
      const mockData = [
        { id: 'bill-1', name: 'Rent', amount: 1200, date: '2024-01-01' },
      ];
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchBills('2024-01-01', '2024-01-31', []);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/calendar/bills?startDate=2024-01-01&endDate=2024-01-31',
      );
      expect(mockApi.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('includes selectedAccounts query param when accounts are provided', async () => {
      mockApi.get.mockResolvedValue([]);

      await fetchBills('2024-01-01', '2024-01-31', ['Checking', 'Savings']);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/calendar/bills?startDate=2024-01-01&endDate=2024-01-31&selectedAccounts=Checking,Savings',
      );
    });

    it('includes a single account correctly', async () => {
      mockApi.get.mockResolvedValue([]);

      await fetchBills('2024-06-01', '2024-06-30', ['Checking']);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/calendar/bills?startDate=2024-06-01&endDate=2024-06-30&selectedAccounts=Checking',
      );
    });

    it('joins multiple accounts with a comma', async () => {
      mockApi.get.mockResolvedValue([]);

      await fetchBills('2024-01-01', '2024-12-31', ['Checking', 'Savings', 'Investment']);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/calendar/bills?startDate=2024-01-01&endDate=2024-12-31&selectedAccounts=Checking,Savings,Investment',
      );
    });

    it('propagates errors from api.get', async () => {
      mockApi.get.mockRejectedValue(new Error('HTTP error! status: 500'));

      await expect(fetchBills('2024-01-01', '2024-01-31', [])).rejects.toThrow(
        'HTTP error! status: 500',
      );
    });
  });
});
