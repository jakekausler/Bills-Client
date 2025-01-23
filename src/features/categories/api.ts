export const fetchCategories = async () => {
  const response = await fetch("/api/categories");
  return response.json();
};

export const fetchCategoryBreakdown = async (startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${selectedAccounts.join(",")}`;
  }
  const response = await fetch(`/api/categories/breakdown?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`);
  return response.json();
};


export const fetchSelectedCategoryBreakdown = async (category: string, startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${selectedAccounts.join(",")}`;
  }
  const response = await fetch(`/api/categories/${category}/breakdown?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`);
  return response.json();
};


export const fetchSelectedCategoryActivity = async (category: string, startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountString = "";
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${selectedAccounts.join(",")}`;
  }
  const response = await fetch(`/api/categories/${category}/transactions?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`);
  return response.json();
};
