import { api } from '../../utils/api';

export const fetchMonteCarloData = async (
  startDate: string,
  endDate: string,
  accountIds: string[],
  nSimulations: number,
) => {
  let selectedAccountString = '';
  if (accountIds.length > 0) {
    selectedAccountString = `&selectedAccounts=${accountIds.join(',')}`;
  }
  return await api.get(
    `/api/monte_carlo?startDate=${startDate}&endDate=${endDate}&nSimulations=${nSimulations}${selectedAccountString}`,
  );
};
