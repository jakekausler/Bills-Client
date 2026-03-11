import { Account } from '../../types/types';
import { api } from '../../utils/api';
import { formatDateISO } from '../../utils/date';

export const fetchGraphData = async (account: Account, startDate: Date, endDate: Date) => {
  return await api.get(
    `/api/accounts/${encodeURIComponent(account.id)}/graph?startDate=${formatDateISO(startDate)}&endDate=${formatDateISO(endDate)}`,
  );
};
