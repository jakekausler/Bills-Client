import { describe, it, expect, vi } from 'vitest';
import { fetchMoneyMovementChart } from './api';
import * as apiUtils from '../../utils/api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('moneyMovement api', () => {
  it('should construct URL correctly', async () => {
    const mockData = { labels: [], datasets: [] };
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockData);

    await fetchMoneyMovementChart('2026-03-01', '2026-03-31');

    expect(apiUtils.api.get).toHaveBeenCalledWith('/api/moneyMovement?startDate=2026-03-01&endDate=2026-03-31');
  });
});
