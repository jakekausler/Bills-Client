import { describe, it, expect } from 'vitest';
import healthcareReducer, {
  setLoading,
  setError,
  setConfigs,
  addConfig,
  updateConfig,
  removeConfig,
  clearError,
} from './slice';

describe('healthcare slice', () => {
  it('should return initial state', () => {
    const state = healthcareReducer(undefined, { type: 'unknown' });
    expect(state.configs).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle setLoading', () => {
    const state = healthcareReducer(undefined, setLoading(true));
    expect(state.loading).toBe(true);
  });

  it('should handle setError', () => {
    const state = healthcareReducer(undefined, setError('error'));
    expect(state.error).toBe('error');
    expect(state.loading).toBe(false);
  });

  it('should handle setConfigs', () => {
    const configs = [{ id: '1', name: 'Test' }] as any;
    const state = healthcareReducer(undefined, setConfigs(configs));
    expect(state.configs).toEqual(configs);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle addConfig', () => {
    const config = { id: '1', name: 'Test' } as any;
    const state = healthcareReducer(undefined, addConfig(config));
    expect(state.configs).toHaveLength(1);
    expect(state.configs[0]).toEqual(config);
  });

  it('should handle updateConfig', () => {
    const initialState = {
      configs: [{ id: '1', name: 'Old' }] as any,
      loading: false,
      error: null,
    };
    const updatedConfig = { id: '1', name: 'New' } as any;
    const state = healthcareReducer(initialState, updateConfig(updatedConfig));
    expect(state.configs[0].name).toBe('New');
  });

  it('should handle removeConfig', () => {
    const initialState = {
      configs: [{ id: '1', name: 'Test' }, { id: '2', name: 'Test2' }] as any,
      loading: false,
      error: null,
    };
    const state = healthcareReducer(initialState, removeConfig('1'));
    expect(state.configs).toHaveLength(1);
    expect(state.configs[0].id).toBe('2');
  });

  it('should handle clearError', () => {
    const initialState = { configs: [], loading: false, error: 'error' };
    const state = healthcareReducer(initialState, clearError());
    expect(state.error).toBe(null);
  });
});
