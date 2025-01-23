import { Flow } from "../../types/types";

export const fetchFlow = (
  selectedAccounts: string[],
  startDate: string,
  endDate: string,
): Promise<Flow> => {
  let selectedAccountString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountString = `selectedAccounts=${selectedAccounts.join(",")}&`;
  }
  return fetch(
    `/api/flow?${selectedAccountString}startDate=${startDate}&endDate=${endDate}`,
  ).then((response) => response.json());
};
