import { describe, it, expect } from 'vitest';
import reducer, {
  setLoading,
  setError,
  setCategories,
  addCategory,
  updateCategoryInState,
  updateSelectedCategory,
  removeCategory,
  setSelectedCategoryId,
  clearError,
  setChartData,
  setChartLoading,
  setDateRangeMode,
  setCustomStartDate,
  setCustomEndDate,
  setSmartCount,
  setSmartInterval,
  setSmartEndCount,
  setSmartEndInterval,
} from './slice';
import {
  selectSpendingTrackerCategories,
  selectSpendingTrackerLoading,
  selectSpendingTrackerError,
  selectSpendingTrackerCategoryOptions,
  selectSelectedCategoryId,
  selectSelectedCategory,
  selectChartData,
  selectChartLoading,
  selectDateRangeMode,
  selectCustomStartDate,
  selectCustomEndDate,
  selectSmartCount,
  selectSmartInterval,
  selectSmartEndCount,
  selectSmartEndInterval,
} from './select';
import { SpendingTrackerCategory } from '../../types/types';
import { RootState } from '../../store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRootState(spendingTrackerOverrides: Partial<ReturnType<typeof reducer>> = {}): RootState {
  const base = reducer(undefined, { type: '@@init' });
  return {
    spendingTracker: { ...base, ...spendingTrackerOverrides },
  } as unknown as RootState;
}

function makeCategory(overrides: Partial<SpendingTrackerCategory> = {}): SpendingTrackerCategory {
  return {
    id: 'cat-1',
    name: 'Groceries',
    threshold: 500,
    thresholdIsVariable: false,
    thresholdVariable: null,
    interval: 'monthly',
    intervalStart: '2024-01-01',
    accountId: 'acct-1',
    carryOver: false,
    carryUnder: false,
    increaseBy: 0,
    increaseByIsVariable: false,
    increaseByVariable: null,
    increaseByDate: '2024-01-01',
    initializeDate: null,
    thresholdChanges: [],
    ...overrides,
  };
}

const sampleChartData = {
  labels: ['Week 1', 'Week 2'],
  datasets: [{ label: 'Groceries', data: [120, 200] }],
};

// ---------------------------------------------------------------------------
// Reducer tests
// ---------------------------------------------------------------------------

