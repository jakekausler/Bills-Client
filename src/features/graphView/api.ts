export const fetchGraphViewData = async (accountIds: string[], endDate: string) => {
  let selectedAccountString = "";
  if (accountIds.length > 0) {
    selectedAccountString = `&selectedAccounts=${accountIds.join(",")}`;
  }
  const response = await fetch(
    `/api/accounts/graph?endDate=${endDate}${selectedAccountString}`,
  );
  return response.json();
};
