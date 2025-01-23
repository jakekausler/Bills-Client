export const fetchAccounts = async () => {
  const response = await fetch("/api/accounts");
  return response.json();
};
