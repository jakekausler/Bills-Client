import { describe, it, expect, vi } from 'vitest';
import { fetchFlow } from './api';
import * as apiUtils from '../../utils/api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('flow api', () => {
  it('should construct URL correctly with selected accounts', async () => {
    const mockFlow = { nodes: [], links: [] };
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockFlow);

    await fetchFlow(['acc-1', 'acc-2'], '2026-03-01', '2026-03-31');

    expect(apiUtils.api.get).toHaveBeenCalledWith(
      '/api/flow?selectedAccounts=acc-1%2Cacc-2&startDate=2026-03-01&endDate=2026-03-31'
    );
  });

  it('should construct URL correctly without selected accounts', async () => {
    const mockFlow = { nodes: [], links: [] };
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockFlow);

    await fetchFlow([], '2026-03-01', '2026-03-31');

    expect(apiUtils.api.get).toHaveBeenCalledWith('/api/flow?startDate=2026-03-01&endDate=2026-03-31');
  });
});
