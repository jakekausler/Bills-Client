export const selectHealthcareConfigs = (state) => state.healthcare.configs;
export const selectHealthcareLoading = (state) => state.healthcare.loading;
export const selectHealthcareError = (state) => state.healthcare.error;
export const selectConfigsByPerson = (person) => (state) => state.healthcare.configs.filter((c) => c.personName === person);
export const selectActiveConfigs = (date) => (state) => state.healthcare.configs.filter((c) => {
    const startDate = new Date(c.startDate);
    const currentDate = new Date(date);
    const endDate = c.endDate ? new Date(c.endDate) : null;
    return currentDate >= startDate && (!endDate || currentDate <= endDate);
});
export const selectHSAAccounts = (state) => state.healthcare.configs
    .map((c) => c.hsaAccountId)
    .filter((id) => id !== null);
