import { RootState } from '../../store';

export const selectHealthcareConfigs = (state: RootState) => state.healthcare.configs;

export const selectHealthcareLoading = (state: RootState) => state.healthcare.loading;

export const selectHealthcareError = (state: RootState) => state.healthcare.error;

export const selectConfigsByPerson = (person: string) => (state: RootState) =>
  state.healthcare.configs.filter((c) => c.coveredPersons?.includes(person));

export const selectActiveConfigs = (date: string) => (state: RootState) =>
  state.healthcare.configs.filter((c) => {
    const startDate = new Date(c.startDate);
    const currentDate = new Date(date);
    const endDate = c.endDate ? new Date(c.endDate) : null;

    return currentDate >= startDate && (!endDate || currentDate <= endDate);
  });

export const selectHSAAccounts = (state: RootState) =>
  state.healthcare.configs
    .map((c) => c.hsaAccountId)
    .filter((id): id is string => id !== null);
