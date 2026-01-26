import { setActivities, setActivitiesError, setActivitiesLoaded, setInterestsLoaded, setSelectedActivity, setSelectedActivityBillId, setSelectedActivityInterestId, setSelectedActivityLoaded, setSelectedBill, setSelectedBillLoaded, updateInterests, updateNames, } from './slice';
import { fetchActivities, fetchAddActivity, fetchAddBill, fetchAddBillActivity, fetchAddInterestActivity, fetchBill, fetchBillActivity, fetchChangeAccountForActivity, fetchChangeAccountForBill, fetchInterestActivity, fetchInterests, fetchNames, fetchRemoveActivity, fetchRemoveBill, fetchSaveActivity, fetchSaveBill, fetchSaveInterests, fetchSkipBill, fetchSkipInterest, } from './api';
import { loadGraphData } from '../graph/actions';
import { loadAccounts } from '../accounts/actions';
import { loadCategories } from '../categories/actions';
import { loadCalendar } from '../calendar/actions';
import { loadFlow } from '../flow/actions';
export const loadActivities = (account, startDate, endDate) => async (dispatch) => {
    try {
        dispatch(setActivitiesLoaded(false));
        const activities = await fetchActivities(account, startDate, endDate);
        dispatch(setActivities(activities));
    }
    catch (error) {
        console.error('Failed to load activities', error);
        dispatch(setActivitiesError('Failed to load activities'));
    }
};
export const loadAndSelectBill = (accountId, billId, isTransfer) => {
    return async (dispatch) => {
        dispatch(setSelectedBillLoaded(false));
        const bill = await fetchBill(accountId, billId, isTransfer);
        dispatch(setSelectedBill(bill));
    };
};
export const loadAndDuplicateBill = (accountId, billId, isTransfer) => {
    return async (dispatch) => {
        dispatch(setSelectedBillLoaded(false));
        const bill = await fetchBill(accountId, billId, isTransfer);
        bill.id = undefined;
        bill.name = `Copy of ${bill.name}`;
        dispatch(setSelectedBill(bill));
    };
};
export const saveActivity = (account, activity, startDate, endDate, graphStartDate, graphEndDate, billId, interestId) => {
    return async (dispatch) => {
        if (billId) {
            await fetchAddBillActivity(account.id, activity, billId);
        }
        else if (interestId) {
            await fetchAddInterestActivity(account.id, activity, interestId);
        }
        else if (activity.id) {
            if (activity.id === 'AUTO-PULL' || activity.id === 'RMD' || activity.id === 'AUTO-PUSH') {
                // Enter as a new activity
                activity.id = undefined;
                fetchAddActivity(account.id, activity);
            }
            else if (activity.id === 'TAX') {
                // Do nothing, we shouldn't be able to edit tax
                return;
            }
            else if (activity.id === 'SOCIAL-SECURITY') {
                // Do nothing, we shouldn't be able to edit social security
                return;
            }
            else if (activity.id === 'PENSION') {
                // Do nothing, we shouldn't be able to edit pension
                return;
            }
            else {
                await fetchSaveActivity(account.id, activity);
            }
        }
        else {
            await fetchAddActivity(account.id, activity);
        }
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
export const removeActivity = (account, activityId, isTransfer, startDate, endDate, graphStartDate, graphEndDate) => {
    return async (dispatch) => {
        await fetchRemoveActivity(account.id, activityId, isTransfer);
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
export const changeAccountForActivity = (account, activityId, newAccountId, isTransfer, startDate, endDate, graphStartDate, graphEndDate) => {
    return async (dispatch) => {
        await fetchChangeAccountForActivity(account.id, activityId, newAccountId, isTransfer);
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
export const loadBillActivity = (account, billId, isTransfer, startDate, endDate) => {
    return async (dispatch) => {
        dispatch(setSelectedBillLoaded(false));
        const billActivity = await fetchBillActivity(account.id, billId, isTransfer, startDate, endDate);
        dispatch(setSelectedActivity(billActivity));
        dispatch(setSelectedActivityBillId(billId));
    };
};
export const loadNames = () => {
    return async (dispatch) => {
        const names = await fetchNames();
        dispatch(updateNames(names));
    };
};
export const saveBill = (account, bill, startDate, endDate, graphStartDate, graphEndDate) => {
    return async (dispatch) => {
        if (bill.id) {
            await fetchSaveBill(account.id, bill);
        }
        else {
            await fetchAddBill(account.id, bill);
        }
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
export const removeBill = (account, billId, isTransfer, startDate, endDate, graphStartDate, graphEndDate) => {
    return async (dispatch) => {
        await fetchRemoveBill(account.id, billId, isTransfer);
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
export const changeAccountForBill = (account, billId, newAccountId, isTransfer, startDate, endDate, graphStartDate, graphEndDate) => {
    return async (dispatch) => {
        await fetchChangeAccountForBill(account.id, billId, newAccountId, isTransfer);
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
export const loadInterests = (accountId) => {
    return async (dispatch) => {
        dispatch(setInterestsLoaded(false));
        const interests = await fetchInterests(accountId);
        dispatch(updateInterests(interests));
    };
};
export const saveInterests = (account, interests, startDate, endDate, graphStartDate, graphEndDate) => {
    return async (dispatch) => {
        await fetchSaveInterests(account.id, interests);
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
export const loadInterestActivity = (accountId, interestId, startDate, endDate) => {
    return async (dispatch) => {
        dispatch(setSelectedActivityLoaded(false));
        const interestActivity = await fetchInterestActivity(accountId, interestId, startDate, endDate);
        dispatch(setSelectedActivity(interestActivity));
        dispatch(setSelectedActivityInterestId(interestActivity.interestId));
    };
};
export const skipBill = (account, billId, isTransfer, startDate, endDate, graphStartDate, graphEndDate) => {
    return async (dispatch) => {
        await fetchSkipBill(account.id, billId, isTransfer);
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
export const skipInterest = (account, startDate, endDate, graphStartDate, graphEndDate) => {
    return async (dispatch) => {
        await fetchSkipInterest(account.id);
        dispatch(loadActivities(account, startDate, endDate));
        dispatch(loadGraphData(account, graphStartDate, graphEndDate));
        dispatch(loadNames());
        dispatch(loadCategories());
        dispatch(loadCalendar());
        dispatch(loadAccounts());
        dispatch(loadFlow());
    };
};
