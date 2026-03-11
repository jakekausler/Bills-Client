import { describe, it, expect } from 'vitest';
import reducer, {
  setLoading,
  setError,
  setConfigs,
  addConfig,
  updateConfig,
  removeConfig,
  clearError,
} from './slice';
import {
  selectHealthcareConfigs,
  selectHealthcareLoading,
  selectHealthcareError,
  selectConfigsByPerson,
  selectActiveConfigs,
  selectHSAAccounts,
} from './select';
import { HealthcareConfig } from '../../types/types';
import { RootState } from '../../store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRootState(healthcareOverrides: Partial<ReturnType<typeof reducer>> = {}): RootState {
  const base = reducer(undefined, { type: '@@init' });
  return {
    healthcare: { ...base, ...healthcareOverrides },
  } as unknown as RootState;
}

function makeConfig(overrides: Partial<HealthcareConfig> = {}): HealthcareConfig {
  return {
    id: 'config-1',
    name: 'Family Plan',
    coveredPersons: ['Alice', 'Bob'],
    startDate: '2024-01-01',
    endDate: null,
    individualDeductible: 1500,
    individualOutOfPocketMax: 5000,
    familyDeductible: 3000,
    familyOutOfPocketMax: 10000,
    hsaAccountId: null,
    hsaReimbursementEnabled: false,
    resetMonth: 1,
    resetDay: 1,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Reducer tests
// ---------------------------------------------------------------------------

describe('healthcareSlice reducer', () => {
  describe('initial state', () => {
    it('has empty configs array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.configs).toEqual([]);
    });

    it('has loading as false', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.loading).toBe(false);
    });

    it('has error as null', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('sets loading to true', () => {
      const state = reducer(undefined, setLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets loading to false', () => {
      const pre = reducer(undefined, setLoading(true));
      const state = reducer(pre, setLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('sets error message', () => {
      const state = reducer(undefined, setError('Network failure'));
      expect(state.error).toBe('Network failure');
    });

    it('sets error to null', () => {
      const pre = reducer(undefined, setError('some error'));
      const state = reducer(pre, setError(null));
      expect(state.error).toBeNull();
    });
  });

  describe('setConfigs', () => {
    it('sets the configs array', () => {
      const config = makeConfig();
      const state = reducer(undefined, setConfigs([config]));
      expect(state.configs).toEqual([config]);
    });

    it('sets loading to false after setConfigs', () => {
      const pre = reducer(undefined, setLoading(true));
      const state = reducer(pre, setConfigs([makeConfig()]));
      expect(state.loading).toBe(false);
    });

    it('clears error after setConfigs', () => {
      const pre = reducer(undefined, setError('previous error'));
      const state = reducer(pre, setConfigs([]));
      expect(state.error).toBeNull();
    });

    it('replaces existing configs', () => {
      const pre = reducer(undefined, setConfigs([makeConfig({ id: 'old', name: 'Old Plan' })]));
      const newConfig = makeConfig({ id: 'new', name: 'New Plan' });
      const state = reducer(pre, setConfigs([newConfig]));
      expect(state.configs).toHaveLength(1);
      expect(state.configs[0].name).toBe('New Plan');
    });
  });

  describe('addConfig', () => {
    it('appends a new config', () => {
      const config = makeConfig({ id: 'config-1' });
      const state = reducer(undefined, addConfig(config));
      expect(state.configs).toHaveLength(1);
      expect(state.configs[0]).toEqual(config);
    });

    it('adds to existing configs without removing them', () => {
      const pre = reducer(undefined, setConfigs([makeConfig({ id: 'config-1' })]));
      const state = reducer(pre, addConfig(makeConfig({ id: 'config-2', name: 'Individual Plan' })));
      expect(state.configs).toHaveLength(2);
    });
  });

  describe('updateConfig', () => {
    it('updates the config matching the id', () => {
      const original = makeConfig({ id: 'config-1', name: 'Old Name' });
      const pre = reducer(undefined, setConfigs([original]));
      const updated = makeConfig({ id: 'config-1', name: 'New Name' });
      const state = reducer(pre, updateConfig(updated));
      expect(state.configs[0].name).toBe('New Name');
    });

    it('does not change other configs', () => {
      const pre = reducer(
        undefined,
        setConfigs([
          makeConfig({ id: 'config-1', name: 'Plan A' }),
          makeConfig({ id: 'config-2', name: 'Plan B' }),
        ]),
      );
      const state = reducer(pre, updateConfig(makeConfig({ id: 'config-1', name: 'Plan A Updated' })));
      expect(state.configs[1].name).toBe('Plan B');
    });

    it('does nothing when config id does not exist', () => {
      const config = makeConfig({ id: 'config-1' });
      const pre = reducer(undefined, setConfigs([config]));
      const state = reducer(pre, updateConfig(makeConfig({ id: 'nonexistent', name: 'Ghost' })));
      expect(state.configs).toHaveLength(1);
      expect(state.configs[0].id).toBe('config-1');
    });
  });

  describe('removeConfig', () => {
    it('removes the config with the given id', () => {
      const pre = reducer(undefined, setConfigs([makeConfig({ id: 'config-1' })]));
      const state = reducer(pre, removeConfig('config-1'));
      expect(state.configs).toHaveLength(0);
    });

    it('does not remove other configs', () => {
      const pre = reducer(
        undefined,
        setConfigs([
          makeConfig({ id: 'config-1', name: 'Keep' }),
          makeConfig({ id: 'config-2', name: 'Remove' }),
        ]),
      );
      const state = reducer(pre, removeConfig('config-2'));
      expect(state.configs).toHaveLength(1);
      expect(state.configs[0].name).toBe('Keep');
    });

    it('does nothing when the id does not exist', () => {
      const pre = reducer(undefined, setConfigs([makeConfig({ id: 'config-1' })]));
      const state = reducer(pre, removeConfig('nonexistent'));
      expect(state.configs).toHaveLength(1);
    });
  });

  describe('clearError', () => {
    it('clears the error', () => {
      const pre = reducer(undefined, setError('something bad'));
      const state = reducer(pre, clearError());
      expect(state.error).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Selector tests
// ---------------------------------------------------------------------------

describe('healthcare selectors', () => {
  it('selectHealthcareConfigs returns configs array', () => {
    const config = makeConfig();
    const rootState = makeRootState({ configs: [config] });
    expect(selectHealthcareConfigs(rootState)).toEqual([config]);
  });

  it('selectHealthcareLoading returns loading', () => {
    const rootState = makeRootState({ loading: true });
    expect(selectHealthcareLoading(rootState)).toBe(true);
  });

  it('selectHealthcareError returns error', () => {
    const rootState = makeRootState({ error: 'whoops' });
    expect(selectHealthcareError(rootState)).toBe('whoops');
  });

  describe('selectConfigsByPerson', () => {
    it('returns configs where person is in coveredPersons', () => {
      const aliceConfig = makeConfig({ id: 'c1', coveredPersons: ['Alice', 'Bob'] });
      const bobOnlyConfig = makeConfig({ id: 'c2', coveredPersons: ['Bob'] });
      const rootState = makeRootState({ configs: [aliceConfig, bobOnlyConfig] });
      const result = selectConfigsByPerson('Alice')(rootState);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('c1');
    });

    it('returns empty array when no configs cover the person', () => {
      const config = makeConfig({ coveredPersons: ['Bob'] });
      const rootState = makeRootState({ configs: [config] });
      const result = selectConfigsByPerson('Charlie')(rootState);
      expect(result).toEqual([]);
    });

    it('returns multiple configs if person is in multiple', () => {
      const configs = [
        makeConfig({ id: 'c1', coveredPersons: ['Alice'] }),
        makeConfig({ id: 'c2', coveredPersons: ['Alice', 'Bob'] }),
        makeConfig({ id: 'c3', coveredPersons: ['Bob'] }),
      ];
      const rootState = makeRootState({ configs });
      const result = selectConfigsByPerson('Alice')(rootState);
      expect(result).toHaveLength(2);
    });
  });

  describe('selectActiveConfigs', () => {
    it('returns config when current date is after startDate and endDate is null', () => {
      const config = makeConfig({ startDate: '2024-01-01', endDate: null });
      const rootState = makeRootState({ configs: [config] });
      const result = selectActiveConfigs('2024-06-01')(rootState);
      expect(result).toHaveLength(1);
    });

    it('returns config when current date is within startDate and endDate', () => {
      const config = makeConfig({ startDate: '2024-01-01', endDate: '2024-12-31' });
      const rootState = makeRootState({ configs: [config] });
      const result = selectActiveConfigs('2024-06-15')(rootState);
      expect(result).toHaveLength(1);
    });

    it('excludes config when current date is before startDate', () => {
      const config = makeConfig({ startDate: '2025-01-01', endDate: null });
      const rootState = makeRootState({ configs: [config] });
      const result = selectActiveConfigs('2024-01-01')(rootState);
      expect(result).toHaveLength(0);
    });

    it('excludes config when current date is after endDate', () => {
      const config = makeConfig({ startDate: '2024-01-01', endDate: '2024-06-30' });
      const rootState = makeRootState({ configs: [config] });
      const result = selectActiveConfigs('2024-07-01')(rootState);
      expect(result).toHaveLength(0);
    });

    it('includes config when current date equals startDate', () => {
      const config = makeConfig({ startDate: '2024-06-01', endDate: null });
      const rootState = makeRootState({ configs: [config] });
      const result = selectActiveConfigs('2024-06-01')(rootState);
      expect(result).toHaveLength(1);
    });

    it('includes config when current date equals endDate', () => {
      const config = makeConfig({ startDate: '2024-01-01', endDate: '2024-06-30' });
      const rootState = makeRootState({ configs: [config] });
      const result = selectActiveConfigs('2024-06-30')(rootState);
      expect(result).toHaveLength(1);
    });

    it('returns multiple active configs', () => {
      const configs = [
        makeConfig({ id: 'c1', startDate: '2024-01-01', endDate: null }),
        makeConfig({ id: 'c2', startDate: '2024-03-01', endDate: '2024-12-31' }),
        makeConfig({ id: 'c3', startDate: '2025-01-01', endDate: null }), // future
      ];
      const rootState = makeRootState({ configs });
      const result = selectActiveConfigs('2024-06-01')(rootState);
      expect(result).toHaveLength(2);
    });
  });

  describe('selectHSAAccounts', () => {
    it('returns hsaAccountId values where not null', () => {
      const configs = [
        makeConfig({ id: 'c1', hsaAccountId: 'hsa-123' }),
        makeConfig({ id: 'c2', hsaAccountId: null }),
        makeConfig({ id: 'c3', hsaAccountId: 'hsa-456' }),
      ];
      const rootState = makeRootState({ configs });
      const result = selectHSAAccounts(rootState);
      expect(result).toEqual(['hsa-123', 'hsa-456']);
    });

    it('returns empty array when all hsaAccountId are null', () => {
      const configs = [makeConfig({ hsaAccountId: null })];
      const rootState = makeRootState({ configs });
      expect(selectHSAAccounts(rootState)).toEqual([]);
    });

    it('returns empty array when configs is empty', () => {
      const rootState = makeRootState({ configs: [] });
      expect(selectHSAAccounts(rootState)).toEqual([]);
    });
  });
});
