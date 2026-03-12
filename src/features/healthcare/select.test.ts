import { describe, it, expect } from 'vitest';
import {
  selectHealthcareConfigs,
  selectHealthcareLoading,
  selectHealthcareError,
  selectConfigsByPerson,
  selectActiveConfigs,
  selectHSAAccounts,
} from './select';

describe('healthcare selectors', () => {
  it('should select configs', () => {
    const configs = [{ id: '1', name: 'Test' }];
    const state = { healthcare: { configs } } as any;
    expect(selectHealthcareConfigs(state)).toEqual(configs);
  });

  it('should select loading', () => {
    const state = { healthcare: { loading: true } } as any;
    expect(selectHealthcareLoading(state)).toBe(true);
  });

  it('should select error', () => {
    const state = { healthcare: { error: 'error' } } as any;
    expect(selectHealthcareError(state)).toBe('error');
  });

  it('should select configs by person', () => {
    const configs = [
      { id: '1', coveredPersons: ['Alice', 'Bob'] },
      { id: '2', coveredPersons: ['Alice'] },
      { id: '3', coveredPersons: ['Charlie'] },
    ];
    const state = { healthcare: { configs } } as any;
    const selector = selectConfigsByPerson('Alice');
    const result = selector(state);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('should select active configs on date', () => {
    const configs = [
      { id: '1', startDate: '2026-01-01', endDate: '2026-12-31' },
      { id: '2', startDate: '2025-01-01', endDate: '2025-12-31' },
      { id: '3', startDate: '2026-01-01', endDate: null },
    ];
    const state = { healthcare: { configs } } as any;
    const selector = selectActiveConfigs('2026-06-15');
    const result = selector(state);
    expect(result).toHaveLength(2);
    expect(result.map((c: any) => c.id)).toEqual(['1', '3']);
  });

  it('should select HSA accounts', () => {
    const configs = [
      { id: '1', hsaAccountId: 'hsa-1' },
      { id: '2', hsaAccountId: null },
      { id: '3', hsaAccountId: 'hsa-2' },
    ];
    const state = { healthcare: { configs } } as any;
    const result = selectHSAAccounts(state);
    expect(result).toEqual(['hsa-1', 'hsa-2']);
  });
});
