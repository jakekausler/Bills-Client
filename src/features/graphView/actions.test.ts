import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadGraphViewData } from './actions';
import * as api from './api';
import { setGraphViewData, setGraphViewError, setGraphViewLoaded } from './slice';

vi.mock('./api');

describe('graphView actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadGraphViewData', () => {
    it('should dispatch setGraphViewData on success', async () => {
      const mockData = { 'Base Case': { datasets: [], labels: [], type: 'activity' as const } };
      vi.mocked(api.fetchGraphViewData).mockResolvedValue(mockData);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await loadGraphViewData(['acc-1'], ['sim-1'], '2026-03-01', '2026-12-31', true)(
        dispatch,
        getState,
        undefined
      );

      expect(dispatch).toHaveBeenCalledWith(setGraphViewLoaded(false));
      expect(dispatch).toHaveBeenCalledWith(setGraphViewData(mockData));
      expect(api.fetchGraphViewData).toHaveBeenCalledWith(['acc-1'], ['sim-1'], '2026-03-01', '2026-12-31', true);
    });

    it('should dispatch error on failure', async () => {
      vi.mocked(api.fetchGraphViewData).mockRejectedValue(new Error('API error'));

      const dispatch = vi.fn();
      const getState = vi.fn();

      await expect(
        loadGraphViewData(['acc-1'], [], '2026-03-01', '2026-12-31', false)(dispatch, getState, undefined)
      ).rejects.toThrow('API error');
      expect(dispatch).toHaveBeenCalledWith(setGraphViewLoaded(true));
      expect(dispatch).toHaveBeenCalledWith(setGraphViewError('Failed to load graph view data'));
    });
  });
});
