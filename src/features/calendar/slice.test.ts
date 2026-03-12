import { describe, it, expect } from 'vitest';
import calendarReducer, {
  setBills,
  setBillsError,
  updateStartDate,
  updateEndDate,
  updateSelectedAccounts,
  setBillsLoaded,
} from './slice';

describe('calendar slice', () => {
  it('should return initial state', () => {
    const state = calendarReducer(undefined, { type: 'unknown' });
    expect(state.bills).toEqual([]);
    expect(state.billsLoaded).toBe(false);
    expect(state.billsError).toBe('');
    expect(state.selectedAccounts).toEqual([]);
  });

  it('should handle setBills', () => {
    const bills = [{ id: '1', name: 'Test' }] as any;
    const state = calendarReducer(undefined, setBills(bills));
    expect(state.bills).toEqual(bills);
    expect(state.billsLoaded).toBe(true);
    expect(state.billsError).toBe('');
  });

  it('should handle setBillsError', () => {
    const state = calendarReducer(undefined, setBillsError('error'));
    expect(state.billsError).toBe('error');
  });

  it('should handle updateStartDate', () => {
    const state = calendarReducer(undefined, updateStartDate('2026-04-01'));
    expect(state.startDate).toBe('2026-04-01');
  });

  it('should handle updateEndDate', () => {
    const state = calendarReducer(undefined, updateEndDate('2026-04-30'));
    expect(state.endDate).toBe('2026-04-30');
  });

  it('should handle updateSelectedAccounts', () => {
    const state = calendarReducer(undefined, updateSelectedAccounts(['acc-1', 'acc-2']));
    expect(state.selectedAccounts).toEqual(['acc-1', 'acc-2']);
  });

  it('should handle setBillsLoaded', () => {
    const state = calendarReducer(undefined, setBillsLoaded(true));
    expect(state.billsLoaded).toBe(true);
  });
});
