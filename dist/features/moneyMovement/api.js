import { api } from '../../utils/api';
export async function fetchMoneyMovementChart(startDate, endDate) {
    const response = await api.get(`/api/moneyMovement?startDate=${startDate}&endDate=${endDate}`);
    return response;
}
