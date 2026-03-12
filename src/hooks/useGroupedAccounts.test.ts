import { describe, it, expect } from 'vitest';
import { useGroupedAccounts } from './useGroupedAccounts';
import { renderHook } from '@testing-library/react';

describe('useGroupedAccounts', () => {
  it('groups accounts by type', () => {
    const accounts = [
      { id: '1', name: 'Checking 1', type: 'Checking' },
      { id: '2', name: 'Savings 1', type: 'Savings' },
      { id: '3', name: 'Checking 2', type: 'Checking' },
    ];

    const { result } = renderHook(() => useGroupedAccounts(accounts));

    expect(result.current).toHaveLength(2);
    expect(result.current[0].group).toBe('Checking');
    expect(result.current[0].items).toHaveLength(2);
    expect(result.current[1].group).toBe('Savings');
    expect(result.current[1].items).toHaveLength(1);
  });

  it('uses account name as label for each item', () => {
    const accounts = [
      { id: '1', name: 'My Checking', type: 'Checking' },
      { id: '2', name: 'My Savings', type: 'Savings' },
    ];

    const { result } = renderHook(() => useGroupedAccounts(accounts));

    expect(result.current[0].items[0].label).toBe('My Checking');
    expect(result.current[1].items[0].label).toBe('My Savings');
  });

  it('uses account name as value by default', () => {
    const accounts = [
      { id: '1', name: 'Checking', type: 'Checking' },
    ];

    const { result } = renderHook(() => useGroupedAccounts(accounts));

    expect(result.current[0].items[0].value).toBe('Checking');
  });

  it('uses account id as value when valueField is "id"', () => {
    const accounts = [
      { id: 'acc-1', name: 'Checking', type: 'Checking' },
    ];

    const { result } = renderHook(() => useGroupedAccounts(accounts, 'id'));

    expect(result.current[0].items[0].value).toBe('acc-1');
  });

  it('returns empty array when given empty accounts', () => {
    const accounts: { id: string; name: string; type: string }[] = [];

    const { result } = renderHook(() => useGroupedAccounts(accounts));

    expect(result.current).toEqual([]);
  });

  it('handles multiple accounts of same type', () => {
    const accounts = [
      { id: '1', name: 'Account A', type: 'Savings' },
      { id: '2', name: 'Account B', type: 'Savings' },
      { id: '3', name: 'Account C', type: 'Savings' },
    ];

    const { result } = renderHook(() => useGroupedAccounts(accounts));

    expect(result.current[0].group).toBe('Savings');
    expect(result.current[0].items).toHaveLength(3);
  });
});
