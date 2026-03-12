import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadHealthcareConfigs,
  createHealthcareConfig,
  updateHealthcareConfig,
  deleteHealthcareConfig,
} from './actions';
import * as api from './api';
import { setLoading, setError, setConfigs, addConfig, updateConfig, removeConfig } from './slice';

vi.mock('./api');

describe('healthcare actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadHealthcareConfigs', () => {
    it('should dispatch setConfigs on success', async () => {
      const mockConfigs = [{ id: '1', name: 'Test Config' }];
      vi.mocked(api.getHealthcareConfigs).mockResolvedValue(mockConfigs as any);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await loadHealthcareConfigs()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setLoading(true));
      expect(dispatch).toHaveBeenCalledWith(setConfigs(mockConfigs));
    });

    it('should dispatch error on failure', async () => {
      vi.mocked(api.getHealthcareConfigs).mockRejectedValue(new Error('API error'));

      const dispatch = vi.fn();
      const getState = vi.fn();

      await loadHealthcareConfigs()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setError('API error'));
    });
  });

  describe('createHealthcareConfig', () => {
    it('should dispatch addConfig on success', async () => {
      const newConfig = { id: '1', name: 'New Config' };
      vi.mocked(api.postHealthcareConfig).mockResolvedValue(newConfig as any);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await createHealthcareConfig({ name: 'New Config' } as any)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(setLoading(true));
      expect(dispatch).toHaveBeenCalledWith(addConfig(newConfig));
      expect(dispatch).toHaveBeenCalledWith(setLoading(false));
    });
  });

  describe('updateHealthcareConfig', () => {
    it('should dispatch updateConfig on success', async () => {
      const updatedConfig = { id: '1', name: 'Updated Config' };
      vi.mocked(api.putHealthcareConfig).mockResolvedValue(updatedConfig as any);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await updateHealthcareConfig('1', updatedConfig as any)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(updateConfig(updatedConfig));
    });
  });

  describe('deleteHealthcareConfig', () => {
    it('should dispatch removeConfig on success', async () => {
      vi.mocked(api.deleteHealthcareConfigApi).mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const getState = vi.fn();

      await deleteHealthcareConfig('1')(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(removeConfig('1'));
    });
  });
});
