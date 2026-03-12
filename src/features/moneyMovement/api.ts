import { MoneyMovementData } from '../../types/types';
import { api } from '../../utils/api';

export async function fetchMoneyMovementChart(startDate: string, endDate: string): Promise<MoneyMovementData> {
  const response = await api.get<MoneyMovementData>(`/api/moneyMovement?startDate=${startDate}&endDate=${endDate}`);
  return response;
}
