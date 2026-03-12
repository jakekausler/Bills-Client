import { describe, it, expect, vi } from 'vitest';
import { fetchGraphData } from './api';
import * as apiUtils from '../../utils/api';
import { makeAccount } from '../../test/factories';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('graph api', () => {
  it('should construct URL correctly', async () => {
    const mockData = { datasets: [], labels: [], type: 'activity' as const };
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockData);

    const account = makeAccount({ id: 'test-account' });
    const startDate = new Date('2026-03-01');
    const endDate = new Date('2026-03-31');

    await fetchGraphData(account, startDate, endDate);

    expect(apiUtils.api.get).toHaveBeenCalledWith(
      '/api/accounts/test-account/graph?startDate=2026-03-01&endDate=2026-03-31'
    );
  });
});
