import { describe, it, expect } from 'vitest';
import flowReducer, {
  updateSelectedAccounts,
  setFlow,
  setFlowError,
  setFlowLoaded,
  updateStartDate,
  updateEndDate,
} from './slice';

describe('flow slice', () => {
  it('should return initial state', () => {
    const state = flowReducer(undefined, { type: 'unknown' });
    expect(state.flow).toEqual({ nodes: [], links: [] });
    expect(state.flowLoaded).toBe(false);
    expect(state.flowError).toBe('');
    expect(state.selectedAccounts).toEqual([]);
  });

  it('should handle updateSelectedAccounts', () => {
    const state = flowReducer(undefined, updateSelectedAccounts(['acc-1']));
    expect(state.selectedAccounts).toEqual(['acc-1']);
  });

  it('should handle setFlow', () => {
    const flow = { nodes: [{ id: '1', name: 'Test' }], links: [] } as any;
    const state = flowReducer(undefined, setFlow(flow));
    expect(state.flow).toEqual(flow);
    expect(state.flowLoaded).toBe(true);
    expect(state.flowError).toBe('');
  });

  it('should handle setFlowError', () => {
    const state = flowReducer(undefined, setFlowError('error'));
    expect(state.flowError).toBe('error');
  });

  it('should handle setFlowLoaded', () => {
    const state = flowReducer(undefined, setFlowLoaded(true));
    expect(state.flowLoaded).toBe(true);
  });

  it('should handle updateStartDate', () => {
    const state = flowReducer(undefined, updateStartDate('2026-04-01'));
    expect(state.startDate).toBe('2026-04-01');
  });

  it('should handle updateEndDate', () => {
    const state = flowReducer(undefined, updateEndDate('2026-04-30'));
    expect(state.endDate).toBe('2026-04-30');
  });
});
