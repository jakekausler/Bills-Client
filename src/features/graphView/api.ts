import { api } from '../../utils/api';

export const fetchGraphViewData = async (
  accountIds: string[],
  selectedSimulations: string[],
  startDate: string,
  endDate: string,
) => {
  let selectedAccountString = '';
  if (accountIds.length > 0) {
    selectedAccountString = `&selectedAccounts=${accountIds.join(',')}`;
  }
  let selectedSimulationString = '';
  if (selectedSimulations.length > 0) {
    console.log('selectedSimulations', selectedSimulations);
    selectedSimulationString = `&selectedSimulations=${selectedSimulations.join(',')}`;
  }
  return await api.get(
    `/api/accounts/graph?startDate=${startDate}&endDate=${endDate}${selectedAccountString}${selectedSimulationString}&combineGraphAccounts=true`,
  );
};
