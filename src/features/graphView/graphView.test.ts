import { describe, it, expect } from 'vitest';
import reducer, {
  setGraphViewData,
  setGraphViewError,
  setGraphViewStartDate,
  setGraphViewEndDate,
  setGraphViewLoaded,
  updateSelectedAccounts,
  updateSelectedSimulations,
  setCombineAccounts,
} from './slice';
import {
  selectGraphViewDatasets,
  selectGraphViewLabels,
  selectGraphViewStartDate,
  selectGraphViewEndDate,
  selectGraphViewType,
  selectGraphViewLoaded,
  selectGraphViewError,
  selectSelectedAccounts,
  selectSelectedSimulations,
  selectCombineAccounts,
} from './select';
import { GraphData, Dataset } from '../../types/types';
import { RootState } from '../../store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRootState(graphViewOverrides: Partial<ReturnType<typeof reducer>> = {}): RootState {
  const base = reducer(undefined, { type: '@@init' });
  return {
    graphView: { ...base, ...graphViewOverrides },
  } as unknown as RootState;
}

function makeDataset(label: string): Dataset {
  return {
    label,
    data: [1000, 2000],
    borderColor: '#FF6B6B',
    borderDash: [],
    backgroundColor: 'rgba(0,0,0,0.5)',
    activity: { amount: 100, name: 'test' },
  };
}

// ---------------------------------------------------------------------------
// Reducer tests - basic actions
// ---------------------------------------------------------------------------

