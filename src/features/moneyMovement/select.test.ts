import { describe, it, expect } from 'vitest';
import {
  selectMoneyMovementLoading,
  selectMoneyMovementError,
  selectMoneyMovementLabels,
  selectMoneyMovementDatasets,
  selectMoneyMovementStartDate,
  selectMoneyMovementEndDate,
} from './select';

describe('moneyMovement selectors', () => {
  it('should select loading', () => {
    const state = { moneyMovement: { loading: true } } as any;
    expect(selectMoneyMovementLoading(state)).toBe(true);
  });

  it('should select error', () => {
    const state = { moneyMovement: { error: 'error' } } as any;
    expect(selectMoneyMovementError(state)).toBe('error');
  });

  it('should select labels', () => {
    const labels = ['Jan', 'Feb'];
    const state = { moneyMovement: { data: { labels } } } as any;
    expect(selectMoneyMovementLabels(state)).toEqual(labels);
  });

  it('should select datasets', () => {
    const datasets = [{ label: 'Test', data: [1, 2] }];
    const state = { moneyMovement: { data: { datasets } } } as any;
    expect(selectMoneyMovementDatasets(state)).toEqual(datasets);
  });

  it('should select startDate', () => {
    const state = { moneyMovement: { startDate: '2026-03-01' } } as any;
    expect(selectMoneyMovementStartDate(state)).toBe('2026-03-01');
  });

  it('should select endDate', () => {
    const state = { moneyMovement: { endDate: '2026-03-31' } } as any;
    expect(selectMoneyMovementEndDate(state)).toBe('2026-03-31');
  });
});
