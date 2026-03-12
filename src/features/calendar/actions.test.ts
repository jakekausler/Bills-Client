import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadCalendar } from './actions';
import * as api from './api';
import { setBills, setBillsError, setBillsLoaded } from './slice';

vi.mock('./api');

describe('calendar actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadCalendar', () => {
    it('should dispatch setBills on success', async () => {
      const mockBills = [{ id: '1', name: 'Test Bill', date: '2026-03-12', amount: 100 }];
      vi.mocked(api.fetchBills).mockResolvedValue(mockBills as any);

      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        calendar: {
          startDate: '2026-03-01',
          endDate: '2026-03-31',
          selectedAccounts: ['acc-1'],
        },
      }));

      await loadCalendar()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setBillsLoaded(false));
      expect(dispatch).toHaveBeenCalledWith(setBills(mockBills));
      expect(api.fetchBills).toHaveBeenCalledWith('2026-03-01', '2026-03-31', ['acc-1']);
    });

    it('should dispatch error on failure', async () => {
      vi.mocked(api.fetchBills).mockRejectedValue(new Error('API error'));

      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        calendar: { startDate: '2026-03-01', endDate: '2026-03-31', selectedAccounts: [] },
      }));

      await expect(loadCalendar()(dispatch, getState, undefined)).rejects.toThrow('API error');
      expect(dispatch).toHaveBeenCalledWith(setBillsError('API error'));
    });
  });
});
