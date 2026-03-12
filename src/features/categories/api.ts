import { CategoryActivity, CategoryBreakdown } from '../../types/types';
import { api } from '../../utils/api';

export const fetchCategories = async (): Promise<Record<string, string[]>> => {
  return await api.get<Record<string, string[]>>('/api/categories');
};

export const fetchCategoryBreakdown = async (startDate: string, endDate: string, selectedAccounts: string[]): Promise<CategoryBreakdown> => {
  let selectedAccountString = '';
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${encodeURIComponent(selectedAccounts.join(','))}`;
  }
  return await api.get<CategoryBreakdown>(`/api/categories/breakdown?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`);
};

export const fetchSelectedCategoryBreakdown = async (
  category: string,
  startDate: string,
  endDate: string,
  selectedAccounts: string[],
): Promise<CategoryBreakdown> => {
  let selectedAccountString = '';
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${encodeURIComponent(selectedAccounts.join(','))}`;
  }
  return await api.get<CategoryBreakdown>(
    `/api/categories/${encodeURIComponent(category)}/breakdown?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`,
  );
};

export const fetchSelectedCategoryActivity = async (
  category: string,
  startDate: string,
  endDate: string,
  selectedAccounts: string[],
): Promise<CategoryActivity[]> => {
  let selectedAccountString = '';
  if (selectedAccounts.length > 0) {
    selectedAccountString = `&selectedAccounts=${encodeURIComponent(selectedAccounts.join(','))}`;
  }
  return await api.get<CategoryActivity[]>(
    `/api/categories/${encodeURIComponent(category)}/transactions?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`,
  );
};
