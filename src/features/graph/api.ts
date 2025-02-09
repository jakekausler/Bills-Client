import { Account } from '../../types/types';
import { api } from '../../utils/api';

export const fetchGraphData = async (account: Account, startDate: Date, endDate: Date) => {
  return await api.get(
    `/api/accounts/${account.id}/graph?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
  );
};
