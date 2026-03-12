import { CalendarBill } from '../../types/types';
import { api } from '../../utils/api';

export const fetchBills = async (startDate: string, endDate: string, selectedAccounts: string[]): Promise<CalendarBill[]> => {
  let selectedAccountsString = '';
  if (selectedAccounts.length > 0) {
    selectedAccountsString = `&selectedAccounts=${encodeURIComponent(selectedAccounts.join(','))}`;
  }
  return await api.get<CalendarBill[]>(`/api/calendar/bills?startDate=${startDate}&endDate=${endDate}${selectedAccountsString}`);
};
