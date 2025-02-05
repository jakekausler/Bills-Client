import { api } from '../../utils/api';

export const fetchCategories = async () => {
  return await api.get('/api/categories');
};

export const fetchCategoryBreakdown = async (startDate: string, endDate: string, selectedAccounts: string[]) => {
  let selectedAccountString = '';
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${selectedAccounts.join(',')}`;
  }
  return await api.get(`/api/categories/breakdown?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`);
};

export const fetchSelectedCategoryBreakdown = async (
  category: string,
  startDate: string,
  endDate: string,
  selectedAccounts: string[],
) => {
  let selectedAccountString = '';
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${selectedAccounts.join(',')}`;
  }
  return await api.get(
    `/api/categories/${category}/breakdown?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`,
  );
};

export const fetchSelectedCategoryActivity = async (
  category: string,
  startDate: string,
  endDate: string,
  selectedAccounts: string[],
) => {
  let selectedAccountString = '';
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${selectedAccounts.join(',')}`;
  }
  return await api.get(
    `/api/categories/${category}/transactions?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`,
  );
};
