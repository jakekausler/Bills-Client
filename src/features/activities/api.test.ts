import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchActivities,
  fetchBill,
  fetchAddActivity,
  fetchSaveActivity,
  fetchRemoveActivity,
  fetchChangeAccountForActivity,
  fetchBillActivity,
  fetchAddBillActivity,
  fetchAddBill,
  fetchRemoveBill,
  fetchSaveBill,
  fetchChangeAccountForBill,
  fetchInterests,
  fetchSaveInterests,
  fetchInterestActivity,
  fetchAddInterestActivity,
  fetchNames,
  fetchSkipBill,
  fetchSkipInterest,
  fetchSkipSpendingTracker,
} from './api';
import { makeAccount, makeActivity, makeBill, makeInterest } from '../../test/factories';

vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import { api } from '../../utils/api';

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('activities api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchActivities', () => {
    it('calls api.get with correct URL including date range', async () => {
      const account = makeAccount({ id: 'acc-1' });
      const startDate = new Date('2026-03-01');
      const endDate = new Date('2026-03-31');
      const mockData = [makeActivity({ id: 'act-1' })];
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchActivities(account, startDate, endDate);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/accounts/acc-1/consolidated_activity?startDate=2026-03-01&endDate=2026-03-31',
      );
      expect(result).toEqual(mockData);
    });

    it('properly encodes account ID with special characters', async () => {
      const account = makeAccount({ id: 'acc with spaces' });
      const startDate = new Date('2026-03-01');
      const endDate = new Date('2026-03-31');
      mockApi.get.mockResolvedValue([]);

      await fetchActivities(account, startDate, endDate);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/accounts/acc%20with%20spaces/consolidated_activity?startDate=2026-03-01&endDate=2026-03-31',
      );
    });
  });

  describe('fetchBill', () => {
    it('calls api.get with correct URL and isTransfer param', async () => {
      const accountId = 'acc-1';
      const billId = 'bill-1';
      const mockData = makeBill({ id: billId });
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchBill(accountId, billId, false);

      expect(mockApi.get).toHaveBeenCalledWith('/api/accounts/acc-1/bills/bill-1?isTransfer=false');
      expect(result).toEqual(mockData);
    });

    it('includes isTransfer=true in URL when transfer', async () => {
      const accountId = 'acc-1';
      const billId = 'bill-1';
      mockApi.get.mockResolvedValue(makeBill());

      await fetchBill(accountId, billId, true);

      expect(mockApi.get).toHaveBeenCalledWith('/api/accounts/acc-1/bills/bill-1?isTransfer=true');
    });
  });

  describe('fetchAddActivity', () => {
    it('calls api.post with correct URL and activity data', async () => {
      const accountId = 'acc-1';
      const activity = makeActivity({ id: undefined });
      mockApi.post.mockResolvedValue(undefined);

      await fetchAddActivity(accountId, activity);

      expect(mockApi.post).toHaveBeenCalledWith('/api/accounts/acc-1/activity', activity);
    });
  });

  describe('fetchSaveActivity', () => {
    it('calls api.put with correct URL including activity ID and isTransfer', async () => {
      const accountId = 'acc-1';
      const activity = makeActivity({ id: 'act-1', isTransfer: false });
      mockApi.put.mockResolvedValue(undefined);

      await fetchSaveActivity(accountId, activity);

      expect(mockApi.put).toHaveBeenCalledWith(
        '/api/accounts/acc-1/activity/act-1?isTransfer=false',
        activity,
      );
    });

    it('includes isTransfer=true in URL when activity is transfer', async () => {
      const accountId = 'acc-1';
      const activity = makeActivity({ id: 'act-1', isTransfer: true });
      mockApi.put.mockResolvedValue(undefined);

      await fetchSaveActivity(accountId, activity);

      expect(mockApi.put).toHaveBeenCalledWith(
        '/api/accounts/acc-1/activity/act-1?isTransfer=true',
        activity,
      );
    });
  });

  describe('fetchRemoveActivity', () => {
    it('calls api.delete with correct URL including isTransfer', async () => {
      const accountId = 'acc-1';
      const activityId = 'act-1';
      mockApi.delete.mockResolvedValue(undefined);

      await fetchRemoveActivity(accountId, activityId, false);

      expect(mockApi.delete).toHaveBeenCalledWith('/api/accounts/acc-1/activity/act-1?isTransfer=false');
    });
  });

  describe('fetchChangeAccountForActivity', () => {
    it('calls api.post with correct URL for changing account', async () => {
      const accountId = 'acc-1';
      const activityId = 'act-1';
      const newAccountId = 'acc-2';
      mockApi.post.mockResolvedValue(undefined);

      await fetchChangeAccountForActivity(accountId, activityId, newAccountId, false);

      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/accounts/acc-1/activity/act-1/change_account/acc-2?isTransfer=false',
      );
    });
  });

  describe('fetchBillActivity', () => {
    it('calls api.get with correct URL including asActivity=true', async () => {
      const accountId = 'acc-1';
      const billId = 'bill-1';
      const startDate = new Date('2026-03-01');
      const endDate = new Date('2026-03-31');
      const mockData = makeActivity({ id: 'act-1' });
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchBillActivity(accountId, billId, false, startDate, endDate);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/accounts/acc-1/bills/bill-1?isTransfer=false&asActivity=true&startDate=2026-03-01&endDate=2026-03-31',
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('fetchAddBillActivity', () => {
    it('calls api.put with correct URL including asActivity=true', async () => {
      const accountId = 'acc-1';
      const activity = makeActivity({ isTransfer: false });
      const billId = 'bill-1';
      mockApi.put.mockResolvedValue(undefined);

      await fetchAddBillActivity(accountId, activity, billId);

      expect(mockApi.put).toHaveBeenCalledWith(
        '/api/accounts/acc-1/bills/bill-1?asActivity=true&isTransfer=false',
        activity,
      );
    });
  });

  describe('fetchAddBill', () => {
    it('calls api.post with correct URL including isTransfer', async () => {
      const accountId = 'acc-1';
      const bill = makeBill({ isTransfer: false });
      mockApi.post.mockResolvedValue(undefined);

      await fetchAddBill(accountId, bill);

      expect(mockApi.post).toHaveBeenCalledWith('/api/accounts/acc-1/bills?isTransfer=false', bill);
    });
  });

  describe('fetchRemoveBill', () => {
    it('calls api.delete with correct URL including isTransfer', async () => {
      const accountId = 'acc-1';
      const billId = 'bill-1';
      mockApi.delete.mockResolvedValue(undefined);

      await fetchRemoveBill(accountId, billId, false);

      expect(mockApi.delete).toHaveBeenCalledWith('/api/accounts/acc-1/bills/bill-1?isTransfer=false');
    });
  });

  describe('fetchSaveBill', () => {
    it('calls api.put with correct URL including bill ID and isTransfer', async () => {
      const accountId = 'acc-1';
      const bill = makeBill({ id: 'bill-1', isTransfer: false });
      mockApi.put.mockResolvedValue(undefined);

      await fetchSaveBill(accountId, bill);

      expect(mockApi.put).toHaveBeenCalledWith('/api/accounts/acc-1/bills/bill-1?isTransfer=false', bill);
    });
  });

  describe('fetchChangeAccountForBill', () => {
    it('calls api.post with correct URL for changing account', async () => {
      const accountId = 'acc-1';
      const billId = 'bill-1';
      const newAccountId = 'acc-2';
      mockApi.post.mockResolvedValue(undefined);

      await fetchChangeAccountForBill(accountId, billId, newAccountId, false);

      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/accounts/acc-1/bills/bill-1/change_account/acc-2?isTransfer=false',
      );
    });
  });

  describe('fetchInterests', () => {
    it('calls api.get with correct URL', async () => {
      const accountId = 'acc-1';
      const mockData = [makeInterest({ id: 'int-1' })];
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchInterests(accountId);

      expect(mockApi.get).toHaveBeenCalledWith('/api/accounts/acc-1/interests');
      expect(result).toEqual(mockData);
    });
  });

  describe('fetchSaveInterests', () => {
    it('calls api.put with correct URL and interests array', async () => {
      const accountId = 'acc-1';
      const interests = [makeInterest({ id: 'int-1' }), makeInterest({ id: 'int-2' })];
      mockApi.put.mockResolvedValue(undefined);

      await fetchSaveInterests(accountId, interests);

      expect(mockApi.put).toHaveBeenCalledWith('/api/accounts/acc-1/interests', interests);
    });

    it('logs error and rethrows on failure', async () => {
      const accountId = 'acc-1';
      const interests = [makeInterest()];
      const error = new Error('Save failed');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockApi.put.mockRejectedValue(error);

      await expect(fetchSaveInterests(accountId, interests)).rejects.toThrow('Save failed');

      expect(consoleErrorSpy).toHaveBeenCalledWith('[fetchSaveInterests] Failed to save interests:', error);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('fetchInterestActivity', () => {
    it('calls api.get with correct URL including asActivity=true', async () => {
      const accountId = 'acc-1';
      const interestId = 'int-1';
      const startDate = new Date('2026-03-01');
      const endDate = new Date('2026-03-31');
      const mockData = makeActivity({ id: 'act-1' });
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchInterestActivity(accountId, interestId, startDate, endDate);

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/accounts/acc-1/interests/int-1?startDate=2026-03-01&endDate=2026-03-31&asActivity=true',
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('fetchAddInterestActivity', () => {
    it('calls api.put with correct URL including asActivity=true', async () => {
      const accountId = 'acc-1';
      const activity = makeActivity();
      const interestId = 'int-1';
      mockApi.put.mockResolvedValue(undefined);

      await fetchAddInterestActivity(accountId, activity, interestId);

      expect(mockApi.put).toHaveBeenCalledWith('/api/accounts/acc-1/interests/int-1?asActivity=true', activity);
    });
  });

  describe('fetchNames', () => {
    it('calls api.get with correct URL', async () => {
      const mockData = { 'Grocery Store': 'Groceries', 'Gas Station': 'Transportation' };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchNames();

      expect(mockApi.get).toHaveBeenCalledWith('/api/names');
      expect(result).toEqual(mockData);
    });
  });

  describe('fetchSkipBill', () => {
    it('calls api.put with correct URL including skip=true', async () => {
      const accountId = 'acc-1';
      const billId = 'bill-1';
      mockApi.put.mockResolvedValue(undefined);

      await fetchSkipBill(accountId, billId, false);

      expect(mockApi.put).toHaveBeenCalledWith('/api/accounts/acc-1/bills/bill-1?isTransfer=false&skip=true');
    });
  });

  describe('fetchSkipInterest', () => {
    it('calls api.put with correct URL including skip=true', async () => {
      const accountId = 'acc-1';
      mockApi.put.mockResolvedValue(undefined);

      await fetchSkipInterest(accountId);

      expect(mockApi.put).toHaveBeenCalledWith('/api/accounts/acc-1/interests?skip=true');
    });
  });

  describe('fetchSkipSpendingTracker', () => {
    it('calls api.put with correct URL including skip=true', async () => {
      const categoryId = 'cat-1';
      mockApi.put.mockResolvedValue(undefined);

      await fetchSkipSpendingTracker(categoryId);

      expect(mockApi.put).toHaveBeenCalledWith('/api/spending-tracker/cat-1?skip=true');
    });
  });
});
