import { describe, it, expect } from 'vitest';
import reducer, {
  setBills,
  setBillsError,
  updateStartDate,
  updateEndDate,
  updateSelectedAccounts,
  setBillsLoaded,
} from './slice';
import {
  selectBills,
  selectBillsLoaded,
  selectBillsError,
  selectStartDate,
  selectEndDate,
  selectSelectedAccounts,
} from './select';
import { CalendarBill } from '../../types/types';
import { RootState } from '../../store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRootState(calendarOverrides: Partial<ReturnType<typeof reducer>> = {}): RootState {
  const base = reducer(undefined, { type: '@@init' });
  return {
    calendar: { ...base, ...calendarOverrides },
  } as unknown as RootState;
}

const sampleBill: CalendarBill = {
  id: 'bill-1',
  name: 'Electric Bill',
  category: 'utilities',
  amount: 120,
  flag: false,
  flagColor: null,
  amountIsVariable: false,
  amountVariable: null,
  isTransfer: false,
  from: null,
  to: null,
  startDate: '2024-01-01',
  startDateIsVariable: false,
  startDateVariable: null,
  endDate: null,
  endDateIsVariable: false,
  endDateVariable: null,
  everyN: 1,
  periods: 'months',
  isAutomatic: false,
  annualStartDate: null,
  annualEndDate: null,
  annualStartDateIsVariable: false,
  annualEndDateIsVariable: false,
  annualStartDateVariable: null,
  annualEndDateVariable: null,
  increaseBy: 0,
  increaseByIsVariable: false,
  increaseByVariable: null,
  increaseByDate: '2024-01-01',
  date: '2024-03-01',
  account: 'checking',
};

// ---------------------------------------------------------------------------
// Reducer tests
// ---------------------------------------------------------------------------

describe('calendarSlice reducer', () => {
  describe('initial state', () => {
    it('has empty bills array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.bills).toEqual([]);
    });

    it('has billsLoaded as false', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.billsLoaded).toBe(false);
    });

    it('has empty billsError string', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.billsError).toBe('');
    });

    it('has empty selectedAccounts array', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.selectedAccounts).toEqual([]);
    });

    it('startDate is a valid YYYY-MM-DD string', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('endDate is a valid YYYY-MM-DD string', () => {
      const state = reducer(undefined, { type: '@@init' });
      expect(state.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('setBills', () => {
    it('sets the bills array', () => {
      const state = reducer(undefined, setBills([sampleBill]));
      expect(state.bills).toEqual([sampleBill]);
    });

    it('marks billsLoaded as true', () => {
      const state = reducer(undefined, setBills([sampleBill]));
      expect(state.billsLoaded).toBe(true);
    });

    it('replaces existing bills with new payload', () => {
      const firstState = reducer(undefined, setBills([sampleBill]));
      const secondBill = { ...sampleBill, id: 'bill-2', name: 'Water Bill' };
      const finalState = reducer(firstState, setBills([secondBill]));
      expect(finalState.bills).toHaveLength(1);
      expect(finalState.bills[0].name).toBe('Water Bill');
    });

    it('sets empty array when payload is empty', () => {
      const preState = reducer(undefined, setBills([sampleBill]));
      const state = reducer(preState, setBills([]));
      expect(state.bills).toEqual([]);
      expect(state.billsLoaded).toBe(true);
    });
  });

  describe('setBillsError', () => {
    it('sets the error message', () => {
      const state = reducer(undefined, setBillsError('Network error'));
      expect(state.billsError).toBe('Network error');
    });

    it('clears the error message when given empty string', () => {
      const preState = reducer(undefined, setBillsError('Some error'));
      const state = reducer(preState, setBillsError(''));
      expect(state.billsError).toBe('');
    });
  });

  describe('updateStartDate', () => {
    it('updates the startDate', () => {
      const state = reducer(undefined, updateStartDate('2025-06-01'));
      expect(state.startDate).toBe('2025-06-01');
    });
  });

  describe('updateEndDate', () => {
    it('updates the endDate', () => {
      const state = reducer(undefined, updateEndDate('2025-06-30'));
      expect(state.endDate).toBe('2025-06-30');
    });
  });

  describe('updateSelectedAccounts', () => {
    it('sets selected accounts', () => {
      const state = reducer(undefined, updateSelectedAccounts(['acct-1', 'acct-2']));
      expect(state.selectedAccounts).toEqual(['acct-1', 'acct-2']);
    });

    it('replaces existing selected accounts', () => {
      const pre = reducer(undefined, updateSelectedAccounts(['acct-1']));
      const state = reducer(pre, updateSelectedAccounts(['acct-2', 'acct-3']));
      expect(state.selectedAccounts).toEqual(['acct-2', 'acct-3']);
    });

    it('clears selected accounts with empty array', () => {
      const pre = reducer(undefined, updateSelectedAccounts(['acct-1']));
      const state = reducer(pre, updateSelectedAccounts([]));
      expect(state.selectedAccounts).toEqual([]);
    });
  });

  describe('setBillsLoaded', () => {
    it('sets billsLoaded to true', () => {
      const state = reducer(undefined, setBillsLoaded(true));
      expect(state.billsLoaded).toBe(true);
    });

    it('sets billsLoaded to false', () => {
      const pre = reducer(undefined, setBills([sampleBill]));
      const state = reducer(pre, setBillsLoaded(false));
      expect(state.billsLoaded).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// Selector tests
// ---------------------------------------------------------------------------

describe('calendar selectors', () => {
  it('selectBills returns the bills array', () => {
    const rootState = makeRootState({ bills: [sampleBill] });
    expect(selectBills(rootState)).toEqual([sampleBill]);
  });

  it('selectBillsLoaded returns billsLoaded', () => {
    const rootState = makeRootState({ billsLoaded: true });
    expect(selectBillsLoaded(rootState)).toBe(true);
  });

  it('selectBillsError returns billsError', () => {
    const rootState = makeRootState({ billsError: 'fail' });
    expect(selectBillsError(rootState)).toBe('fail');
  });

  it('selectStartDate returns startDate', () => {
    const rootState = makeRootState({ startDate: '2025-01-01' });
    expect(selectStartDate(rootState)).toBe('2025-01-01');
  });

  it('selectEndDate returns endDate', () => {
    const rootState = makeRootState({ endDate: '2025-12-31' });
    expect(selectEndDate(rootState)).toBe('2025-12-31');
  });

  it('selectSelectedAccounts returns selectedAccounts', () => {
    const rootState = makeRootState({ selectedAccounts: ['checking', 'savings'] });
    expect(selectSelectedAccounts(rootState)).toEqual(['checking', 'savings']);
  });
});