describe('graphViewSlice reducer', () => {
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

    it('has empty selectedAccounts array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.selectedAccounts).toEqual([]);
    });

    it('has empty selectedSimulations array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.selectedSimulations).toEqual([]);
    });

    it('has combineAccounts as true', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.combineAccounts).toBe(true);
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

  // ---------------------------------------------------------------------------
  // setGraphViewData — color/dash assignment logic
  // ---------------------------------------------------------------------------

  describe('setGraphViewData', () => {
    it('sets labels from first simulation', () => {
      const graphData: GraphData = {
        sim1: {
          datasets: [makeDataset('Checking')],
          labels: ['Jan', 'Feb', 'Mar'],
          type: 'activity',
        },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      expect(state.labels).toEqual(['Jan', 'Feb', 'Mar']);
    });

    it('sets type from first simulation', () => {
      const graphData: GraphData = {
        sim1: {
          datasets: [],
          labels: [],
          type: 'yearly',
        },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      expect(state.type).toBe('yearly');
    });

    it('marks loaded as true', () => {
      const graphData: GraphData = {
        sim1: { datasets: [], labels: [], type: 'activity' },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      expect(state.loaded).toBe(true);
    });

    it('appends simulation name to dataset label', () => {
      const graphData: GraphData = {
        sim1: {
          datasets: [makeDataset('Checking')],
          labels: [],
          type: 'activity',
        },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      expect(state.datasets[0].label).toBe('Checking (sim1)');
    });

    it('assigns borderColor based on account index within a simulation', () => {
      // lineColors[0] = '#FF6B6B', lineColors[1] = '#FFD93D'
      const graphData: GraphData = {
        sim1: {
          datasets: [makeDataset('Account A'), makeDataset('Account B')],
          labels: [],
          type: 'activity',
        },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      expect(state.datasets[0].borderColor).toBe('#FF6B6B');
      expect(state.datasets[1].borderColor).toBe('#FFD93D');
    });

    it('wraps color index using modulo when more accounts than colors', () => {
      // lineColors has 15 entries; account at index 15 wraps to index 0
      const datasets = Array.from({ length: 16 }, (_, i) => makeDataset(`Account ${i}`));
      const graphData: GraphData = {
        sim1: { datasets, labels: [], type: 'activity' },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      expect(state.datasets[15].borderColor).toBe(state.datasets[0].borderColor);
    });

    it('assigns borderDash based on simulation index', () => {
      // borderDashes[0] = [] (solid), borderDashes[1] = [10, 5]
      const graphData: GraphData = {
        sim1: {
          datasets: [makeDataset('Checking')],
          labels: [],
          type: 'activity',
        },
        sim2: {
          datasets: [makeDataset('Savings')],
          labels: [],
          type: 'activity',
        },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      const sim1Dataset = state.datasets.find(d => d.label === 'Checking (sim1)');
      const sim2Dataset = state.datasets.find(d => d.label === 'Savings (sim2)');
      expect(sim1Dataset?.borderDash).toEqual([]);
      expect(sim2Dataset?.borderDash).toEqual([10, 5]);
    });

    it('wraps borderDash index using modulo when more simulations than dash patterns', () => {
      // borderDashes has 6 entries; sim at index 6 wraps to index 0
      const simCount = 7;
      const graphData: GraphData = {};
      for (let i = 0; i < simCount; i++) {
        graphData[`sim${i}`] = {
          datasets: [makeDataset(`Account ${i}`)],
          labels: [],
          type: 'activity',
        };
      }
      const state = reducer(undefined, setGraphViewData(graphData));
      // sim6 (index 6) wraps to borderDashes[0] = []
      const sim6Dataset = state.datasets.find(d => d.label === 'Account 6 (sim6)');
      const sim0Dataset = state.datasets.find(d => d.label === 'Account 0 (sim0)');
      expect(sim6Dataset?.borderDash).toEqual(sim0Dataset?.borderDash);
    });

    it('produces correct dataset count from multiple simulations', () => {
      const graphData: GraphData = {
        sim1: {
          datasets: [makeDataset('Checking'), makeDataset('Savings')],
          labels: [],
          type: 'activity',
        },
        sim2: {
          datasets: [makeDataset('Roth')],
          labels: [],
          type: 'activity',
        },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      expect(state.datasets).toHaveLength(3);
    });

    it('uses account index per simulation, not global index, for color', () => {
      // Both sim1 and sim2 have one account each — both should use index 0 color
      const graphData: GraphData = {
        sim1: {
          datasets: [makeDataset('Account A')],
          labels: [],
          type: 'activity',
        },
        sim2: {
          datasets: [makeDataset('Account A')],
          labels: [],
          type: 'activity',
        },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      const sim1Color = state.datasets.find(d => d.label === 'Account A (sim1)')?.borderColor;
      const sim2Color = state.datasets.find(d => d.label === 'Account A (sim2)')?.borderColor;
      expect(sim1Color).toBe(sim2Color);
    });

    it('handles empty datasets in a simulation gracefully', () => {
      const graphData: GraphData = {
        sim1: { datasets: [], labels: ['Jan'], type: 'activity' },
      };
      const state = reducer(undefined, setGraphViewData(graphData));
      expect(state.datasets).toEqual([]);
      expect(state.labels).toEqual(['Jan']);
    });
  });

  describe('setGraphViewError', () => {
    it('sets the error string', () => {
      const state = reducer(undefined, setGraphViewError('API error'));
      expect(state.error).toBe('API error');
    });

    it('clears error when given empty string', () => {
      const pre = reducer(undefined, setGraphViewError('error'));
      const state = reducer(pre, setGraphViewError(''));
      expect(state.error).toBe('');
    });
  });

  describe('setGraphViewStartDate', () => {
    it('updates startDate', () => {
      const state = reducer(undefined, setGraphViewStartDate('2025-01-01'));
      expect(state.startDate).toBe('2025-01-01');
    });
  });

  describe('setGraphViewEndDate', () => {
    it('updates endDate', () => {
      const state = reducer(undefined, setGraphViewEndDate('2035-12-31'));
      expect(state.endDate).toBe('2035-12-31');
    });
  });

  describe('setGraphViewLoaded', () => {
    it('sets loaded to false', () => {
      const pre = reducer(
        undefined,
        setGraphViewData({ sim1: { datasets: [], labels: [], type: 'activity' } }),
      );
      const state = reducer(pre, setGraphViewLoaded(false));
      expect(state.loaded).toBe(false);
    });

    it('sets loaded to true', () => {
      const state = reducer(undefined, setGraphViewLoaded(true));
      expect(state.loaded).toBe(true);
    });
  });

  describe('updateSelectedAccounts', () => {
    it('sets selected accounts', () => {
      const state = reducer(undefined, updateSelectedAccounts(['acct-1']));
      expect(state.selectedAccounts).toEqual(['acct-1']);
    });

    it('replaces existing selected accounts', () => {
      const pre = reducer(undefined, updateSelectedAccounts(['acct-1']));
      const state = reducer(pre, updateSelectedAccounts(['acct-2', 'acct-3']));
      expect(state.selectedAccounts).toEqual(['acct-2', 'acct-3']);
    });
  });

  describe('updateSelectedSimulations', () => {
    it('sets selected simulations', () => {
      const state = reducer(undefined, updateSelectedSimulations(['sim-a', 'sim-b']));
      expect(state.selectedSimulations).toEqual(['sim-a', 'sim-b']);
    });

    it('replaces existing selected simulations', () => {
      const pre = reducer(undefined, updateSelectedSimulations(['sim-a']));
      const state = reducer(pre, updateSelectedSimulations(['sim-b']));
      expect(state.selectedSimulations).toEqual(['sim-b']);
    });
  });

  describe('setCombineAccounts', () => {
    it('sets combineAccounts to false', () => {
      const state = reducer(undefined, setCombineAccounts(false));
      expect(state.combineAccounts).toBe(false);
    });

    it('sets combineAccounts to true', () => {
      const pre = reducer(undefined, setCombineAccounts(false));
      const state = reducer(pre, setCombineAccounts(true));
      expect(state.combineAccounts).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// Selector tests
// ---------------------------------------------------------------------------

describe('graphView selectors', () => {
  it('selectGraphViewDatasets returns datasets', () => {
    const dataset = makeDataset('Test');
    const rootState = makeRootState({ datasets: [dataset] });
    expect(selectGraphViewDatasets(rootState)).toEqual([dataset]);
  });

  it('selectGraphViewLabels returns labels', () => {
    const rootState = makeRootState({ labels: ['Q1', 'Q2'] });
    expect(selectGraphViewLabels(rootState)).toEqual(['Q1', 'Q2']);
  });

  it('selectGraphViewStartDate returns startDate', () => {
    const rootState = makeRootState({ startDate: '2025-01-01' });
    expect(selectGraphViewStartDate(rootState)).toBe('2025-01-01');
  });

  it('selectGraphViewEndDate returns endDate', () => {
    const rootState = makeRootState({ endDate: '2035-12-31' });
    expect(selectGraphViewEndDate(rootState)).toBe('2035-12-31');
  });

  it('selectGraphViewType returns type', () => {
    const rootState = makeRootState({ type: 'yearly' });
    expect(selectGraphViewType(rootState)).toBe('yearly');
  });

  it('selectGraphViewLoaded returns loaded', () => {
    const rootState = makeRootState({ loaded: true });
    expect(selectGraphViewLoaded(rootState)).toBe(true);
  });

  it('selectGraphViewError returns error', () => {
    const rootState = makeRootState({ error: 'failed' });
    expect(selectGraphViewError(rootState)).toBe('failed');
  });

  it('selectSelectedAccounts returns selectedAccounts', () => {
    const rootState = makeRootState({ selectedAccounts: ['acct-1'] });
    expect(selectSelectedAccounts(rootState)).toEqual(['acct-1']);
  });

  it('selectSelectedSimulations returns selectedSimulations', () => {
    const rootState = makeRootState({ selectedSimulations: ['sim-a'] });
    expect(selectSelectedSimulations(rootState)).toEqual(['sim-a']);
  });

  it('selectCombineAccounts returns combineAccounts', () => {
    const rootState = makeRootState({ combineAccounts: false });
    expect(selectCombineAccounts(rootState)).toBe(false);
  });
});
