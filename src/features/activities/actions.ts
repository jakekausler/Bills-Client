import { AppThunk } from '../../store';
import {
  setActivities,
  setActivitiesError,
  setActivitiesLoaded,
  setInterestsLoaded,
  setSelectedActivity,
  setSelectedActivityBillId,
  setSelectedActivityInterestId,
  setSelectedActivityLoaded,
  setSelectedBill,
  setSelectedBillLoaded,
  updateInterests,
  updateNames,
} from './slice';
import {
  fetchActivities,
  fetchAddActivity,
  fetchAddBill,
  fetchAddBillActivity,
  fetchAddInterestActivity,
  fetchBill,
  fetchBillActivity,
  fetchChangeAccountForActivity,
  fetchChangeAccountForBill,
  fetchInterestActivity,
  fetchInterests,
  fetchNames,
  fetchRemoveActivity,
  fetchRemoveBill,
  fetchSaveActivity,
  fetchSaveBill,
  fetchSaveInterests,
  fetchSkipBill,
  fetchSkipInterest,
  fetchSkipSpendingTracker,
} from './api';
import { Account, Activity, Bill, Interest } from '../../types/types';
import { loadGraphData } from '../graph/actions';
import { loadAccounts } from '../accounts/actions';
import { loadCategories } from '../categories/actions';
import { loadCalendar } from '../calendar/actions';
import { loadFlow } from '../flow/actions';

export const loadActivities =
  (account: Account, startDate: Date, endDate: Date): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setActivitiesLoaded(false));
      const activities = await fetchActivities(account, startDate, endDate);

      dispatch(setActivities(activities));
    } catch (error) {
      console.error('Failed to load activities', error);
      dispatch(setActivitiesError('Failed to load activities'));
    }
  };

export const loadAndSelectBill = (accountId: string, billId: string, isTransfer: boolean): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSelectedBillLoaded(false));
      const bill = await fetchBill(accountId, billId, isTransfer);
      dispatch(setSelectedBill(bill));
    } catch (error) {
      console.error('Failed to load and select bill:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to load and select bill'));
      throw error;
    }
  };
};

export const loadAndDuplicateBill = (accountId: string, billId: string, isTransfer: boolean): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSelectedBillLoaded(false));
      const bill = await fetchBill(accountId, billId, isTransfer);
      bill.id = undefined;
      bill.name = `Copy of ${bill.name}`;
      dispatch(setSelectedBill(bill));
    } catch (error) {
      console.error('Failed to load and duplicate bill:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to load and duplicate bill'));
      throw error;
    }
  };
};

export const saveActivity = (
  account: Account,
  activity: Activity,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
  billId: string | null,
  interestId: string | null | undefined,
): AppThunk => {
  return async (dispatch) => {
    try {
      if (billId) {
        await fetchAddBillActivity(account.id, activity, billId);
      } else if (interestId) {
        await fetchAddInterestActivity(account.id, activity, interestId);
      } else if (activity.id) {
        if (activity.id === 'AUTO-PULL' || activity.id === 'RMD' || activity.id === 'AUTO-PUSH') {
          // Enter as a new activity
          activity.id = undefined;
          await fetchAddActivity(account.id, activity);
        } else if (activity.id?.startsWith('SPENDING-TRACKER-')) {
          // Do nothing, we shouldn't be able to edit spending tracker
          return;
        } else if (activity.id === 'TAX') {
          // Do nothing, we shouldn't be able to edit tax
          return;
        } else if (activity.id === 'SOCIAL-SECURITY') {
          // Do nothing, we shouldn't be able to edit social security
          return;
        } else if (activity.id === 'PENSION') {
          // Do nothing, we shouldn't be able to edit pension
          return;
        } else {
          await fetchSaveActivity(account.id, activity);
        }
      } else {
        await fetchAddActivity(account.id, activity);
      }
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to save activity:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to save activity'));
      throw error;
    }
  };
};

export const removeActivity = (
  account: Account,
  activityId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchRemoveActivity(account.id, activityId, isTransfer);
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to remove activity:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to remove activity'));
      throw error;
    }
  };
};

export const changeAccountForActivity = (
  account: Account,
  activityId: string,
  newAccountId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchChangeAccountForActivity(account.id, activityId, newAccountId, isTransfer);
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to change account for activity:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to change account for activity'));
      throw error;
    }
  };
};

export const loadBillActivity = (
  account: Account,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSelectedBillLoaded(false));
      const billActivity = await fetchBillActivity(account.id, billId, isTransfer, startDate, endDate);
      dispatch(setSelectedActivity(billActivity));
      dispatch(setSelectedActivityBillId(billId));
    } catch (error) {
      console.error('Failed to load bill activity:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to load bill activity'));
      throw error;
    }
  };
};

export const loadNames = (): AppThunk => {
  return async (dispatch) => {
    try {
      const names = await fetchNames();
      dispatch(updateNames(names));
    } catch (error) {
      console.error('Failed to load names:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to load names'));
      throw error;
    }
  };
};

export const saveBill = (
  account: Account,
  bill: Bill,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      if (bill.id) {
        await fetchSaveBill(account.id, bill);
      } else {
        await fetchAddBill(account.id, bill);
      }
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to save bill:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to save bill'));
      throw error;
    }
  };
};

export const removeBill = (
  account: Account,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchRemoveBill(account.id, billId, isTransfer);
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to remove bill:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to remove bill'));
      throw error;
    }
  };
};

export const changeAccountForBill = (
  account: Account,
  billId: string,
  newAccountId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchChangeAccountForBill(account.id, billId, newAccountId, isTransfer);
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to change account for bill:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to change account for bill'));
      throw error;
    }
  };
};

export const loadInterests = (accountId: string): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setInterestsLoaded(false));
      const interests = await fetchInterests(accountId);
      dispatch(updateInterests(interests));
    } catch (error) {
      console.error('Failed to load interests:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to load interests'));
      throw error;
    }
  };
};

export const saveInterests = (
  account: Account,
  interests: Interest[],
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchSaveInterests(account.id, interests);
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('[saveInterests] Failed to save interests:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to save interests'));
      throw error;
    }
  };
};

export const loadInterestActivity = (
  accountId: string,
  interestId: string,
  startDate: Date,
  endDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSelectedActivityLoaded(false));
      const interestActivity = await fetchInterestActivity(accountId, interestId, startDate, endDate);
      dispatch(setSelectedActivity(interestActivity));
      dispatch(setSelectedActivityInterestId(interestActivity.interestId));
    } catch (error) {
      console.error('Failed to load interest activity:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to load interest activity'));
      throw error;
    }
  };
};

export const skipBill = (
  account: Account,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchSkipBill(account.id, billId, isTransfer);
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to skip bill:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to skip bill'));
      throw error;
    }
  };
};

export const skipInterest = (
  account: Account,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchSkipInterest(account.id);
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to skip interest:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to skip interest'));
      throw error;
    }
  };
};

export const skipSpendingTracker = (
  account: Account,
  categoryId: string,
  startDate: Date,
  endDate: Date,
  graphStartDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    try {
      await fetchSkipSpendingTracker(categoryId);
      dispatch(loadActivities(account, startDate, endDate));
      dispatch(loadGraphData(account, graphStartDate, graphEndDate));
      dispatch(loadNames());
      dispatch(loadCategories());
      dispatch(loadCalendar());
      dispatch(loadAccounts());
      dispatch(loadFlow());
    } catch (error) {
      console.error('Failed to skip spending tracker:', error);
      dispatch(setActivitiesError(error instanceof Error ? error.message : 'Failed to skip spending tracker'));
      throw error;
    }
  };
};
