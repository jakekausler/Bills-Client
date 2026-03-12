import { describe, it, expect } from 'vitest';
import reducer, {
  setGraphData,
  setGraphError,
  setGraphStartDate,
  setGraphEndDate,
  toggleGraph,
  updateGraphLoaded,
} from './slice';
import {
  selectGraphDatasets,
  selectGraphLabels,
  selectGraphType,
  selectGraphLoaded,
  selectGraphStartDate,
  selectGraphEndDate,
  selectGraphError,
} from './select';
import { Dataset } from '../../types/types';
import { RootState } from '../../store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRootState(graphOverrides: Partial<ReturnType<typeof reducer>> = {}): RootState {
  const base = reducer(undefined, { type: '@@init' });
  return {
    graph: { ...base, ...graphOverrides },
  } as unknown as RootState;
}

const sampleDataset: Dataset = {
  label: 'Checking Account',
  data: [1000, 1100, 900],
  borderColor: '#FF6B6B',
  borderDash: [],
  backgroundColor: 'rgba(255, 107, 107, 0.5)',
  activity: { amount: 100, name: 'deposit' },
};

// ---------------------------------------------------------------------------
// Reducer tests
// ---------------------------------------------------------------------------

describe('graphSlice reducer', () => {
  describe('initial state', () => {
    it('has empty datasets array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.datasets).toEqual([]);
    });

    it('has empty labels array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.labels).toEqual([]);
    });

    it('has type "activity"', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.type).toBe('activity');
    });

    it('has loaded as false', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.loaded).toBe(false);
    });

    it('has empty error string', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.error).toBe('');
    });

    it('has show as true', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.show).toBe(true);
    });

    it('has valid YYYY-MM-DD startDate', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('has valid YYYY-MM-DD endDate', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('setGraphData', () => {
    it('sets datasets', () => {
      const state = reducer(
        undefined,
        setGraphData({ datasets: [sampleDataset], labels: ['2024-01', '2024-02'], type: 'activity' }),
      );
      expect(state.datasets).toEqual([sampleDataset]);
    });

    it('sets labels', () => {
      const state = reducer(
        undefined,
        setGraphData({ datasets: [], labels: ['2024-01', '2024-02'], type: 'yearly' }),
      );
      expect(state.labels).toEqual(['2024-01', '2024-02']);
    });

    it('sets type to "yearly"', () => {
      const state = reducer(
        undefined,
        setGraphData({ datasets: [], labels: [], type: 'yearly' }),
      );
      expect(state.type).toBe('yearly');
    });

    it('sets type to "activity"', () => {
      const state = reducer(
        undefined,
        setGraphData({ datasets: [], labels: [], type: 'activity' }),
      );
      expect(state.type).toBe('activity');
    });

    it('marks loaded as true', () => {
      const state = reducer(
        undefined,
        setGraphData({ datasets: [], labels: [], type: 'activity' }),
      );
      expect(state.loaded).toBe(true);
    });

    it('replaces existing datasets', () => {
      const pre = reducer(
        undefined,
        setGraphData({ datasets: [sampleDataset], labels: [], type: 'activity' }),
      );
      const newDataset = { ...sampleDataset, label: 'Savings' };
      const state = reducer(pre, setGraphData({ datasets: [newDataset], labels: [], type: 'activity' }));
      expect(state.datasets).toHaveLength(1);
      expect(state.datasets[0].label).toBe('Savings');
    });
  });

  describe('setGraphError', () => {
    it('sets the error string', () => {
      const state = reducer(undefined, setGraphError('Server error'));
      expect(state.error).toBe('Server error');
    });

    it('clears the error when given empty string', () => {
      const pre = reducer(undefined, setGraphError('fail'));
      const state = reducer(pre, setGraphError(''));
      expect(state.error).toBe('');
    });
  });

  describe('setGraphStartDate', () => {
    it('updates startDate', () => {
      const state = reducer(undefined, setGraphStartDate('2025-03-01'));
      expect(state.startDate).toBe('2025-03-01');
    });
  });

  describe('setGraphEndDate', () => {
    it('updates endDate', () => {
      const state = reducer(undefined, setGraphEndDate('2027-03-01'));
      expect(state.endDate).toBe('2027-03-01');
    });
  });

  describe('toggleGraph', () => {
    it('toggles show from true to false', () => {
      const state = reducer(undefined, toggleGraph());
      expect(state.show).toBe(false);
    });

    it('toggles show from false back to true', () => {
      const pre = reducer(undefined, toggleGraph());
      const state = reducer(pre, toggleGraph());
      expect(state.show).toBe(true);
    });
  });

  describe('updateGraphLoaded', () => {
    it('sets loaded to false', () => {
      const pre = reducer(
        undefined,
        setGraphData({ datasets: [], labels: [], type: 'activity' }),
      );
      const state = reducer(pre, updateGraphLoaded(false));
      expect(state.loaded).toBe(false);
    });

    it('sets loaded to true', () => {
      const state = reducer(undefined, updateGraphLoaded(true));
      expect(state.loaded).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// Selector tests
// ---------------------------------------------------------------------------

describe('graph selectors', () => {
  it('selectGraphDatasets returns datasets', () => {
    const rootState = makeRootState({ datasets: [sampleDataset] });
    expect(selectGraphDatasets(rootState)).toEqual([sampleDataset]);
  });

  it('selectGraphLabels returns labels', () => {
    const rootState = makeRootState({ labels: ['Jan', 'Feb'] });
    expect(selectGraphLabels(rootState)).toEqual(['Jan', 'Feb']);
  });

  it('selectGraphType returns type', () => {
    const rootState = makeRootState({ type: 'yearly' });
    expect(selectGraphType(rootState)).toBe('yearly');
  });

  it('selectGraphLoaded returns loaded', () => {
    const rootState = makeRootState({ loaded: true });
    expect(selectGraphLoaded(rootState)).toBe(true);
  });

  it('selectGraphStartDate returns startDate', () => {
    const rootState = makeRootState({ startDate: '2025-01-01' });
    expect(selectGraphStartDate(rootState)).toBe('2025-01-01');
  });

  it('selectGraphEndDate returns endDate', () => {
    const rootState = makeRootState({ endDate: '2027-01-01' });
    expect(selectGraphEndDate(rootState)).toBe('2027-01-01');
  });

  it('selectGraphError returns error', () => {
    const rootState = makeRootState({ error: '' });
    expect(selectGraphError(rootState)).toBe('');
  });

  it('selectGraphError returns error message', () => {
    const rootState = makeRootState({ error: 'Failed to load graph data' });
    expect(selectGraphError(rootState)).toBe('Failed to load graph data');
  });
});
