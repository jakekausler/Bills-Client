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
    dispatch(setSelectedBillLoaded(false));
    const bill = await fetchBill(accountId, billId, isTransfer);
    dispatch(setSelectedBill(bill));
  };
};

export const loadAndDuplicateBill = (accountId: string, billId: string, isTransfer: boolean): AppThunk => {
  return async (dispatch) => {
    dispatch(setSelectedBillLoaded(false));
    const bill = await fetchBill(accountId, billId, isTransfer);
    bill.id = undefined;
    bill.name = `Copy of ${bill.name}`;
    dispatch(setSelectedBill(bill));
  };
};

export const saveActivity = (
  account: Account,
  activity: Activity,
  startDate: Date,
  endDate: Date,
  graphEndDate: Date,
  billId: string | null,
  interestId: string | null | undefined,
): AppThunk => {
  return async (dispatch) => {
    if (billId) {
      await fetchAddBillActivity(account.id, activity, billId);
    } else if (interestId) {
      await fetchAddInterestActivity(account.id, activity, interestId);
    } else if (activity.id) {
      if (activity.id === 'AUTO-PULL' || activity.id === 'RMD') {
        // Enter as a new activity
        activity.id = undefined;
        fetchAddActivity(account.id, activity);
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
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
  };
};

export const removeActivity = (
  account: Account,
  activityId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    await fetchRemoveActivity(account.id, activityId, isTransfer);
    dispatch(loadActivities(account, startDate, endDate));
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
  };
};

export const changeAccountForActivity = (
  account: Account,
  activityId: string,
  newAccountId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    await fetchChangeAccountForActivity(account.id, activityId, newAccountId, isTransfer);
    dispatch(loadActivities(account, startDate, endDate));
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
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
    dispatch(setSelectedBillLoaded(false));
    const billActivity = await fetchBillActivity(account.id, billId, isTransfer, startDate, endDate);
    dispatch(setSelectedActivity(billActivity));
    dispatch(setSelectedActivityBillId(billId));
  };
};

export const loadNames = (): AppThunk => {
  return async (dispatch) => {
    const names = await fetchNames();
    dispatch(updateNames(names));
  };
};

export const saveBill = (
  account: Account,
  bill: Bill,
  startDate: Date,
  endDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    if (bill.id) {
      await fetchSaveBill(account.id, bill);
    } else {
      await fetchAddBill(account.id, bill);
    }
    dispatch(loadActivities(account, startDate, endDate));
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
  };
};

export const removeBill = (
  account: Account,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    await fetchRemoveBill(account.id, billId, isTransfer);
    dispatch(loadActivities(account, startDate, endDate));
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
  };
};

export const changeAccountForBill = (
  account: Account,
  billId: string,
  newAccountId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    await fetchChangeAccountForBill(account.id, billId, newAccountId, isTransfer);
    dispatch(loadActivities(account, startDate, endDate));
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
  };
};

export const loadInterests = (accountId: string): AppThunk => {
  return async (dispatch) => {
    dispatch(setInterestsLoaded(false));
    const interests = await fetchInterests(accountId);
    dispatch(updateInterests(interests));
  };
};

export const saveInterests = (
  account: Account,
  interests: Interest[],
  startDate: Date,
  endDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    await fetchSaveInterests(account.id, interests);
    dispatch(loadActivities(account, startDate, endDate));
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
  };
};

export const loadInterestActivity = (
  accountId: string,
  interestId: string,
  startDate: Date,
  endDate: Date,
): AppThunk => {
  return async (dispatch) => {
    dispatch(setSelectedActivityLoaded(false));
    const interestActivity = await fetchInterestActivity(accountId, interestId, startDate, endDate);
    dispatch(setSelectedActivity(interestActivity));
    dispatch(setSelectedActivityInterestId(interestActivity.interest_id));
  };
};

export const skipBill = (
  account: Account,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
  graphEndDate: Date,
): AppThunk => {
  return async (dispatch) => {
    await fetchSkipBill(account.id, billId, isTransfer);
    dispatch(loadActivities(account, startDate, endDate));
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
  };
};

export const skipInterest = (account: Account, startDate: Date, endDate: Date, graphEndDate: Date): AppThunk => {
  return async (dispatch) => {
    await fetchSkipInterest(account.id);
    dispatch(loadActivities(account, startDate, endDate));
    dispatch(loadGraphData(account, graphEndDate));
    dispatch(loadNames());
    dispatch(loadCategories());
    dispatch(loadCalendar());
    dispatch(loadAccounts());
    dispatch(loadFlow());
  };
};
