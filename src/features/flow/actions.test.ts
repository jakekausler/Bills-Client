import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadFlow } from './actions';
import * as api from './api';
import { setFlow, setFlowError, setFlowLoaded } from './slice';

vi.mock('./api');

describe('flow actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadFlow', () => {
    it('should dispatch setFlow on success', async () => {
      const mockFlow = { nodes: [{ id: '1', name: 'Test' }], links: [] };
      vi.mocked(api.fetchFlow).mockResolvedValue(mockFlow as any);

      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        flow: {
          selectedAccounts: ['acc-1'],
          startDate: '2026-03-01',
          endDate: '2026-03-31',
        },
      }));

      await loadFlow()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setFlowLoaded(false));
      expect(dispatch).toHaveBeenCalledWith(setFlow(mockFlow));
      expect(api.fetchFlow).toHaveBeenCalledWith(['acc-1'], '2026-03-01', '2026-03-31');
    });

    it('should dispatch error on failure', async () => {
      vi.mocked(api.fetchFlow).mockRejectedValue(new Error('API error'));

      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        flow: { selectedAccounts: [], startDate: '2026-03-01', endDate: '2026-03-31' },
      }));

      await expect(loadFlow()(dispatch, getState, undefined)).rejects.toThrow('API error');
      expect(dispatch).toHaveBeenCalledWith(setFlowError('API error'));
    });
  });
});
