import { describe, it, expect, vi } from 'vitest';
import { fetchGraphViewData } from './api';
import * as apiUtils from '../../utils/api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('graphView api', () => {
  it('should construct URL with all parameters', async () => {
    const mockData = {};
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockData);

    await fetchGraphViewData(['acc-1', 'acc-2'], ['sim-1'], '2026-03-01', '2026-12-31', true);

    expect(apiUtils.api.get).toHaveBeenCalledWith(
      '/api/accounts/graph?startDate=2026-03-01&endDate=2026-12-31&selectedAccounts=acc-1%2Cacc-2&selectedSimulations=sim-1&combineGraphAccounts=true'
    );
  });

  it('should construct URL without accounts or simulations', async () => {
    const mockData = {};
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockData);

    await fetchGraphViewData([], [], '2026-03-01', '2026-12-31', false);

    expect(apiUtils.api.get).toHaveBeenCalledWith(
      '/api/accounts/graph?startDate=2026-03-01&endDate=2026-12-31&combineGraphAccounts=false'
    );
  });
});
