import { Account, Activity, Bill, Interest } from "../../types/types";

export const fetchActivities = async (
  account: Account,
  startDate: Date,
  endDate: Date,
) => {
  const response = await fetch(
    `/api/accounts/${account.id}/consolidated_activity?start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}`,
  );
  return response.json();
};

export const fetchBill = async (
  accountId: string,
  billId: string,
  isTransfer: boolean,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills/${billId}?is_transfer=${isTransfer}`,
  );
  return response.json();
};

export const fetchAddActivity = async (
  accountId: string,
  activity: Activity,
) => {
  const response = await fetch(`/api/accounts/${accountId}/activity`, {
    method: "PUT",
    body: JSON.stringify(activity),
  });
};

export const fetchSaveActivity = async (
  accountId: string,
  activity: Activity,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/activity/${activity.id}?is_transfer=${activity.is_transfer}`,
    {
      method: "POST",
      body: JSON.stringify(activity),
    },
  );
};

export const fetchRemoveActivity = async (
  accountId: string,
  activityId: string,
  isTransfer: boolean,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/activity/${activityId}?is_transfer=${isTransfer}`,
    {
      method: "DELETE",
    },
  );
};

export const fetchBillActivity = async (
  accountId: string,
  billId: string,
  isTransfer: boolean,
  startDate: Date,
  endDate: Date,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills/${billId}?is_transfer=${isTransfer}&as_activity=true&start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}`,
  );
  return response.json();
};

export const fetchAddBillActivity = async (
  accountId: string,
  activity: Activity,
  billId: string,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills/${billId}?as_activity=true&is_transfer=${activity.is_transfer}`,
    {
      method: "POST",
      body: JSON.stringify(activity),
    },
  );
};

export const fetchAddBill = async (accountId: string, bill: Bill) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills?is_transfer=${bill.is_transfer}`,
    {
      method: "PUT",
      body: JSON.stringify(bill),
    },
  );
};

export const fetchRemoveBill = async (
  accountId: string,
  billId: string,
  isTransfer: boolean,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills/${billId}?is_transfer=${isTransfer}`,
    {
      method: "DELETE",
    },
  );
};

export const fetchSaveBill = async (accountId: string, bill: Bill) => {
  const response = await fetch(
    `/api/accounts/${accountId}/bills/${bill.id}?is_transfer=${bill.is_transfer}`,
    {
      method: "POST",
      body: JSON.stringify(bill),
    },
  );
};

export const fetchInterests = async (accountId: string) => {
  const response = await fetch(`/api/accounts/${accountId}/interests`);
  return response.json();
};

export const fetchSaveInterests = async (
  accountId: string,
  interests: Interest[],
) => {
  const response = await fetch(`/api/accounts/${accountId}/interests`, {
    method: "POST",
    body: JSON.stringify(interests),
  });
};

export const fetchInterestActivity = async (
  accountId: string,
  interestId: string,
  startDate: Date,
  endDate: Date,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/interests/${interestId}?start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}&as_activity=true`,
  );
  return response.json();
};

export const fetchAddInterestActivity = async (
  accountId: string,
  activity: Activity,
  interestId: string,
) => {
  const response = await fetch(
    `/api/accounts/${accountId}/interests/${interestId}?as_activity=true`,
    {
      method: "POST",
      body: JSON.stringify(activity),
    },
  );
};

export const fetchNames = async () => {
  const response = await fetch("/api/names");
  return response.json();
};

export const fetchSkipBill = async (accountId: string, billId: string, isTransfer: boolean) => {
  const response = await fetch(`/api/accounts/${accountId}/bills/${billId}?is_transfer=${isTransfer}&skip=true`, {
    method: "POST",
  });
  return response.json();
};

export const fetchSkipInterest = async (accountId: string) => {
  const response = await fetch(`/api/accounts/${accountId}/interests?skip=true`, {
    method: "POST",
  });
  return response.json();
};