describe('spendingTrackerSlice reducer', () => {
  describe('initial state', () => {
    it('has empty categories array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.categories).toEqual([]);
    });

    it('has selectedCategoryId as null', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.selectedCategoryId).toBeNull();
    });

    it('has loading as false', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.loading).toBe(false);
    });

    it('has error as null', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.error).toBeNull();
    });

    it('has chartData as null', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.chartData).toBeNull();
    });

    it('has chartLoading as false', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.chartLoading).toBe(false);
    });

    it('has dateRangeMode as "smart"', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.dateRangeMode).toBe('smart');
    });

    it('has customStartDate as null', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.customStartDate).toBeNull();
    });

    it('has customEndDate as null', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.customEndDate).toBeNull();
    });

    it('has smartCount as 12', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.smartCount).toBe(12);
    });

    it('has smartInterval as "weeks"', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.smartInterval).toBe('weeks');
    });

    it('has smartEndCount as 4', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.smartEndCount).toBe(4);
    });

    it('has smartEndInterval as "weeks"', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.smartEndInterval).toBe('weeks');
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
    it('sets error and stops loading', () => {
      const pre = reducer(undefined, setLoading(true));
      const state = reducer(pre, setError('fetch failed'));
      expect(state.error).toBe('fetch failed');
      expect(state.loading).toBe(false);
    });

    it('clears error when given null', () => {
      const pre = reducer(undefined, setError('some error'));
      const state = reducer(pre, setError(null));
      expect(state.error).toBeNull();
    });
  });

  describe('setCategories', () => {
    it('sets categories array', () => {
      const cat = makeCategory();
      const state = reducer(undefined, setCategories([cat]));
      expect(state.categories).toEqual([cat]);
    });

    it('sets loading to false', () => {
      const pre = reducer(undefined, setLoading(true));
      const state = reducer(pre, setCategories([]));
      expect(state.loading).toBe(false);
    });

    it('clears error', () => {
      const pre = reducer(undefined, setError('old error'));
      const state = reducer(pre, setCategories([]));
      expect(state.error).toBeNull();
    });

    it('replaces existing categories', () => {
      const pre = reducer(undefined, setCategories([makeCategory({ id: 'cat-1', name: 'Old' })]));
      const state = reducer(pre, setCategories([makeCategory({ id: 'cat-2', name: 'New' })]));
      expect(state.categories).toHaveLength(1);
      expect(state.categories[0].name).toBe('New');
    });
  });

  describe('addCategory', () => {
    it('appends category to list', () => {
      const state = reducer(undefined, addCategory(makeCategory({ id: 'cat-1' })));
      expect(state.categories).toHaveLength(1);
    });

    it('does not remove existing categories', () => {
      const pre = reducer(undefined, setCategories([makeCategory({ id: 'cat-1' })]));
      const state = reducer(pre, addCategory(makeCategory({ id: 'cat-2', name: 'Dining' })));
      expect(state.categories).toHaveLength(2);
    });
  });

  describe('updateCategoryInState', () => {
    it('updates the matching category', () => {
      const pre = reducer(undefined, setCategories([makeCategory({ id: 'cat-1', name: 'Groceries' })]));
      const state = reducer(pre, updateCategoryInState(makeCategory({ id: 'cat-1', name: 'Food' })));
      expect(state.categories[0].name).toBe('Food');
    });

    it('does not affect other categories', () => {
      const pre = reducer(
        undefined,
        setCategories([
          makeCategory({ id: 'cat-1', name: 'Groceries' }),
          makeCategory({ id: 'cat-2', name: 'Dining' }),
        ]),
      );
      const state = reducer(pre, updateCategoryInState(makeCategory({ id: 'cat-1', name: 'Food' })));
      expect(state.categories[1].name).toBe('Dining');
    });

    it('does nothing when id does not exist', () => {
      const pre = reducer(undefined, setCategories([makeCategory({ id: 'cat-1' })]));
      const state = reducer(pre, updateCategoryInState(makeCategory({ id: 'nonexistent', name: 'Ghost' })));
      expect(state.categories).toHaveLength(1);
      expect(state.categories[0].id).toBe('cat-1');
    });
  });

  describe('updateSelectedCategory', () => {
    it('updates the selected category with partial data', () => {
      const pre = reducer(
        reducer(undefined, setCategories([makeCategory({ id: 'cat-1', name: 'Groceries', threshold: 500 })])),
        setSelectedCategoryId('cat-1'),
      );
      const state = reducer(pre, updateSelectedCategory({ threshold: 750 }));
      expect(state.categories[0].threshold).toBe(750);
    });

    it('preserves unchanged fields on selected category', () => {
      const pre = reducer(
        reducer(undefined, setCategories([makeCategory({ id: 'cat-1', name: 'Groceries', threshold: 500 })])),
        setSelectedCategoryId('cat-1'),
      );
      const state = reducer(pre, updateSelectedCategory({ threshold: 750 }));
      expect(state.categories[0].name).toBe('Groceries');
    });

    it('does nothing when no category is selected', () => {
      const pre = reducer(undefined, setCategories([makeCategory({ id: 'cat-1', name: 'Groceries' })]));
      // selectedCategoryId is null by default
      const state = reducer(pre, updateSelectedCategory({ name: 'Modified' }));
      expect(state.categories[0].name).toBe('Groceries');
    });

    it('does nothing when selectedCategoryId does not match any category', () => {
      const pre = reducer(
        reducer(undefined, setCategories([makeCategory({ id: 'cat-1' })])),
        setSelectedCategoryId('nonexistent'),
      );
      const state = reducer(pre, updateSelectedCategory({ name: 'Ghost' }));
      expect(state.categories[0].id).toBe('cat-1');
    });
  });

  describe('removeCategory', () => {
    it('removes the category with the given id', () => {
      const pre = reducer(undefined, setCategories([makeCategory({ id: 'cat-1' })]));
      const state = reducer(pre, removeCategory('cat-1'));
      expect(state.categories).toHaveLength(0);
    });

    it('clears selectedCategoryId when the selected category is removed', () => {
      const pre = reducer(
        reducer(undefined, setCategories([makeCategory({ id: 'cat-1' })])),
        setSelectedCategoryId('cat-1'),
      );
      const state = reducer(pre, removeCategory('cat-1'));
      expect(state.selectedCategoryId).toBeNull();
    });

    it('does not clear selectedCategoryId when a different category is removed', () => {
      const pre = reducer(
        reducer(
          undefined,
          setCategories([
            makeCategory({ id: 'cat-1' }),
            makeCategory({ id: 'cat-2' }),
          ]),
        ),
        setSelectedCategoryId('cat-1'),
      );
      const state = reducer(pre, removeCategory('cat-2'));
      expect(state.selectedCategoryId).toBe('cat-1');
    });

    it('does nothing when id does not exist', () => {
      const pre = reducer(undefined, setCategories([makeCategory({ id: 'cat-1' })]));
      const state = reducer(pre, removeCategory('nonexistent'));
      expect(state.categories).toHaveLength(1);
    });
  });

  describe('setSelectedCategoryId', () => {
    it('sets selectedCategoryId', () => {
      const state = reducer(undefined, setSelectedCategoryId('cat-1'));
      expect(state.selectedCategoryId).toBe('cat-1');
    });

    it('sets selectedCategoryId to null', () => {
      const pre = reducer(undefined, setSelectedCategoryId('cat-1'));
      const state = reducer(pre, setSelectedCategoryId(null));
      expect(state.selectedCategoryId).toBeNull();
    });
  });

  describe('clearError', () => {
    it('clears the error', () => {
      const pre = reducer(undefined, setError('oops'));
      const state = reducer(pre, clearError());
      expect(state.error).toBeNull();
    });
  });

  describe('setChartData', () => {
    it('sets chartData', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = reducer(undefined, setChartData(sampleChartData as any));
      expect(state.chartData).toEqual(sampleChartData);
    });

    it('sets chartData to null', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pre = reducer(undefined, setChartData(sampleChartData as any));
      const state = reducer(pre, setChartData(null));
      expect(state.chartData).toBeNull();
    });
  });

  describe('setChartLoading', () => {
    it('sets chartLoading to true', () => {
      const state = reducer(undefined, setChartLoading(true));
      expect(state.chartLoading).toBe(true);
    });

    it('sets chartLoading to false', () => {
      const pre = reducer(undefined, setChartLoading(true));
      const state = reducer(pre, setChartLoading(false));
      expect(state.chartLoading).toBe(false);
    });
  });

  describe('date range mode', () => {
    describe('setDateRangeMode', () => {
      it('sets dateRangeMode to "custom"', () => {
        const state = reducer(undefined, setDateRangeMode('custom'));
        expect(state.dateRangeMode).toBe('custom');
      });

      it('sets dateRangeMode to "smart"', () => {
        const pre = reducer(undefined, setDateRangeMode('custom'));
        const state = reducer(pre, setDateRangeMode('smart'));
        expect(state.dateRangeMode).toBe('smart');
      });
    });

    describe('setCustomStartDate', () => {
      it('sets customStartDate', () => {
        const state = reducer(undefined, setCustomStartDate('2025-01-01'));
        expect(state.customStartDate).toBe('2025-01-01');
      });

      it('sets customStartDate to null', () => {
        const pre = reducer(undefined, setCustomStartDate('2025-01-01'));
        const state = reducer(pre, setCustomStartDate(null));
        expect(state.customStartDate).toBeNull();
      });
    });

    describe('setCustomEndDate', () => {
      it('sets customEndDate', () => {
        const state = reducer(undefined, setCustomEndDate('2025-12-31'));
        expect(state.customEndDate).toBe('2025-12-31');
      });

      it('sets customEndDate to null', () => {
        const pre = reducer(undefined, setCustomEndDate('2025-12-31'));
        const state = reducer(pre, setCustomEndDate(null));
        expect(state.customEndDate).toBeNull();
      });
    });

    describe('setSmartCount', () => {
      it('sets smartCount', () => {
        const state = reducer(undefined, setSmartCount(24));
        expect(state.smartCount).toBe(24);
      });
    });

    describe('setSmartInterval', () => {
      it('sets smartInterval to "months"', () => {
        const state = reducer(undefined, setSmartInterval('months'));
        expect(state.smartInterval).toBe('months');
      });

      it('sets smartInterval to "years"', () => {
        const state = reducer(undefined, setSmartInterval('years'));
        expect(state.smartInterval).toBe('years');
      });

      it('sets smartInterval to "weeks"', () => {
        const pre = reducer(undefined, setSmartInterval('months'));
        const state = reducer(pre, setSmartInterval('weeks'));
        expect(state.smartInterval).toBe('weeks');
      });
    });

    describe('setSmartEndCount', () => {
      it('sets smartEndCount', () => {
        const state = reducer(undefined, setSmartEndCount(8));
        expect(state.smartEndCount).toBe(8);
      });
    });

    describe('setSmartEndInterval', () => {
      it('sets smartEndInterval to "months"', () => {
        const state = reducer(undefined, setSmartEndInterval('months'));
        expect(state.smartEndInterval).toBe('months');
      });

      it('sets smartEndInterval to "years"', () => {
        const state = reducer(undefined, setSmartEndInterval('years'));
        expect(state.smartEndInterval).toBe('years');
      });
    });
  });
});

