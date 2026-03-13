import { Account, Activity, Bill, Interest, NameEntry } from '../../types/types';
import { api } from '../../utils/api';
import { toDateString } from '../../utils/date';

export const fetchActivities = async (account: Account, startDate: Date, endDate: Date): Promise<Activity[]> => {
  return await api.get<Activity[]>(
    `/api/accounts/${encodeURIComponent(account.id)}/consolidated_activity?startDate=${toDateString(startDate)}&endDate=${toDateString(endDate)}`,
  );
};

export const fetchBill = async (accountId: string, billId: string, isTransfer: boolean): Promise<Bill> => {
  return await api.get<Bill>(`/api/accounts/${encodeURIComponent(accountId)}/bills/${encodeURIComponent(billId)}?isTransfer=${isTransfer}`);
};

export const fetchAddActivity = async (accountId: string, activity: Activity): Promise<void> => {
  return await api.post<void>(`/api/accounts/${encodeURIComponent(accountId)}/activity`, activity);
};

export const fetchSaveActivity = async (accountId: string, activity: Activity): Promise<void> => {
  return await api.put<void>(
    `/api/accounts/${encodeURIComponent(accountId)}/activity/${encodeURIComponent(activity.id || '')}?isTransfer=${activity.isTransfer}`,
    activity,
  );
};

export const fetchRemoveActivity = async (accountId: string, activityId: string, isTransfer: boolean): Promise<void> => {
  return await api.delete<void>(`/api/accounts/${encodeURIComponent(accountId)}/activity/${encodeURIComponent(activityId)}?isTransfer=${isTransfer}`);
};

export const fetchChangeAccountForActivity = async (
  accountId: string,
  activityId: string,
  newAccountId: string,
  isTransfer: boolean,
): Promise<void> => {
  return await api.post<void>(
    `/api/accounts/${encodeURIComponent(accountId)}/activity/${encodeURIComponent(activityId)}/change_account/${encodeURIComponent(newAccountId)}?isTransfer=${isTransfer}`,
  );
};

export const fetchBillActivity = async (
  accountId: string,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
): Promise<Activity> => {
  return await api.get<Activity>(
    `/api/accounts/${encodeURIComponent(accountId)}/bills/${encodeURIComponent(billId)}?isTransfer=${isTransfer}&asActivity=true&startDate=${toDateString(startDate)}&endDate=${toDateString(endDate)}`,
  );
};

export const fetchAddBillActivity = async (accountId: string, activity: Activity, billId: string): Promise<void> => {
  return await api.put<void>(
    `/api/accounts/${encodeURIComponent(accountId)}/bills/${encodeURIComponent(billId)}?asActivity=true&isTransfer=${activity.isTransfer}`,
    activity,
  );
};

export const fetchAddBill = async (accountId: string, bill: Bill): Promise<void> => {
  return await api.post<void>(`/api/accounts/${encodeURIComponent(accountId)}/bills?isTransfer=${bill.isTransfer}`, bill);
};

export const fetchRemoveBill = async (accountId: string, billId: string, isTransfer: boolean): Promise<void> => {
  return await api.delete<void>(`/api/accounts/${encodeURIComponent(accountId)}/bills/${encodeURIComponent(billId)}?isTransfer=${isTransfer}`);
};

export const fetchSaveBill = async (accountId: string, bill: Bill): Promise<void> => {
  return await api.put<void>(`/api/accounts/${encodeURIComponent(accountId)}/bills/${encodeURIComponent(bill.id || '')}?isTransfer=${bill.isTransfer}`, bill);
};

export const fetchChangeAccountForBill = async (
  accountId: string,
  billId: string,
  newAccountId: string,
  isTransfer: boolean,
): Promise<void> => {
  return await api.post<void>(
    `/api/accounts/${encodeURIComponent(accountId)}/bills/${encodeURIComponent(billId)}/change_account/${encodeURIComponent(newAccountId)}?isTransfer=${isTransfer}`,
  );
};

export const fetchInterests = async (accountId: string): Promise<Interest[]> => {
  return await api.get<Interest[]>(`/api/accounts/${encodeURIComponent(accountId)}/interests`);
};

export const fetchSaveInterests = async (accountId: string, interests: Interest[]): Promise<void> => {
  try {
    return await api.put<void>(`/api/accounts/${encodeURIComponent(accountId)}/interests`, interests);
  } catch (error) {
    console.error('[fetchSaveInterests] Failed to save interests:', error);
    throw error;
  }
};

export const fetchInterestActivity = async (accountId: string, interestId: string, startDate: Date, endDate: Date): Promise<Activity> => {
  return await api.get<Activity>(
    `/api/accounts/${encodeURIComponent(accountId)}/interests/${encodeURIComponent(interestId)}?startDate=${toDateString(startDate)}&endDate=${toDateString(endDate)}&asActivity=true`,
  );
};

export const fetchAddInterestActivity = async (accountId: string, activity: Activity, interestId: string): Promise<void> => {
  return await api.put<void>(`/api/accounts/${encodeURIComponent(accountId)}/interests/${encodeURIComponent(interestId)}?asActivity=true`, activity);
};

export const fetchNames = async (): Promise<NameEntry[]> => {
  return await api.get<NameEntry[]>('/api/names');
};

export const fetchSkipBill = async (accountId: string, billId: string, isTransfer: boolean): Promise<void> => {
  return await api.put<void>(`/api/accounts/${encodeURIComponent(accountId)}/bills/${encodeURIComponent(billId)}?isTransfer=${isTransfer}&skip=true`);
};

export const fetchSkipInterest = async (accountId: string): Promise<void> => {
  return await api.put<void>(`/api/accounts/${encodeURIComponent(accountId)}/interests?skip=true`);
};

export const fetchSkipSpendingTracker = async (categoryId: string): Promise<void> => {
  return await api.put<void>(`/api/spending-tracker/${encodeURIComponent(categoryId)}?skip=true`);
};
