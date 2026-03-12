import { Account } from '../../types/types';
import { api } from '../../utils/api';
import { toDateString } from '../../utils/date';

export type GraphDataResponse = { datasets: Array<{ label: string; data: number[]; borderColor: string; borderDash: number[]; backgroundColor: string; activity: { amount: number; name: string }[] }>; labels: string[]; type: 'activity' | 'yearly' };

export const fetchGraphData = async (account: Account, startDate: Date, endDate: Date): Promise<GraphDataResponse> => {
  return await api.get<GraphDataResponse>(
    `/api/accounts/${encodeURIComponent(account.id)}/graph?startDate=${toDateString(startDate)}&endDate=${toDateString(endDate)}`,
  );
};
