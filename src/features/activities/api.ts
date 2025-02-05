import { Account, Activity, Bill, Interest } from '../../types/types';
import { api } from '../../utils/api';

export const fetchActivities = async (account: Account, startDate: Date, endDate: Date) => {
  return await api.get(
    `/api/accounts/${account.id}/consolidated_activity?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
  );
};

export const fetchBill = async (accountId: string, billId: string, isTransfer: boolean) => {
  return await api.get(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}`);
};

export const fetchAddActivity = async (accountId: string, activity: Activity) => {
  return await api.put(`/api/accounts/${accountId}/activity`, activity);
};

export const fetchSaveActivity = async (accountId: string, activity: Activity) => {
  return await api.post(
    `/api/accounts/${accountId}/activity/${activity.id}?isTransfer=${activity.isTransfer}`,
    activity,
  );
};

export const fetchRemoveActivity = async (accountId: string, activityId: string, isTransfer: boolean) => {
  return await api.delete(`/api/accounts/${accountId}/activity/${activityId}?isTransfer=${isTransfer}`);
};

export const fetchChangeAccountForActivity = async (
  accountId: string,
  activityId: string,
  newAccountId: string,
  isTransfer: boolean,
) => {
  return await api.post(
    `/api/accounts/${accountId}/activity/${activityId}/change_account/${newAccountId}?isTransfer=${isTransfer}`,
  );
};

export const fetchBillActivity = async (
  accountId: string,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
) => {
  return await api.get(
    `/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}&asActivity=true&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
  );
};

export const fetchAddBillActivity = async (accountId: string, activity: Activity, billId: string) => {
  return await api.post(
    `/api/accounts/${accountId}/bills/${billId}?asActivity=true&isTransfer=${activity.isTransfer}`,
    activity,
  );
};

export const fetchAddBill = async (accountId: string, bill: Bill) => {
  return await api.put(`/api/accounts/${accountId}/bills?isTransfer=${bill.isTransfer}`, bill);
};

export const fetchRemoveBill = async (accountId: string, billId: string, isTransfer: boolean) => {
  return await api.delete(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}`);
};

export const fetchSaveBill = async (accountId: string, bill: Bill) => {
  return await api.post(`/api/accounts/${accountId}/bills/${bill.id}?isTransfer=${bill.isTransfer}`, bill);
};

export const fetchChangeAccountForBill = async (
  accountId: string,
  billId: string,
  newAccountId: string,
  isTransfer: boolean,
) => {
  return await api.post(
    `/api/accounts/${accountId}/bills/${billId}/change_account/${newAccountId}?isTransfer=${isTransfer}`,
  );
};

export const fetchInterests = async (accountId: string) => {
  return await api.get(`/api/accounts/${accountId}/interests`);
};

export const fetchSaveInterests = async (accountId: string, interests: Interest[]) => {
  return await api.post(`/api/accounts/${accountId}/interests`, interests);
};

export const fetchInterestActivity = async (accountId: string, interestId: string, startDate: Date, endDate: Date) => {
  return await api.get(
    `/api/accounts/${accountId}/interests/${interestId}?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&asActivity=true`,
  );
};

export const fetchAddInterestActivity = async (accountId: string, activity: Activity, interestId: string) => {
  return await api.post(`/api/accounts/${accountId}/interests/${interestId}?asActivity=true`, activity);
};

export const fetchNames = async () => {
  return await api.get('/api/names');
};

export const fetchSkipBill = async (accountId: string, billId: string, isTransfer: boolean) => {
  return await api.post(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}&skip=true`);
};

export const fetchSkipInterest = async (accountId: string) => {
  return await api.post(`/api/accounts/${accountId}/interests?skip=true`);
};
