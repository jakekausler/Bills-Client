export const fetchBills = async (startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountsString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountsString = `&selected_accounts=${selectedAccounts.join(",")}`;
  }
  const response = await fetch(`/api/calendar/bills?start_date=${startDate}&end_date=${endDate}${selectedAccountsString}`);
  return response.json();
};