// ---------------------------------------------------------------------------
// Selector tests
// ---------------------------------------------------------------------------

describe('spendingTracker selectors', () => {
  it('selectSpendingTrackerCategories returns categories', () => {
    const cat = makeCategory();
    const rootState = makeRootState({ categories: [cat] });
    expect(selectSpendingTrackerCategories(rootState)).toEqual([cat]);
  });

  it('selectSpendingTrackerLoading returns loading', () => {
    const rootState = makeRootState({ loading: true });
    expect(selectSpendingTrackerLoading(rootState)).toBe(true);
  });

  it('selectSpendingTrackerError returns error', () => {
    const rootState = makeRootState({ error: 'bad request' });
    expect(selectSpendingTrackerError(rootState)).toBe('bad request');
  });

  describe('selectSpendingTrackerCategoryOptions', () => {
    it('returns "None" option plus each category', () => {
      const cats = [
        makeCategory({ id: 'cat-1', name: 'Groceries' }),
        makeCategory({ id: 'cat-2', name: 'Dining' }),
      ];
      const rootState = makeRootState({ categories: cats });
      const options = selectSpendingTrackerCategoryOptions(rootState);
      expect(options[0]).toEqual({ value: '', label: 'None' });
      expect(options[1]).toEqual({ value: 'cat-1', label: 'Groceries' });
      expect(options[2]).toEqual({ value: 'cat-2', label: 'Dining' });
    });

    it('returns only "None" option when categories is empty', () => {
      const rootState = makeRootState({ categories: [] });
      const options = selectSpendingTrackerCategoryOptions(rootState);
      expect(options).toHaveLength(1);
      expect(options[0]).toEqual({ value: '', label: 'None' });
    });
  });

  it('selectSelectedCategoryId returns selectedCategoryId', () => {
    const rootState = makeRootState({ selectedCategoryId: 'cat-1' });
    expect(selectSelectedCategoryId(rootState)).toBe('cat-1');
  });

  describe('selectSelectedCategory', () => {
    it('returns the selected category object', () => {
      const cat = makeCategory({ id: 'cat-1', name: 'Groceries' });
      const rootState = makeRootState({ categories: [cat], selectedCategoryId: 'cat-1' });
      expect(selectSelectedCategory(rootState)).toEqual(cat);
    });

    it('returns null when selectedCategoryId is null', () => {
      const rootState = makeRootState({ categories: [makeCategory()], selectedCategoryId: null });
      expect(selectSelectedCategory(rootState)).toBeNull();
    });

    it('returns null when selectedCategoryId does not match any category', () => {
      const rootState = makeRootState({ categories: [makeCategory({ id: 'cat-1' })], selectedCategoryId: 'nonexistent' });
      expect(selectSelectedCategory(rootState)).toBeNull();
    });
  });

  it('selectChartData returns chartData', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootState = makeRootState({ chartData: sampleChartData as any });
    expect(selectChartData(rootState)).toEqual(sampleChartData);
  });

  it('selectChartLoading returns chartLoading', () => {
    const rootState = makeRootState({ chartLoading: true });
    expect(selectChartLoading(rootState)).toBe(true);
  });

  it('selectDateRangeMode returns dateRangeMode', () => {
    const rootState = makeRootState({ dateRangeMode: 'custom' });
    expect(selectDateRangeMode(rootState)).toBe('custom');
  });

  it('selectCustomStartDate returns customStartDate', () => {
    const rootState = makeRootState({ customStartDate: '2025-01-01' });
    expect(selectCustomStartDate(rootState)).toBe('2025-01-01');
  });

  it('selectCustomEndDate returns customEndDate', () => {
    const rootState = makeRootState({ customEndDate: '2025-12-31' });
    expect(selectCustomEndDate(rootState)).toBe('2025-12-31');
  });

  it('selectSmartCount returns smartCount', () => {
    const rootState = makeRootState({ smartCount: 24 });
    expect(selectSmartCount(rootState)).toBe(24);
  });

  it('selectSmartInterval returns smartInterval', () => {
    const rootState = makeRootState({ smartInterval: 'months' });
    expect(selectSmartInterval(rootState)).toBe('months');
  });

  it('selectSmartEndCount returns smartEndCount', () => {
    const rootState = makeRootState({ smartEndCount: 8 });
    expect(selectSmartEndCount(rootState)).toBe(8);
  });

  it('selectSmartEndInterval returns smartEndInterval', () => {
    const rootState = makeRootState({ smartEndInterval: 'years' });
    expect(selectSmartEndInterval(rootState)).toBe('years');
  });
});
