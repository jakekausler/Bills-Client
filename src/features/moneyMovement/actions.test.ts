import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadMoneyMovementChart } from './actions';
import * as api from './api';
import { setMoneyMovementData, setMoneyMovementLoading, setMoneyMovementError } from './slice';

vi.mock('./api');

describe('moneyMovement actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadMoneyMovementChart', () => {
    it('should dispatch setMoneyMovementData on success', async () => {
      const mockData = { labels: ['Jan', 'Feb'], datasets: [] };
      vi.mocked(api.fetchMoneyMovementChart).mockResolvedValue(mockData as any);

      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        moneyMovement: {
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        },
      }));

      await loadMoneyMovementChart()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setMoneyMovementLoading(true));
      expect(dispatch).toHaveBeenCalledWith(setMoneyMovementData(mockData));
      expect(api.fetchMoneyMovementChart).toHaveBeenCalledWith('2026-03-01', '2026-03-31');
    });

    it('should dispatch error on failure', async () => {
      vi.mocked(api.fetchMoneyMovementChart).mockRejectedValue(new Error('API error'));

      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        moneyMovement: { startDate: '2026-03-01', endDate: '2026-03-31' },
      }));

      await expect(loadMoneyMovementChart()(dispatch, getState, undefined)).rejects.toThrow('API error');
      expect(dispatch).toHaveBeenCalledWith(setMoneyMovementLoading(false));
      expect(dispatch).toHaveBeenCalledWith(setMoneyMovementError('Failed to load money movement chart'));
    });
  });
});
