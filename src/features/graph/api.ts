import { Account } from '../../types/types';
import { api } from '../../utils/api';

export const fetchGraphData = async (account: Account, endDate: Date) => {
  return await api.get(`/api/accounts/${account.id}/graph?endDate=${endDate.toISOString().split('T')[0]}`);
};
