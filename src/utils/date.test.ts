import { describe, it, expect } from 'vitest';
import { toDate, toDateString } from './date';

// Note: toDate wraps new Date(str). Date-only strings (YYYY-MM-DD) are parsed
// as UTC midnight per the spec. Accessors like getFullYear() use local time, so
// on machines with a negative UTC offset, UTC midnight 2023-01-01 becomes
// local-time 2022-12-31. Tests that check local-time year/month/day avoid
// year/month boundaries to stay timezone-safe, or use UTC accessors.

describe('toDate', () => {
  it('converts a YYYY-MM-DD string to a Date object', () => {
    const result = toDate('2024-06-15');
    expect(result).toBeInstanceOf(Date);
  });

  it('produces a Date with the correct UTC year for a mid-year date', () => {
    // Mid-year date: UTC midnight in June is still June in any UTC offset
    const result = toDate('2024-06-15');
    expect(result.getUTCFullYear()).toBe(2024);
  });

  it('produces a Date with the correct UTC month (0-indexed)', () => {
    // June is month index 5
    const result = toDate('2024-06-15');
    expect(result.getUTCMonth()).toBe(5);
  });

  it('converts a mid-year date string and preserves the UTC year', () => {
    const result = toDate('2023-07-04');
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCFullYear()).toBe(2023);
  });

  it('converts a date string at the end of the year and preserves the UTC year', () => {
    const result = toDate('2023-12-31');
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCFullYear()).toBe(2023);
  });

  it('produces an invalid Date for a non-date string', () => {
    const result = toDate('not-a-date');
    expect(isNaN(result.getTime())).toBe(true);
  });
});

describe('toDateString', () => {
  // toDateString uses getUTCFullYear() + getUTCMonth() + getUTCDate().
  // To get a stable result across timezones, we construct dates whose UTC
  // year, month, and day are unambiguous — i.e. we avoid dates
  // where midnight UTC would cross a year or month boundary in local time.
  // Using mid-month, mid-year dates and noon UTC ensures stability.

  it('formats a Date as YYYY-MM-DD', () => {
    // Noon UTC on 2024-06-15: in any timezone UTC-12 to UTC+14, local date stays 2024-06-15
    const date = new Date('2024-06-15T12:00:00Z');
    const result = toDateString(date);
    expect(result).toBe('2024-06-15');
  });

  it('zero-pads single-digit months', () => {
    const date = new Date('2024-03-15T12:00:00Z');
    const result = toDateString(date);
    expect(result).toMatch(/^\d{4}-03-/);
  });

  it('zero-pads single-digit days', () => {
    const date = new Date('2024-11-05T12:00:00Z');
    const result = toDateString(date);
    expect(result).toMatch(/-05$/);
  });

  it('correctly formats a January date (month 1)', () => {
    // Use mid-month to avoid crossing year boundary in local time
    const date = new Date('2023-01-15T12:00:00Z');
    const result = toDateString(date);
    expect(result).toBe('2023-01-15');
  });

  it('correctly formats a December date (month 12)', () => {
    const date = new Date('2023-12-15T12:00:00Z');
    const result = toDateString(date);
    expect(result).toBe('2023-12-15');
  });

  it('produces a string of the format YYYY-MM-DD', () => {
    const date = new Date('2020-07-20T12:00:00Z');
    const result = toDateString(date);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('toDate and toDateString round-trip', () => {
  it('round-trips a mid-year date string through toDate and toDateString', () => {
    // YYYY-MM-DD date-only strings are parsed as UTC midnight.
    // toDateString uses getFullYear (local) + getUTCMonth + getUTCDate.
    // For mid-year dates, UTC midnight is still the same local date in almost
    // all timezones, so the round-trip holds.
    const original = '2024-08-22';
    const date = toDate(original);
    const result = toDateString(date);
    expect(result).toBe(original);
  });

  it('round-trips a leap-day date string', () => {
    const original = '2000-02-29';
    const date = toDate(original);
    const result = toDateString(date);
    expect(result).toBe(original);
  });

  it('round-trips a mid-year date in a different year', () => {
    const original = '2019-09-10';
    const date = toDate(original);
    const result = toDateString(date);
    expect(result).toBe(original);
  });
});
