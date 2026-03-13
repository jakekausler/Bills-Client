import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveActivity, removeActivity, saveBill, removeBill, loadNames } from './actions';
import {
  setActivitiesError,
  setActivitiesLoaded,
  updateNames,
} from './slice';
import { makeAccount, makeActivity, makeBill } from '../../test/factories';

// Mock the API functions
vi.mock('./api', () => ({
  fetchActivities: vi.fn(),
  fetchAddActivity: vi.fn(),
  fetchSaveActivity: vi.fn(),
  fetchRemoveActivity: vi.fn(),
  fetchAddBillActivity: vi.fn(),
  fetchAddInterestActivity: vi.fn(),
  fetchAddBill: vi.fn(),
  fetchSaveBill: vi.fn(),
  fetchRemoveBill: vi.fn(),
  fetchNames: vi.fn(),
}));

// Mock other feature actions to avoid side effects
vi.mock('../graph/actions', () => ({
  loadGraphData: vi.fn(() => vi.fn()),
}));

vi.mock('../accounts/actions', () => ({
  loadAccounts: vi.fn(() => vi.fn()),
}));

vi.mock('../categories/actions', () => ({
  loadCategories: vi.fn(() => vi.fn()),
}));

vi.mock('../calendar/actions', () => ({
  loadCalendar: vi.fn(() => vi.fn()),
}));

vi.mock('../flow/actions', () => ({
  loadFlow: vi.fn(() => vi.fn()),
}));

import {
  fetchAddActivity,
  fetchSaveActivity,
  fetchRemoveActivity,
  fetchAddBillActivity,
  fetchAddInterestActivity,
  fetchAddBill,
  fetchSaveBill,
  fetchRemoveBill,
  fetchNames,
} from './api';

const mockFetchAddActivity = fetchAddActivity as ReturnType<typeof vi.fn>;
const mockFetchSaveActivity = fetchSaveActivity as ReturnType<typeof vi.fn>;
const mockFetchRemoveActivity = fetchRemoveActivity as ReturnType<typeof vi.fn>;
const mockFetchAddBillActivity = fetchAddBillActivity as ReturnType<typeof vi.fn>;
const mockFetchAddInterestActivity = fetchAddInterestActivity as ReturnType<typeof vi.fn>;
const mockFetchAddBill = fetchAddBill as ReturnType<typeof vi.fn>;
const mockFetchSaveBill = fetchSaveBill as ReturnType<typeof vi.fn>;
const mockFetchRemoveBill = fetchRemoveBill as ReturnType<typeof vi.fn>;
const mockFetchNames = fetchNames as ReturnType<typeof vi.fn>;

