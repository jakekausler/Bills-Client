import { Account } from "../../types/types";

export const fetchGraphData = async (account: Account, endDate: Date) => {
  const response = await fetch(
    `/api/accounts/${account.id}/graph?endDate=${endDate.toISOString().split('T')[0]}`
  );
  return response.json();
};
