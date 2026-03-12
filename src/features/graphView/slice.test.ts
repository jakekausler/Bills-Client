import { describe, it, expect } from 'vitest';
import graphViewReducer, {
  setGraphViewData,
  setGraphViewError,
  setGraphViewStartDate,
  setGraphViewEndDate,
  setGraphViewLoaded,
  updateSelectedAccounts,
  updateSelectedSimulations,
  setCombineAccounts,
} from './slice';

describe('graphView slice', () => {
  it('should return initial state', () => {
    const state = graphViewReducer(undefined, { type: 'unknown' });
    expect(state.datasets).toEqual([]);
    expect(state.labels).toEqual([]);
    expect(state.type).toBe('activity');
    expect(state.loaded).toBe(false);
    expect(state.error).toBe('');
    expect(state.combineAccounts).toBe(true);
  });

  it('should handle setGraphViewData with data', () => {
    const mockData = {
      'Base Case': {
        datasets: [{ label: 'Account 1', data: [1, 2, 3] }],
        labels: ['Jan', 'Feb', 'Mar'],
        type: 'activity' as const,
      },
    };
    const state = graphViewReducer(undefined, setGraphViewData(mockData as any));
    expect(state.datasets).toHaveLength(1);
    expect(state.datasets[0].label).toBe('Account 1 (Base Case)');
    expect(state.labels).toEqual(['Jan', 'Feb', 'Mar']);
    expect(state.type).toBe('activity');
    expect(state.loaded).toBe(true);
    expect(state.error).toBe('');
  });

  it('should handle setGraphViewData with empty data', () => {
    const state = graphViewReducer(undefined, setGraphViewData({} as any));
    expect(state.datasets).toEqual([]);
    expect(state.labels).toEqual([]);
    expect(state.loaded).toBe(true);
  });

  it('should handle setGraphViewError', () => {
    const state = graphViewReducer(undefined, setGraphViewError('error'));
    expect(state.error).toBe('error');
  });

  it('should handle setGraphViewStartDate', () => {
    const state = graphViewReducer(undefined, setGraphViewStartDate('2026-04-01'));
    expect(state.startDate).toBe('2026-04-01');
  });

  it('should handle setGraphViewEndDate', () => {
    const state = graphViewReducer(undefined, setGraphViewEndDate('2026-12-31'));
    expect(state.endDate).toBe('2026-12-31');
  });

  it('should handle setGraphViewLoaded', () => {
    const state = graphViewReducer(undefined, setGraphViewLoaded(true));
    expect(state.loaded).toBe(true);
  });

  it('should handle updateSelectedAccounts', () => {
    const state = graphViewReducer(undefined, updateSelectedAccounts(['acc-1']));
    expect(state.selectedAccounts).toEqual(['acc-1']);
  });

  it('should handle updateSelectedSimulations', () => {
    const state = graphViewReducer(undefined, updateSelectedSimulations(['sim-1']));
    expect(state.selectedSimulations).toEqual(['sim-1']);
  });

  it('should handle setCombineAccounts', () => {
    const state = graphViewReducer(undefined, setCombineAccounts(false));
    expect(state.combineAccounts).toBe(false);
  });
});
