export const fetchGraphViewData = async (accountIds: string[], endDate: string) => {
  let selectedAccountString = "";
  if (accountIds.length > 0) {
    selectedAccountString = `&selected_accounts=${accountIds.join(",")}`;
  }
  const response = await fetch(
    `/api/accounts/graph?end_date=${endDate}${selectedAccountString}`,
  );
  return response.json();
};
