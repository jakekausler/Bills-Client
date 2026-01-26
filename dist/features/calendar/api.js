import { api } from '../../utils/api';
export const fetchBills = async (startDate, endDate, selectedAccounts) => {
    let selectedAccountsString = '';
    if (selectedAccounts.length > 0) {
        selectedAccountsString = `&selectedAccounts=${selectedAccounts.join(',')}`;
    }
    return await api.get(`/api/calendar/bills?startDate=${startDate}&endDate=${endDate}${selectedAccountsString}`);
};
