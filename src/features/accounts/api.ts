import { Account } from '../../types/types';
import { api } from '../../utils/api';

export const fetchAccounts = async (): Promise<Account[]> => {
  return await api.get<Account[]>('/api/accounts');
};

export const fetchAddAccount = async (account: Account): Promise<string> => {
  return await api.post<string>('/api/accounts', account);
};

export const fetchEditAccounts = async (accounts: Account[]): Promise<void> => {
  return await api.put<void>('/api/accounts', accounts);
};
