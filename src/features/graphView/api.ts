import { api } from '../../utils/api';

export const fetchGraphViewData = async (accountIds: string[], startDate: string, endDate: string) => {
  let selectedAccountString = '';
  if (accountIds.length > 0) {
    selectedAccountString = `&selectedAccounts=${accountIds.join(',')}`;
  }
  return await api.get(`/api/accounts/graph?startDate=${startDate}&endDate=${endDate}${selectedAccountString}`);
};
