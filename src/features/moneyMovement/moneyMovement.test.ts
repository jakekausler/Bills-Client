import { describe, it, expect } from 'vitest';
import reducer, {
  setMoneyMovementData,
  setMoneyMovementLoading,
  setMoneyMovementError,
  setMoneyMovementStartDate,
  setMoneyMovementEndDate,
} from './slice';
import {
  selectMoneyMovementLoading,
  selectMoneyMovementError,
  selectMoneyMovementLabels,
  selectMoneyMovementDatasets,
  selectMoneyMovementStartDate,
  selectMoneyMovementEndDate,
} from './select';
import { RootState } from '../../store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRootState(moneyMovementOverrides: Partial<ReturnType<typeof reducer>> = {}): RootState {
  const base = reducer(undefined, { type: '@@init' });
  return {
    moneyMovement: { ...base, ...moneyMovementOverrides },
  } as unknown as RootState;
}

const sampleMoneyMovementData = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'Income',
      data: [3000, 3200, 3100],
    },
  ],
};

// ---------------------------------------------------------------------------
// Reducer tests
// ---------------------------------------------------------------------------

describe('moneyMovementSlice reducer', () => {
  describe('initial state', () => {
    it('has data as null', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.data).toBeNull();
    });

    it('has loading as false', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.loading).toBe(false);
    });

    it('has empty error string', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.error).toBe('');
    });

    it('has valid YYYY-MM-DD startDate', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('has valid YYYY-MM-DD endDate', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('startDate defaults to a date in the future relative to now', () => {
      const state = reducer(undefined, { type: '@@init' });
      const now = new Date().getFullYear();
      const startYear = parseInt(state.startDate.split('-')[0], 10);
      expect(startYear).toBeGreaterThanOrEqual(now);
    });
  });

  describe('setMoneyMovementData', () => {
    it('sets data', () => {
      const state = reducer(undefined, setMoneyMovementData(sampleMoneyMovementData as any));
      expect(state.data).toEqual(sampleMoneyMovementData);
    });

    it('sets loading to false after data is set', () => {
      const pre = reducer(undefined, setMoneyMovementLoading(true));
      const state = reducer(pre, setMoneyMovementData(sampleMoneyMovementData as any));
      expect(state.loading).toBe(false);
    });

    it('sets data to null when given null', () => {
      const pre = reducer(undefined, setMoneyMovementData(sampleMoneyMovementData as any));
      const state = reducer(pre, setMoneyMovementData(null));
      expect(state.data).toBeNull();
    });
  });

  describe('setMoneyMovementLoading', () => {
    it('sets loading to true', () => {
      const state = reducer(undefined, setMoneyMovementLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets loading to false', () => {
      const pre = reducer(undefined, setMoneyMovementLoading(true));
      const state = reducer(pre, setMoneyMovementLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('setMoneyMovementError', () => {
    it('sets error string', () => {
      const state = reducer(undefined, setMoneyMovementError('Server unavailable'));
      expect(state.error).toBe('Server unavailable');
    });

    it('clears error with empty string', () => {
      const pre = reducer(undefined, setMoneyMovementError('error'));
      const state = reducer(pre, setMoneyMovementError(''));
      expect(state.error).toBe('');
    });
  });

  describe('setMoneyMovementStartDate', () => {
    it('updates startDate', () => {
      const state = reducer(undefined, setMoneyMovementStartDate('2025-01-01'));
      expect(state.startDate).toBe('2025-01-01');
    });
  });

  describe('setMoneyMovementEndDate', () => {
    it('updates endDate', () => {
      const state = reducer(undefined, setMoneyMovementEndDate('2025-12-31'));
      expect(state.endDate).toBe('2025-12-31');
    });
  });
});

// ---------------------------------------------------------------------------
// Selector tests
// ---------------------------------------------------------------------------

describe('moneyMovement selectors', () => {
  it('selectMoneyMovementLoading returns loading', () => {
    const rootState = makeRootState({ loading: true });
    expect(selectMoneyMovementLoading(rootState)).toBe(true);
  });

  it('selectMoneyMovementError returns error', () => {
    const rootState = makeRootState({ error: 'timeout' });
    expect(selectMoneyMovementError(rootState)).toBe('timeout');
  });

  it('selectMoneyMovementLabels returns labels when data is set', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootState = makeRootState({ data: sampleMoneyMovementData as any });
    expect(selectMoneyMovementLabels(rootState)).toEqual(['Jan', 'Feb', 'Mar']);
  });

  it('selectMoneyMovementLabels returns undefined when data is null', () => {
    const rootState = makeRootState({ data: null });
    expect(selectMoneyMovementLabels(rootState)).toBeUndefined();
  });

  it('selectMoneyMovementDatasets returns datasets when data is set', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootState = makeRootState({ data: sampleMoneyMovementData as any });
    const datasets = selectMoneyMovementDatasets(rootState);
    expect(datasets).toHaveLength(1);
    expect(datasets![0].label).toBe('Income');
  });

  it('selectMoneyMovementDatasets returns undefined when data is null', () => {
    const rootState = makeRootState({ data: null });
    expect(selectMoneyMovementDatasets(rootState)).toBeUndefined();
  });

  it('selectMoneyMovementStartDate returns startDate', () => {
    const rootState = makeRootState({ startDate: '2025-01-01' });
    expect(selectMoneyMovementStartDate(rootState)).toBe('2025-01-01');
  });

  it('selectMoneyMovementEndDate returns endDate', () => {
    const rootState = makeRootState({ endDate: '2025-12-31' });
    expect(selectMoneyMovementEndDate(rootState)).toBe('2025-12-31');
  });
});
