export const fetchCategories = async () => {
  const response = await fetch("/api/categories");
  return response.json();
};

export const fetchCategoryBreakdown = async (startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selected_accounts=${selectedAccounts.join(",")}`;
  }
  const response = await fetch(`/api/categories/breakdown?start_date=${startDate}&end_date=${endDate}${selectedAccountString}`);
  return response.json();
};


export const fetchSelectedCategoryBreakdown = async (category: string, startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selected_accounts=${selectedAccounts.join(",")}`;
  }
  const response = await fetch(`/api/categories/${category}/breakdown?start_date=${startDate}&end_date=${endDate}${selectedAccountString}`);
  return response.json();
};


export const fetchSelectedCategoryActivity = async (category: string, startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selected_accounts=${selectedAccounts.join(",")}`;
  }
  const response = await fetch(`/api/categories/${category}/transactions?start_date=${startDate}&end_date=${endDate}${selectedAccountString}`);
  return response.json();
};
