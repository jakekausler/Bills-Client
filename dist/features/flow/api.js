import { api } from '../../utils/api';
export const fetchFlow = async (selectedAccounts, startDate, endDate) => {
    let selectedAccountString = '';
    if (selectedAccounts.length > 0) {
        selectedAccountString = `selectedAccounts=${selectedAccounts.join(',')}&`;
    }
    return await api.get(`/api/flow?${selectedAccountString}startDate=${startDate}&endDate=${endDate}`);
};
