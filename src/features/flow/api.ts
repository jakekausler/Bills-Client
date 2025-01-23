export const fetchFlow = (
  selectedAccounts: string[],
  startDate: string,
  endDate: string,
): Promise<Flow> => {
  let selectedAccountString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountString = `selected_accounts=${selectedAccounts.join(",")}&`;
  }
  return fetch(
    `/api/flow?${selectedAccountString}start_date=${startDate}&end_date=${endDate}`,
  ).then((response) => response.json());
};
