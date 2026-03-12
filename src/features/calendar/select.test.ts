import { describe, it, expect } from 'vitest';
import {
  selectBills,
  selectBillsLoaded,
  selectBillsError,
  selectStartDate,
  selectEndDate,
  selectCalendarSelectedAccounts,
} from './select';

describe('calendar selectors', () => {
  it('should select bills', () => {
    const bills = [{ id: '1', name: 'Test' }];
    const state = { calendar: { bills } } as any;
    expect(selectBills(state)).toEqual(bills);
  });

  it('should select billsLoaded', () => {
    const state = { calendar: { billsLoaded: true } } as any;
    expect(selectBillsLoaded(state)).toBe(true);
  });

  it('should select billsError', () => {
    const state = { calendar: { billsError: 'error' } } as any;
    expect(selectBillsError(state)).toBe('error');
  });

  it('should select startDate', () => {
    const state = { calendar: { startDate: '2026-03-01' } } as any;
    expect(selectStartDate(state)).toBe('2026-03-01');
  });

  it('should select endDate', () => {
    const state = { calendar: { endDate: '2026-03-31' } } as any;
    expect(selectEndDate(state)).toBe('2026-03-31');
  });

  it('should select selectedAccounts', () => {
    const state = { calendar: { selectedAccounts: ['acc-1'] } } as any;
    expect(selectCalendarSelectedAccounts(state)).toEqual(['acc-1']);
  });
});
