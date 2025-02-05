import { Account, Activity, Bill, Interest } from '../../types/types';

export const fetchActivities = async (account: Account, startDate: Date, endDate: Date) => {
  const response = await fetch(
    `/api/accounts/${account.id}/consolidated_activity?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
  );
  return response.json();
};

export const fetchBill = async (accountId: string, billId: string, isTransfer: boolean) => {
  const response = await fetch(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}`);
  return response.json();
};

export const fetchAddActivity = async (accountId: string, activity: Activity) => {
  const response = await fetch(`/api/accounts/${accountId}/activity`, {
    method: 'PUT',
    body: JSON.stringify(activity),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const fetchSaveActivity = async (accountId: string, activity: Activity) => {
  const response = await fetch(`/api/accounts/${accountId}/activity/${activity.id}?isTransfer=${activity.isTransfer}`, {
    method: 'POST',
    body: JSON.stringify(activity),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const fetchRemoveActivity = async (accountId: string, activityId: string, isTransfer: boolean) => {
  const response = await fetch(`/api/accounts/${accountId}/activity/${activityId}?isTransfer=${isTransfer}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const fetchChangeAccountForActivity = async (
  accountId: string,
  activityId: string,
  newAccountId: string,
  isTransfer: boolean,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/activity/${activityId}/change_account/${newAccountId}?isTransfer=${isTransfer}`,
    {
      method: 'POST',
    },
  );
  return response.json();
};

export const fetchBillActivity = async (
  accountId: string,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}&asActivity=true&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
  );
  return response.json();
};

export const fetchAddBillActivity = async (accountId: string, activity: Activity, billId: string) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills/${billId}?asActivity=true&isTransfer=${activity.isTransfer}`,
    {
      method: 'POST',
      body: JSON.stringify(activity),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.json();
};

export const fetchAddBill = async (accountId: string, bill: Bill) => {
  const response = await fetch(`/api/accounts/${accountId}/bills?isTransfer=${bill.isTransfer}`, {
    method: 'PUT',
    body: JSON.stringify(bill),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const fetchRemoveBill = async (accountId: string, billId: string, isTransfer: boolean) => {
  const response = await fetch(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const fetchSaveBill = async (accountId: string, bill: Bill) => {
  const response = await fetch(`/api/accounts/${accountId}/bills/${bill.id}?isTransfer=${bill.isTransfer}`, {
    method: 'POST',
    body: JSON.stringify(bill),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const fetchChangeAccountForBill = async (
  accountId: string,
  billId: string,
  newAccountId: string,
  isTransfer: boolean,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills/${billId}/change_account/${newAccountId}?isTransfer=${isTransfer}`,
    {
      method: 'POST',
    },
  );
  return response.json();
};

export const fetchInterests = async (accountId: string) => {
  const response = await fetch(`/api/accounts/${accountId}/interests`);
  return response.json();
};

export const fetchSaveInterests = async (accountId: string, interests: Interest[]) => {
  const response = await fetch(`/api/accounts/${accountId}/interests`, {
    method: 'POST',
    body: JSON.stringify(interests),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const fetchInterestActivity = async (accountId: string, interestId: string, startDate: Date, endDate: Date) => {
  const response = await fetch(
    `/api/accounts/${accountId}/interests/${interestId}?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&asActivity=true`,
  );
  return response.json();
};

export const fetchAddInterestActivity = async (accountId: string, activity: Activity, interestId: string) => {
  const response = await fetch(`/api/accounts/${accountId}/interests/${interestId}?asActivity=true`, {
    method: 'POST',
    body: JSON.stringify(activity),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const fetchNames = async () => {
  const response = await fetch('/api/names');
  return response.json();
};

export const fetchSkipBill = async (accountId: string, billId: string, isTransfer: boolean) => {
  const response = await fetch(`/api/accounts/${accountId}/bills/${billId}?isTransfer=${isTransfer}&skip=true`, {
    method: 'POST',
  });
  return response.json();
};

export const fetchSkipInterest = async (accountId: string) => {
  const response = await fetch(`/api/accounts/${accountId}/interests?skip=true`, {
    method: 'POST',
  });
  return response.json();
};
