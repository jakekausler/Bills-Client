import { Account } from '../../types/types';
import { api } from '../../utils/api';

export const fetchAccounts = async () => {
  return await api.get('/api/accounts');
};

export const fetchAddAccount = async (account: Account) => {
  return await api.put('/api/accounts', account);
};

export const fetchEditAccounts = async (accounts: Account[]) => {
  return await api.post('/api/accounts', accounts);
};
