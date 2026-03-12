import { describe, it, expect, vi } from 'vitest';
import {
  getHealthcareConfigs,
  postHealthcareConfig,
  putHealthcareConfig,
  deleteHealthcareConfigApi,
} from './api';
import * as apiUtils from '../../utils/api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  fetchWithAuth: vi.fn(),
}));

describe('healthcare api', () => {
  it('should fetch configs', async () => {
    const mockConfigs = [{ id: '1', name: 'Test' }];
    vi.mocked(apiUtils.api.get).mockResolvedValue(mockConfigs);

    await getHealthcareConfigs();

    expect(apiUtils.api.get).toHaveBeenCalledWith('/api/healthcare/configs');
  });

  it('should post config', async () => {
    const newConfig = { name: 'New Config' };
    const mockResponse = { id: '1', ...newConfig };
    vi.mocked(apiUtils.api.post).mockResolvedValue(mockResponse);

    await postHealthcareConfig(newConfig as any);

    expect(apiUtils.api.post).toHaveBeenCalledWith('/api/healthcare/configs', newConfig);
  });

  it('should put config', async () => {
    const config = { id: '1', name: 'Updated' };
    vi.mocked(apiUtils.api.put).mockResolvedValue(config);

    await putHealthcareConfig('1', config as any);

    expect(apiUtils.api.put).toHaveBeenCalledWith('/api/healthcare/configs/1', config);
  });

  it('should delete config', async () => {
    vi.mocked(apiUtils.api.delete).mockResolvedValue(undefined);

    await deleteHealthcareConfigApi('1');

    expect(apiUtils.api.delete).toHaveBeenCalledWith('/api/healthcare/configs/1');
  });
});
