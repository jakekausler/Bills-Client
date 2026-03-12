import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadGraphData } from './actions';
import * as api from './api';
import { setGraphData, setGraphError, updateGraphLoaded } from './slice';
import { makeAccount } from '../../test/factories';

vi.mock('./api');

describe('graph actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadGraphData', () => {
    it('should dispatch setGraphData on success', async () => {
      const mockData = { datasets: [], labels: [], type: 'activity' as const };
      vi.mocked(api.fetchGraphData).mockResolvedValue(mockData);

      const dispatch = vi.fn();
      const getState = vi.fn();
      const account = makeAccount();
      const startDate = new Date('2026-03-01');
      const endDate = new Date('2026-03-31');

      await loadGraphData(account, startDate, endDate)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(updateGraphLoaded(false));
      expect(dispatch).toHaveBeenCalledWith(setGraphData(mockData));
      expect(api.fetchGraphData).toHaveBeenCalledWith(account, startDate, endDate);
    });

    it('should dispatch error on failure', async () => {
      vi.mocked(api.fetchGraphData).mockRejectedValue(new Error('API error'));

      const dispatch = vi.fn();
      const getState = vi.fn();
      const account = makeAccount();
      const startDate = new Date('2026-03-01');
      const endDate = new Date('2026-03-31');

      await expect(loadGraphData(account, startDate, endDate)(dispatch, getState, undefined)).rejects.toThrow(
        'API error'
      );
      expect(dispatch).toHaveBeenCalledWith(updateGraphLoaded(true));
      expect(dispatch).toHaveBeenCalledWith(setGraphError('Failed to load graph data'));
    });
  });
});
