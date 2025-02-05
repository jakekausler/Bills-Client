import { api } from '../../utils/api';

export const fetchGraphViewData = async (accountIds: string[], endDate: string) => {
  let selectedAccountString = '';
  if (accountIds.length > 0) {
    selectedAccountString = `&selectedAccounts=${accountIds.join(',')}`;
  }
  return await api.get(`/api/accounts/graph?endDate=${endDate}${selectedAccountString}`);
};
