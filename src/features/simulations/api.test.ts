import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSimulations, fetchSaveSimulations, fetchUsedVariables } from './api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

import { api } from '../../utils/api';

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
};

describe('simulations api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchSimulations', () => {
    it('calls api.get with /api/simulations', async () => {
      const mockData = [
        { name: 'base', variables: {}, enabled: true, selected: true },
        { name: 'optimistic', variables: {}, enabled: true, selected: false },
      ];
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchSimulations();

      expect(mockApi.get).toHaveBeenCalledWith('/api/simulations');
      expect(mockApi.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('propagates errors from api.get', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'));

      await expect(fetchSimulations()).rejects.toThrow('Network error');
    });
  });

  describe('fetchSaveSimulations', () => {
    it('calls api.put with /api/simulations and the simulations array', async () => {
      const simulations = [
        { name: 'base', variables: { inflation: { type: 'number', value: 0.03 } }, enabled: true, selected: true },
      ];
      const mockResponse = { success: true };
      mockApi.put.mockResolvedValue(mockResponse);

      const result = await fetchSaveSimulations(simulations);

      expect(mockApi.put).toHaveBeenCalledWith('/api/simulations', simulations);
      expect(mockApi.put).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('calls api.put with an empty array when no simulations provided', async () => {
      mockApi.put.mockResolvedValue([]);

      await fetchSaveSimulations([]);

      expect(mockApi.put).toHaveBeenCalledWith('/api/simulations', []);
    });

    it('propagates errors from api.put', async () => {
      mockApi.put.mockRejectedValue(new Error('HTTP error! status: 500'));

      await expect(fetchSaveSimulations([])).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('fetchUsedVariables', () => {
    it('calls api.get with /api/simulations/used_variables', async () => {
      const mockData = {
        inflation: [{ name: 'inflation', type: 'number', date: '2024-01-01' }],
      };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchUsedVariables();

      expect(mockApi.get).toHaveBeenCalledWith('/api/simulations/used_variables');
      expect(mockApi.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('propagates errors from api.get', async () => {
      mockApi.get.mockRejectedValue(new Error('HTTP error! status: 401'));

      await expect(fetchUsedVariables()).rejects.toThrow('HTTP error! status: 401');
    });
  });
});
