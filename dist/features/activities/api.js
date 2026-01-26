import { api } from '../../utils/api';
export const fetchActivities = async (account, startDate, endDate) => {
    return await api.get(`/api/accounts/${account.id}/consolidated_activity?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
};
export const fetchBill = async (accountId, billId, isTransfer) => {
    return await api.get(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}`);
};
export const fetchAddActivity = async (accountId, activity) => {
    return await api.put(`/api/accounts/${accountId}/activity`, activity);
};
export const fetchSaveActivity = async (accountId, activity) => {
    return await api.post(`/api/accounts/${accountId}/activity/${activity.id}?isTransfer=${activity.isTransfer}`, activity);
};
export const fetchRemoveActivity = async (accountId, activityId, isTransfer) => {
    return await api.delete(`/api/accounts/${accountId}/activity/${activityId}?isTransfer=${isTransfer}`);
};
export const fetchChangeAccountForActivity = async (accountId, activityId, newAccountId, isTransfer) => {
    return await api.post(`/api/accounts/${accountId}/activity/${activityId}/change_account/${newAccountId}?isTransfer=${isTransfer}`);
};
export const fetchBillActivity = async (accountId, billId, isTransfer, startDate, endDate) => {
    return await api.get(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}&asActivity=true&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
};
export const fetchAddBillActivity = async (accountId, activity, billId) => {
    return await api.post(`/api/accounts/${accountId}/bills/${billId}?asActivity=true&isTransfer=${activity.isTransfer}`, activity);
};
export const fetchAddBill = async (accountId, bill) => {
    return await api.put(`/api/accounts/${accountId}/bills?isTransfer=${bill.isTransfer}`, bill);
};
export const fetchRemoveBill = async (accountId, billId, isTransfer) => {
    return await api.delete(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}`);
};
export const fetchSaveBill = async (accountId, bill) => {
    return await api.post(`/api/accounts/${accountId}/bills/${bill.id}?isTransfer=${bill.isTransfer}`, bill);
};
export const fetchChangeAccountForBill = async (accountId, billId, newAccountId, isTransfer) => {
    return await api.post(`/api/accounts/${accountId}/bills/${billId}/change_account/${newAccountId}?isTransfer=${isTransfer}`);
};
export const fetchInterests = async (accountId) => {
    return await api.get(`/api/accounts/${accountId}/interests`);
};
export const fetchSaveInterests = async (accountId, interests) => {
    return await api.post(`/api/accounts/${accountId}/interests`, interests);
};
export const fetchInterestActivity = async (accountId, interestId, startDate, endDate) => {
    return await api.get(`/api/accounts/${accountId}/interests/${interestId}?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&asActivity=true`);
};
export const fetchAddInterestActivity = async (accountId, activity, interestId) => {
    return await api.post(`/api/accounts/${accountId}/interests/${interestId}?asActivity=true`, activity);
};
export const fetchNames = async () => {
    return await api.get('/api/names');
};
export const fetchSkipBill = async (accountId, billId, isTransfer) => {
    return await api.post(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}&skip=true`);
};
export const fetchSkipInterest = async (accountId) => {
    return await api.post(`/api/accounts/${accountId}/interests?skip=true`);
};
