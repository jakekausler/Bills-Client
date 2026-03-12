import { describe, it, expect } from 'vitest';
import reducer, {
  updateSelectedAccounts,
  setFlow,
  setFlowError,
  setFlowLoaded,
  updateStartDate,
  updateEndDate,
} from './slice';
import {
  selectFlow,
  selectFlowLoaded,
  selectFlowError,
  selectFlowSelectedAccounts,
  selectFlowStartDate,
  selectFlowEndDate,
} from './select';
import { Flow } from '../../types/types';
import { RootState } from '../../store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRootState(flowOverrides: Partial<ReturnType<typeof reducer>> = {}): RootState {
  const base = reducer(undefined, { type: '@@init' });
  return {
    flow: { ...base, ...flowOverrides },
  } as unknown as RootState;
}

const sampleFlow: Flow = {
  nodes: [
    { name: 'Income', x0: 0, y0: 0, y1: 100, value: 5000 },
    { name: 'Checking', x0: 1, y0: 0, y1: 80, value: 4000 },
  ] as Flow['nodes'],
  links: [
    { source: 0, target: 1, value: 4000 },
  ] as Flow['links'],
};

// ---------------------------------------------------------------------------
// Reducer tests
// ---------------------------------------------------------------------------

describe('flowSlice reducer', () => {
  describe('initial state', () => {
    it('has empty nodes in flow', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.flow.nodes).toEqual([]);
    });

    it('has empty links in flow', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.flow.links).toEqual([]);
    });

    it('has flowLoaded as false', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.flowLoaded).toBe(false);
    });

    it('has empty flowError string', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.flowError).toBe('');
    });

    it('has empty selectedAccounts array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.selectedAccounts).toEqual([]);
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

  describe('setFlow', () => {
    it('sets the flow data', () => {
      const state = reducer(undefined, setFlow(sampleFlow));
      expect(state.flow).toEqual(sampleFlow);
    });

    it('marks flowLoaded as true', () => {
      const state = reducer(undefined, setFlow(sampleFlow));
      expect(state.flowLoaded).toBe(true);
    });

    it('sets flow with nodes and links', () => {
      const state = reducer(undefined, setFlow(sampleFlow));
      expect(state.flow.nodes).toHaveLength(2);
      expect(state.flow.links).toHaveLength(1);
    });

    it('replaces existing flow data', () => {
      const pre = reducer(undefined, setFlow(sampleFlow));
      const newFlow: Flow = { nodes: [], links: [] };
      const state = reducer(pre, setFlow(newFlow));
      expect(state.flow.nodes).toHaveLength(0);
      expect(state.flow.links).toHaveLength(0);
    });
  });

  describe('setFlowError', () => {
    it('sets the flowError', () => {
      const state = reducer(undefined, setFlowError('Load failed'));
      expect(state.flowError).toBe('Load failed');
    });

    it('clears the flowError when given empty string', () => {
      const pre = reducer(undefined, setFlowError('error'));
      const state = reducer(pre, setFlowError(''));
      expect(state.flowError).toBe('');
    });
  });

  describe('setFlowLoaded', () => {
    it('sets flowLoaded to false', () => {
      const pre = reducer(undefined, setFlow(sampleFlow));
      const state = reducer(pre, setFlowLoaded(false));
      expect(state.flowLoaded).toBe(false);
    });

    it('sets flowLoaded to true', () => {
      const state = reducer(undefined, setFlowLoaded(true));
      expect(state.flowLoaded).toBe(true);
    });
  });

  describe('updateSelectedAccounts', () => {
    it('sets selected accounts', () => {
      const state = reducer(undefined, updateSelectedAccounts(['acct-1', 'acct-2']));
      expect(state.selectedAccounts).toEqual(['acct-1', 'acct-2']);
    });

    it('replaces existing selected accounts', () => {
      const pre = reducer(undefined, updateSelectedAccounts(['acct-1']));
      const state = reducer(pre, updateSelectedAccounts(['acct-3']));
      expect(state.selectedAccounts).toEqual(['acct-3']);
    });

    it('clears selected accounts with empty array', () => {
      const pre = reducer(undefined, updateSelectedAccounts(['acct-1']));
      const state = reducer(pre, updateSelectedAccounts([]));
      expect(state.selectedAccounts).toEqual([]);
    });
  });

  describe('updateStartDate', () => {
    it('updates the startDate', () => {
      const state = reducer(undefined, updateStartDate('2025-01-01'));
      expect(state.startDate).toBe('2025-01-01');
    });
  });

  describe('updateEndDate', () => {
    it('updates the endDate', () => {
      const state = reducer(undefined, updateEndDate('2025-12-31'));
      expect(state.endDate).toBe('2025-12-31');
    });
  });
});

// ---------------------------------------------------------------------------
// Selector tests
// ---------------------------------------------------------------------------

describe('flow selectors', () => {
  it('selectFlow returns the flow data', () => {
    const rootState = makeRootState({ flow: sampleFlow });
    expect(selectFlow(rootState)).toEqual(sampleFlow);
  });

  it('selectFlowLoaded returns flowLoaded', () => {
    const rootState = makeRootState({ flowLoaded: true });
    expect(selectFlowLoaded(rootState)).toBe(true);
  });

  it('selectFlowError returns flowError', () => {
    const rootState = makeRootState({ flowError: 'timeout' });
    expect(selectFlowError(rootState)).toBe('timeout');
  });

  it('selectFlowSelectedAccounts returns selectedAccounts', () => {
    const rootState = makeRootState({ selectedAccounts: ['checking'] });
    expect(selectFlowSelectedAccounts(rootState)).toEqual(['checking']);
  });

  it('selectFlowStartDate returns startDate', () => {
    const rootState = makeRootState({ startDate: '2025-03-01' });
    expect(selectFlowStartDate(rootState)).toBe('2025-03-01');
  });

  it('selectFlowEndDate returns endDate', () => {
    const rootState = makeRootState({ endDate: '2025-03-31' });
    expect(selectFlowEndDate(rootState)).toBe('2025-03-31');
  });
});
