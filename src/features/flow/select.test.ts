import { describe, it, expect } from 'vitest';
import {
  selectFlow,
  selectFlowLoaded,
  selectFlowError,
  selectFlowSelectedAccounts,
  selectFlowStartDate,
  selectFlowEndDate,
} from './select';

describe('flow selectors', () => {
  it('should select flow', () => {
    const flow = { nodes: [], links: [] };
    const state = { flow: { flow } } as any;
    expect(selectFlow(state)).toEqual(flow);
  });

  it('should select flowLoaded', () => {
    const state = { flow: { flowLoaded: true } } as any;
    expect(selectFlowLoaded(state)).toBe(true);
  });

  it('should select flowError', () => {
    const state = { flow: { flowError: 'error' } } as any;
    expect(selectFlowError(state)).toBe('error');
  });

  it('should select selectedAccounts', () => {
    const state = { flow: { selectedAccounts: ['acc-1'] } } as any;
    expect(selectFlowSelectedAccounts(state)).toEqual(['acc-1']);
  });

  it('should select startDate', () => {
    const state = { flow: { startDate: '2026-03-01' } } as any;
    expect(selectFlowStartDate(state)).toBe('2026-03-01');
  });

  it('should select endDate', () => {
    const state = { flow: { endDate: '2026-03-31' } } as any;
    expect(selectFlowEndDate(state)).toBe('2026-03-31');
  });
});
