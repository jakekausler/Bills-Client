import { describe, it, expect } from 'vitest';
import {
  selectGraphViewDatasets,
  selectGraphViewLabels,
  selectGraphViewStartDate,
  selectGraphViewEndDate,
  selectGraphViewType,
  selectGraphViewLoaded,
  selectGraphViewError,
  selectGraphViewSelectedAccounts,
  selectSelectedSimulations,
  selectCombineAccounts,
} from './select';

describe('graphView selectors', () => {
  it('should select datasets', () => {
    const datasets = [{ label: 'Test', data: [1, 2, 3] }];
    const state = { graphView: { datasets } } as any;
    expect(selectGraphViewDatasets(state)).toEqual(datasets);
  });

  it('should select labels', () => {
    const labels = ['Jan', 'Feb', 'Mar'];
    const state = { graphView: { labels } } as any;
    expect(selectGraphViewLabels(state)).toEqual(labels);
  });

  it('should select startDate', () => {
    const state = { graphView: { startDate: '2026-03-01' } } as any;
    expect(selectGraphViewStartDate(state)).toBe('2026-03-01');
  });

  it('should select endDate', () => {
    const state = { graphView: { endDate: '2026-12-31' } } as any;
    expect(selectGraphViewEndDate(state)).toBe('2026-12-31');
  });

  it('should select type', () => {
    const state = { graphView: { type: 'yearly' } } as any;
    expect(selectGraphViewType(state)).toBe('yearly');
  });

  it('should select loaded', () => {
    const state = { graphView: { loaded: true } } as any;
    expect(selectGraphViewLoaded(state)).toBe(true);
  });

  it('should select error', () => {
    const state = { graphView: { error: 'error' } } as any;
    expect(selectGraphViewError(state)).toBe('error');
  });

  it('should select selectedAccounts', () => {
    const state = { graphView: { selectedAccounts: ['acc-1'] } } as any;
    expect(selectGraphViewSelectedAccounts(state)).toEqual(['acc-1']);
  });

  it('should select selectedSimulations', () => {
    const state = { graphView: { selectedSimulations: ['sim-1'] } } as any;
    expect(selectSelectedSimulations(state)).toEqual(['sim-1']);
  });

  it('should select combineAccounts', () => {
    const state = { graphView: { combineAccounts: true } } as any;
    expect(selectCombineAccounts(state)).toBe(true);
  });
});