describe('activities actions', () => {
  const account = makeAccount({ id: 'acc-1' });
  const startDate = new Date('2026-03-01');
  const endDate = new Date('2026-03-31');
  const graphStartDate = new Date('2026-01-01');
  const graphEndDate = new Date('2026-12-31');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveActivity', () => {
    it('calls fetchAddBillActivity when billId is provided', async () => {
      const activity = makeActivity({ id: 'act-1' });
      const billId = 'bill-1';
      mockFetchAddBillActivity.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, billId, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddBillActivity).toHaveBeenCalledWith(account.id, activity, billId);
      expect(mockFetchAddActivity).not.toHaveBeenCalled();
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
    });

    it('calls fetchAddInterestActivity when interestId is provided', async () => {
      const activity = makeActivity({ id: 'act-1' });
      const interestId = 'int-1';
      mockFetchAddInterestActivity.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, interestId);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddInterestActivity).toHaveBeenCalledWith(account.id, activity, interestId);
      expect(mockFetchAddActivity).not.toHaveBeenCalled();
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
    });

    it('calls fetchAddActivity when activity has AUTO-PULL ID', async () => {
      const activity = makeActivity({ id: 'AUTO-PULL-123' });
      mockFetchAddActivity.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddActivity).toHaveBeenCalledWith(account.id, expect.objectContaining({
        ...activity,
        id: undefined,
      }));
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
    });

    it('calls fetchAddActivity when activity has RMD ID', async () => {
      const activity = makeActivity({ id: 'RMD-456' });
      mockFetchAddActivity.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddActivity).toHaveBeenCalledWith(account.id, expect.objectContaining({
        ...activity,
        id: undefined,
      }));
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
    });

    it('calls fetchAddActivity when activity has AUTO-PUSH ID', async () => {
      const activity = makeActivity({ id: 'AUTO-PUSH-789' });
      mockFetchAddActivity.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddActivity).toHaveBeenCalledWith(account.id, expect.objectContaining({
        ...activity,
        id: undefined,
      }));
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
    });

    it('returns early without saving when activity has SPENDING-TRACKER ID', async () => {
      const activity = makeActivity({ id: 'SPENDING-TRACKER-abc' });

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddActivity).not.toHaveBeenCalled();
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
      expect(mockFetchAddBillActivity).not.toHaveBeenCalled();
      // Function returns early, no dispatch calls should be made
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('returns early without saving when activity has TAX ID', async () => {
      const activity = makeActivity({ id: 'TAX-def' });

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddActivity).not.toHaveBeenCalled();
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
      expect(mockFetchAddBillActivity).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('returns early without saving when activity has SOCIAL-SECURITY ID', async () => {
      const activity = makeActivity({ id: 'SOCIAL-SECURITY-ghi' });

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddActivity).not.toHaveBeenCalled();
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
      expect(mockFetchAddBillActivity).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('returns early without saving when activity has PENSION ID', async () => {
      const activity = makeActivity({ id: 'PENSION-jkl' });

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddActivity).not.toHaveBeenCalled();
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
      expect(mockFetchAddBillActivity).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('calls fetchSaveActivity when activity has normal ID', async () => {
      const activity = makeActivity({ id: 'act-123' });
      mockFetchSaveActivity.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchSaveActivity).toHaveBeenCalledWith(account.id, activity);
      expect(mockFetchAddActivity).not.toHaveBeenCalled();
    });

    it('calls fetchAddActivity when activity has no ID', async () => {
      const activity = makeActivity({ id: undefined });
      mockFetchAddActivity.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddActivity).toHaveBeenCalledWith(account.id, activity);
      expect(mockFetchSaveActivity).not.toHaveBeenCalled();
    });

    it('dispatches error on failure', async () => {
      const activity = makeActivity({ id: 'act-1' });
      const error = new Error('Save failed');
      mockFetchSaveActivity.mockRejectedValue(error);

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toThrow('Save failed');

      expect(dispatch).toHaveBeenCalledWith(setActivitiesError('Save failed'));
    });

    it('handles non-Error objects in catch clause', async () => {
      const activity = makeActivity({ id: 'act-1' });
      mockFetchSaveActivity.mockRejectedValue('Unknown error');

      const dispatch = vi.fn();
      const thunk = saveActivity(account, activity, startDate, endDate, graphStartDate, graphEndDate, null, null);

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toBe('Unknown error');

      expect(dispatch).toHaveBeenCalledWith(setActivitiesError('Failed to save activity'));
    });
  });

  describe('removeActivity', () => {
    it('calls fetchRemoveActivity and reloads data', async () => {
      const activityId = 'act-1';
      const isTransfer = false;
      mockFetchRemoveActivity.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = removeActivity(account, activityId, isTransfer, startDate, endDate, graphStartDate, graphEndDate);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchRemoveActivity).toHaveBeenCalledWith(account.id, activityId, isTransfer);
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function)); // reloadAllData dispatches
    });

    it('dispatches error on failure', async () => {
      const activityId = 'act-1';
      const isTransfer = false;
      const error = new Error('Remove failed');
      mockFetchRemoveActivity.mockRejectedValue(error);

      const dispatch = vi.fn();
      const thunk = removeActivity(account, activityId, isTransfer, startDate, endDate, graphStartDate, graphEndDate);

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toThrow('Remove failed');

      expect(dispatch).toHaveBeenCalledWith(setActivitiesError('Remove failed'));
    });
  });

  describe('saveBill', () => {
    it('calls fetchSaveBill when bill has ID', async () => {
      const bill = makeBill({ id: 'bill-1' });
      mockFetchSaveBill.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveBill(account, bill, startDate, endDate, graphStartDate, graphEndDate);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchSaveBill).toHaveBeenCalledWith(account.id, bill);
      expect(mockFetchAddBill).not.toHaveBeenCalled();
    });

    it('calls fetchAddBill when bill has no ID', async () => {
      const bill = makeBill({ id: undefined });
      mockFetchAddBill.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = saveBill(account, bill, startDate, endDate, graphStartDate, graphEndDate);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchAddBill).toHaveBeenCalledWith(account.id, bill);
      expect(mockFetchSaveBill).not.toHaveBeenCalled();
    });

    it('dispatches error on failure', async () => {
      const bill = makeBill({ id: 'bill-1' });
      const error = new Error('Save bill failed');
      mockFetchSaveBill.mockRejectedValue(error);

      const dispatch = vi.fn();
      const thunk = saveBill(account, bill, startDate, endDate, graphStartDate, graphEndDate);

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toThrow('Save bill failed');

      expect(dispatch).toHaveBeenCalledWith(setActivitiesError('Save bill failed'));
    });
  });

  describe('removeBill', () => {
    it('calls fetchRemoveBill and reloads data', async () => {
      const billId = 'bill-1';
      const isTransfer = false;
      mockFetchRemoveBill.mockResolvedValue(undefined);

      const dispatch = vi.fn();
      const thunk = removeBill(account, billId, isTransfer, startDate, endDate, graphStartDate, graphEndDate);

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchRemoveBill).toHaveBeenCalledWith(account.id, billId, isTransfer);
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function)); // reloadAllData dispatches
    });

    it('dispatches error on failure', async () => {
      const billId = 'bill-1';
      const isTransfer = false;
      const error = new Error('Remove bill failed');
      mockFetchRemoveBill.mockRejectedValue(error);

      const dispatch = vi.fn();
      const thunk = removeBill(account, billId, isTransfer, startDate, endDate, graphStartDate, graphEndDate);

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toThrow('Remove bill failed');

      expect(dispatch).toHaveBeenCalledWith(setActivitiesError('Remove bill failed'));
    });
  });

  describe('loadNames', () => {
    it('fetches names and dispatches updateNames', async () => {
      const names = {
        'Grocery Store': {
          category: 'Groceries',
          isHealthcare: false,
          healthcarePerson: null,
          coinsurancePercent: null,
          isTransfer: false,
          from: null,
          to: null,
          spendingCategory: null,
        },
        'Gas Station': {
          category: 'Transportation',
          isHealthcare: false,
          healthcarePerson: null,
          coinsurancePercent: null,
          isTransfer: false,
          from: null,
          to: null,
          spendingCategory: null,
        },
      };
      mockFetchNames.mockResolvedValue(names);

      const dispatch = vi.fn();
      const thunk = loadNames();

      await thunk(dispatch, () => ({}), undefined);

      expect(mockFetchNames).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(updateNames(names));
    });

    it('dispatches error on failure', async () => {
      const error = new Error('Failed to fetch names');
      mockFetchNames.mockRejectedValue(error);

      const dispatch = vi.fn();
      const thunk = loadNames();

      await expect(thunk(dispatch, () => ({}), undefined)).rejects.toThrow('Failed to fetch names');

      expect(dispatch).toHaveBeenCalledWith(setActivitiesError('Failed to fetch names'));
    });
  });
});
