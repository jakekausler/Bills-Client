import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAccounts, fetchAddAccount, fetchEditAccounts } from './api';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

import { api } from '../../utils/api';

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

describe('accounts api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAccounts', () => {
    it('calls api.get with /api/accounts', async () => {
      const mockData = [{ id: 'acc-1', name: 'Checking', balance: 1000 }];
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchAccounts();

      expect(mockApi.get).toHaveBeenCalledWith('/api/accounts');
      expect(mockApi.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('propagates errors from api.get', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'));

      await expect(fetchAccounts()).rejects.toThrow('Network error');
    });
  });

  describe('fetchAddAccount', () => {
    it('calls api.post with /api/accounts and the account data', async () => {
      const account = {
        id: 'acc-1',
        name: 'Savings',
        balance: 5000,
        hidden: false,
        type: 'checking',
        pullPriority: 1,
        interestTaxRate: 0,
        withdrawalTaxRate: 0,
        earlyWithdrawalPenalty: 0,
        earlyWithdrawalDate: null,
        interestPayAccount: null,
        interestAppliesToPositiveBalance: true,
        usesRMD: false,
        accountOwnerDOB: null,
        rmdAccount: null,
        minimumBalance: null,
        minimumPullAmount: null,
        maximumBalance: null,
        performsPulls: false,
        performsPushes: false,
        pushStart: null,
        pushEnd: null,
        pushAccount: null,
      };
      const mockResponse = { success: true };
      mockApi.post.mockResolvedValue(mockResponse);

      const result = await fetchAddAccount(account);

      expect(mockApi.post).toHaveBeenCalledWith('/api/accounts', account);
      expect(mockApi.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('propagates errors from api.post', async () => {
      const account = {
        id: 'acc-1',
        name: 'Savings',
        balance: 5000,
        hidden: false,
        type: 'checking',
        pullPriority: 1,
        interestTaxRate: 0,
        withdrawalTaxRate: 0,
        earlyWithdrawalPenalty: 0,
        earlyWithdrawalDate: null,
        interestPayAccount: null,
        interestAppliesToPositiveBalance: true,
        usesRMD: false,
        accountOwnerDOB: null,
        rmdAccount: null,
        minimumBalance: null,
        minimumPullAmount: null,
        maximumBalance: null,
        performsPulls: false,
        performsPushes: false,
        pushStart: null,
        pushEnd: null,
        pushAccount: null,
      };
      mockApi.post.mockRejectedValue(new Error('HTTP error! status: 400'));

      await expect(fetchAddAccount(account)).rejects.toThrow('HTTP error! status: 400');
    });
  });

  describe('fetchEditAccounts', () => {
    it('calls api.put with /api/accounts and the accounts array', async () => {
      const accounts = [
        {
          id: 'acc-1',
          name: 'Checking',
          balance: 2000,
          hidden: false,
          type: 'checking',
          pullPriority: 1,
          interestTaxRate: 0,
          withdrawalTaxRate: 0,
          earlyWithdrawalPenalty: 0,
          earlyWithdrawalDate: null,
          interestPayAccount: null,
          interestAppliesToPositiveBalance: true,
          usesRMD: false,
          accountOwnerDOB: null,
          rmdAccount: null,
          minimumBalance: null,
          minimumPullAmount: null,
          maximumBalance: null,
          performsPulls: false,
          performsPushes: false,
          pushStart: null,
          pushEnd: null,
          pushAccount: null,
        },
      ];
      const mockResponse = { success: true };
      mockApi.put.mockResolvedValue(mockResponse);

      const result = await fetchEditAccounts(accounts);

      expect(mockApi.put).toHaveBeenCalledWith('/api/accounts', accounts);
      expect(mockApi.put).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('calls api.put with an empty array when no accounts provided', async () => {
      mockApi.put.mockResolvedValue([]);

      await fetchEditAccounts([]);

      expect(mockApi.put).toHaveBeenCalledWith('/api/accounts', []);
    });

    it('propagates errors from api.put', async () => {
      mockApi.put.mockRejectedValue(new Error('HTTP error! status: 500'));

      await expect(fetchEditAccounts([])).rejects.toThrow('HTTP error! status: 500');
    });
  });
});
