import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadSimulations, saveSimulations } from './actions';
import { setSimulations, setSimulationsError, setSimulationsLoaded, setUsedVariables, setUsedVariablesLoaded } from './slice';
import { makeSimulation } from '../../test/factories';

// Mock the API functions
vi.mock('./api', () => ({
  fetchSimulations: vi.fn(),
  fetchSaveSimulations: vi.fn(),
  fetchUsedVariables: vi.fn(),
}));

import { fetchSimulations, fetchSaveSimulations, fetchUsedVariables } from './api';

const mockFetchSimulations = fetchSimulations as ReturnType<typeof vi.fn>;
const mockFetchSaveSimulations = fetchSaveSimulations as ReturnType<typeof vi.fn>;
const mockFetchUsedVariables = fetchUsedVariables as ReturnType<typeof vi.fn>;

describe('simulations actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadSimulations', () => {
    it('clears error, sets loaded to false, fetches simulations, and dispatches setSimulations', async () => {
      const simulations = [makeSimulation({ name: 'Sim 1' }), makeSimulation({ name: 'Sim 2' })];

      mockFetchSimulations.mockResolvedValue(simulations);

      const dispatch = vi.fn();
      const thunk = loadSimulations();

      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(setSimulationsError(''));
      expect(dispatch).toHaveBeenCalledWith(setSimulationsLoaded(false));
      expect(mockFetchSimulations).toHaveBeenCalledTimes(1);

      // Verify setSimulations was called with correct data
      const setSimulationsCall = dispatch.mock.calls.find((call: any) => call[0]?.type === setSimulations.type);
      expect(setSimulationsCall).toBeDefined();
      expect(setSimulationsCall[0].payload).toEqual(simulations);

      // Verify loadUsedVariables thunk was dispatched (as a function)
      const thunkCalls = dispatch.mock.calls.filter((call: any) => typeof call[0] === 'function');
      expect(thunkCalls.length).toBeGreaterThan(0);
    });

    it('sets error message and loaded to true on failure', async () => {
      const error = new Error('Fetch failed');
      mockFetchSimulations.mockRejectedValue(error);

      const dispatch = vi.fn();
      const thunk = loadSimulations();

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toThrow('Fetch failed');

      expect(dispatch).toHaveBeenCalledWith(setSimulationsError(''));
      expect(dispatch).toHaveBeenCalledWith(setSimulationsLoaded(false));
      expect(dispatch).toHaveBeenCalledWith(setSimulationsError('Fetch failed'));
      expect(dispatch).toHaveBeenCalledWith(setSimulationsLoaded(true));
    });

    it('handles non-Error objects and sets default error message', async () => {
      mockFetchSimulations.mockRejectedValue('Unknown error');

      const dispatch = vi.fn();
      const thunk = loadSimulations();

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toBe('Unknown error');

      expect(dispatch).toHaveBeenCalledWith(setSimulationsError('Failed to load simulations'));
    });
  });

  describe('saveSimulations', () => {
    it('clears error, saves simulations, and triggers loadSimulations', async () => {
      const simulations = [makeSimulation({ name: 'Updated Sim' })];
      mockFetchSaveSimulations.mockResolvedValue(undefined);
      mockFetchSimulations.mockResolvedValue(simulations);
      mockFetchUsedVariables.mockResolvedValue({});

      const dispatch = vi.fn();
      const thunk = saveSimulations(simulations);

      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(setSimulationsError(''));
      expect(mockFetchSaveSimulations).toHaveBeenCalledWith(simulations);

      // Verify that a function (the loadSimulations thunk) was dispatched
      const thunkDispatches = dispatch.mock.calls.filter((call: any) => typeof call[0] === 'function');
      expect(thunkDispatches.length).toBeGreaterThan(0);
    });

    it('dispatches error message on save failure', async () => {
      const simulations = [makeSimulation()];
      const error = new Error('Save failed');
      mockFetchSaveSimulations.mockRejectedValue(error);

      const dispatch = vi.fn();
      const thunk = saveSimulations(simulations);

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toThrow('Save failed');

      expect(dispatch).toHaveBeenCalledWith(setSimulationsError(''));
      expect(dispatch).toHaveBeenCalledWith(setSimulationsError('Save failed'));
    });

    it('handles non-Error objects and sets default error message', async () => {
      const simulations = [makeSimulation()];
      mockFetchSaveSimulations.mockRejectedValue('Network error');

      const dispatch = vi.fn();
      const thunk = saveSimulations(simulations);

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toBe('Network error');

      expect(dispatch).toHaveBeenCalledWith(setSimulationsError('Failed to save simulations'));
    });
  });
});
