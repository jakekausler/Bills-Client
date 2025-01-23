export const fetchBills = async (startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountsString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountsString = `&selectedAccounts=${selectedAccounts.join(",")}`;
  }
  const response = await fetch(`/api/calendar/bills?startDate=${startDate}&endDate=${endDate}${selectedAccountsString}`);
  return response.json();
};


